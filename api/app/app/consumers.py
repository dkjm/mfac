import sys
import json
from django.conf import settings
from channels import Channel, Group
from channels.sessions import channel_session
sys.path.insert(0, settings.BASE_DIR)
from app_users.models import AppUser, AuthToken
from meetings.models import (
  Meeting,
  MeetingParticipant,
  MeetingInvitation,
  )
from app_users.utils import isValidToken, getRequesterFromToken
from app_users.serializers import AppUserSlz
from meetings.serializers import MeetingSlz


# Connected to websocket.connect
@channel_session
def meetings_connect(message, **kwargs):
  meeting_id = int(kwargs.get('meeting_id'))
  tokenStr = kwargs.get('token')
  # TODO(MPP): make 1. token check and 2. getting requester
  # into one streamlined action instead
  # of multiple queries it uses in its current state
  if not isValidToken(tokenStr):
    message.reply_channel.send({"accept": False})
  requester = getRequesterFromToken(tokenStr)
  if requester == None:
    message.reply_channel.send({"accept": False})
  # if meeting doesn't exist, reject conn
  try:
    meeting = Meeting.objects.get(id=meeting_id)
  except Meeting.DoesNotExist:
    message.reply_channel.send({"accept": False})
  
  # if requester is not owner, check that they have invitation
  if meeting.owner != requester:
    # check that requester has indeed received an invite
    # to this meeting
    try:
      meeting_invitation = MeetingInvitation.objects.get(meeting=meeting, invitee=requester)
    except MeetingInvitation.DoesNotExist:
      message.reply_channel.send({"accept": False})

  # get meeting participant, or if does not exist yet
  # create one
  try:
    participant = MeetingParticipant.objects.get(meeting=meeting, app_user=requester)
  except MeetingParticipant.DoesNotExist:
    participant = MeetingParticipant.objects.create(meeting=meeting, app_user=requester)
  
  # set to present
  setattr(participant, 'status', MeetingParticipant.PRESENT)
  participant.save()

  # Save room and token in session, add conn to the group
  message.channel_session['meeting_id'] = meeting_id
  message.channel_session['token'] = tokenStr
  Group('meetings-%d' % meeting_id).add(message.reply_channel)
    # Accept the connection request and send back
    # serial rep of meeting
  data = {
    'event': 'update_meeting',
    'meeting': MeetingSlz(meeting, context={'requester': requester}).data,
  }
  message.reply_channel.send({"accept": True})

  message.reply_channel.send({"text": json.dumps(data)})

  # Broadcast to all current listeners that 
  # new participant has joined
  data = {
    'event': 'add_meeting_participant',
    'meeting_id': meeting_id,
    'participant': AppUserSlz(participant.app_user).data,
  }
  Group('meetings-%d' % meeting_id).send({
    "text": json.dumps(data),
    })

# Connected to websocket.receive
@channel_session
def meetings_message(message, **kwargs):
  # Stick the message onto the processing queue
  Channel('meetings').send({
      'meeting_id': message.channel_session['meeting_id'],
      'message': message['text'],
  })

# Connected to websocket.disconnect
# @channel_session
# def meetings_disconnect(message, **kwargs):
#   meeting_id = int(kwargs.get('meeting_id'))
#   Group('meetings-%d' % message.channel_session['meeting_id']).discard(message.reply_channel)

# Connected to websocket.disconnect
@channel_session
def meetings_disconnect(message, **kwargs):
  meeting_id = int(kwargs.get('meeting_id'))
  # not sure why can't get token from channel_session
  # as I'm storing it in the connect func
  #tokenStr = message.channel_session['token']
  tokenStr = kwargs.get('token')
  requester = getRequesterFromToken(tokenStr)
  if requester == None:
    Group('meetings-%d' % message.channel_session['meeting_id']).discard(message.reply_channel)
    return
  # TODO(MPP): ugly i know
  if Meeting.objects.filter(id=meeting_id).exists():
    meeting = Meeting.objects.get(id=meeting_id)
    try:
      participant = MeetingParticipant.objects.get(meeting=meeting, app_user=requester)
      setattr(participant, 'status', MeetingParticipant.ABSENT)
      participant.save()
    except MeetingParticipant.DoesNotExist:
      pass

  data = {
    'event': 'remove_meeting_participant',
    'meeting_id': meeting_id,
    'participant': AppUserSlz(requester).data,
  }
  Group('meetings-%d' % message.channel_session['meeting_id']).discard(message.reply_channel)
  Group('meetings-%d' % meeting_id).send({
    "text": json.dumps(data),
    })





# Connected to websocket.connect
@channel_session
def user_connect(message, **kwargs):
  user_id = int(kwargs.get('user_id'))
  tokenStr = kwargs.get('token')
  if not isValidToken(tokenStr):
    message.reply_channel.send({"accept": False})
  # Save room in session and add us to the group
  message.channel_session['user_id'] = user_id
  Group('users-%d' % user_id).add(message.reply_channel)
  # Accept the connection request
  message.reply_channel.send({"accept": True})


# Connected to websocket.receive
@channel_session
def user_message(message, **kwargs):
  # Stick the message onto the processing queue
  Channel('users').send({
      'user_id': message.channel_session['user_id'],
      'message': message['text'],
  })

# Connected to websocket.disconnect
@channel_session
def user_disconnect(message, **kwargs):
  print('USER DISCONNECT =======')
  Group('users-%d' % message.channel_session['user_id']).discard(message.reply_channel)