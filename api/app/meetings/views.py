import sys
import random
import json
from copy import deepcopy

from django.conf import settings
from django.http import HttpRequest
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from channels import Channel, Group

sys.path.insert(0,settings.BASE_DIR)

from .models import ( 
  Meeting, 
  MeetingInvitation,
  MeetingParticipant,
  AgendaItem,
  AgendaItemStackEntry,
  AgendaItemVote,
)
from app_users.models import AppUser, AuthToken
from app_users.serializers import AppUserSlz
from .serializers import (
  MeetingSlz,
  MeetingInvitationSlz,
)
from core.utils import parse_url_params
from app_users.utils import makeAuthTokenObject, getRequester

User = get_user_model()



@api_view(['POST', 'DELETE'])
def meeting_invitation_view(request, *args, **kwargs):
  """View for CUD on meeting invitations

  Args:
    request: HttpRequest, data has form:
      POST: {'invitee_id': 1, 'meeting_id': 1}
      DELETE: None
    *args: None
    **kwargs: None

  Returns:
    404 if meeting not found
    200, no body
  """
  requester = getRequester(request)
  if request.method == 'POST':
    meeting_id = request.data.get('meeting_id')
    invitee_id = request.data.get('invitee_id')
    meeting = get_object_or_404(Meeting, id=meeting_id)
    invitee = get_object_or_404(AppUser, id=invitee_id)
    user_invitations = MeetingInvitation.objects.filter(meeting=meeting, invitee=invitee)
    # if user already has invitation to this meeting,
    # take no action
    if user_invitations.exists():
      # return Response(status=status.HTTP_200_OK)
      invitation = MeetingInvitation.objects.filter(meeting=meeting, invitee=invitee)[0]
    else:
      invitation = MeetingInvitation.objects.create(
        meeting=meeting,
        inviter=requester,
        invitee=invitee)
    data = {
      'event': 'add_meeting_invitation',
      'meeting_id': meeting.id,
      'meeting_invitation': MeetingInvitationSlz(invitation).data,
    }
    # send message to invitee
    Group("users-%d" % invitee.id).send({"text": json.dumps(data)})
    # send message to anyone listening on meeting
    Group("meetings-%d" % meeting.id).send({"text": json.dumps(data)})
    return Response(status=status.HTTP_200_OK)

  elif request.method == 'DELETE':
    meeting_invitation_id = int(kwargs.get('meeting_invitation_id'))
    invitation = get_object_or_404(MeetingInvitation, id=meeting_invitation_id)
    invitation.delete()
    # broadcast event in delete method of model
    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def login(request, *args, **kwargs):
  """View for login

  Args:
    request: HttpRequest, data attr has form:
      {'username': 'myUsername', 'password', 'myPassword'}
    *args: None
    **kwargs: None

  Returns:
    422 if user with username not found or invalid password
    200 otherwise, response data has form:
      {'token': some_token_str, 'user_data': serial_repr_of_user}

  """
  username = request.data.get('username')
  password = request.data.get('password')
  try:
    user = User.objects.get(username=username)
  except User.DoesNotExist:
    return Response(
      status=status.HTTP_422_UNPROCESSABLE_ENTITY,
      data={'message': 'Invalid username'})

  if user.check_password(password):
    # delete all other tokens associated 
    # with user and create a new one
    for t in AuthToken.objects.filter(user=user):
      t.delete()
    tokenData = makeAuthTokenObject()
    tokenObj = AuthToken.objects.create(
      user=user,
      **tokenData)
    invitations = MeetingInvitation.objects.filter(invitee=user.appuser)
    # TODO(MPP): make actual contacts list instead of just returning all app users
    contacts = AppUser.objects.exclude(id=user.appuser.id).exclude(user__username='admin')
    data = {
      'token': tokenObj.token,
      'user_data': AppUserSlz(user.appuser).data,
      'meeting_invitations': MeetingInvitationSlz(invitations, many=True).data,
      'contacts': AppUserSlz(contacts, many=True).data,
    }
    return Response(data)

  else:
    return Response(
      status=status.HTTP_422_UNPROCESSABLE_ENTITY,
      data={'message': 'Invalid password'})


@api_view(['GET'])
def get_user_data(request, *args, **kwargs):
  """View for getting user data for current user

  Args:
    request: HttpRequest
    *args: None
    **kwargs: None

  Returns:
    200, response data has form:
      {
        'user_data': serial_repr_of_user, 
        'meeting_invitations': serial_repr_of_meeting_invitations_for_user,
        'contacts': serial_repr_of_contacts
      }

  """
  requester = getRequester(request)
  invitations = MeetingInvitation.objects.filter(invitee=requester)
  # TODO(MPP): make actual contacts list instead of just returning all app users
  contacts = AppUser.objects.exclude(id=requester.id).exclude(user__username='admin')
  data = {
    'user_data': AppUserSlz(requester).data,
    'meeting_invitations': MeetingInvitationSlz(invitations, many=True).data,
    'contacts': AppUserSlz(contacts, many=True).data,
  }
  return Response(data)


@api_view(['GET'])
def accept_or_decline_meeting_invitation(request, *args, **kwargs):
  """View for accepting/declining meeting invitations

  Args:
    request: HttpRequest
    *args: None
    **kwargs: {'meeting_invitation_id': 1, 'action': 'accept'}

  Returns:
    404 if meeting invitation does not exist
    403 if requester is not invitee on invitation
    200 if action == 'accept', response data has form:
      {'meeting': serial_repr_of_meeting}
    200 if action == 'decline', no body

  """
  requester = getRequester(request)
  action = kwargs.get('action')
  meeting_invitation_id = int(kwargs.get('meeting_invitation_id'))
  meeting_invitation = get_object_or_404(MeetingInvitation, id=meeting_invitation_id)
  if meeting_invitation.invitee.id != requester.id:
    return Response(
      status=status.HTTP_403_FORBIDDEN,
      data={'message': 'Meeting invitation does not belong to requester'})
  if action == 'accept':
    setattr(meeting_invitation, 'status', MeetingInvitation.ACCEPTED)
    meeting_invitation.save()
    # check if meeting participant already exists
    # if not, make new meeting participant
    try:
      participant = MeetingParticipant.objects.get(app_user=requester, meeting=meeting_invitation.meeting)
    except MeetingParticipant.DoesNotExist:
      participant = MeetingParticipant.objects.create(
        app_user=requester,
        meeting=meeting_invitation.meeting)
    data = {
      'event': 'update_meeting_invitation',
      'meeting_invitation': MeetingInvitationSlz(meeting_invitation).data,
    }
    Group('users-%d' % requester.id).send({'text': json.dumps(data)})
    data = {
      'meeting': MeetingSlz(meeting_invitation.meeting, context={'requester': requester}).data,
    }
    return Response(data)

  else:
    setattr(meeting_invitation, 'status', MeetingInvitation.DECLINED)
    meeting_invitation.save()
    return Response(status=status.HTTP_200_OK)



@api_view(['POST', 'DELETE'])
def post_agenda_item_vote(request, *args, **kwargs):
  """View for posting/deleting a vote for/against an AgendaItem

  Args:
    request: HttpRequest, data attr has form:
      {'vote_type': 'up'}
    *args: None
    **kwargs: kwargs from url parsing, has form:
      {'agenda_item_id': 1}

  Returns:
    404 if agenda_item not found
    200 with no body otherwise
  """
  # TODO(MPP): validate request.data before creating new vote instance
  requester = getRequester(request)
  agenda_item_id = kwargs.get('agenda_item_id')
  agenda_item = get_object_or_404(AgendaItem, id=agenda_item_id)
  votes = AgendaItemVote.objects.filter(agenda_item=agenda_item)

  if request.method == 'POST':
    # If user has already cast vote for agenda_item, update that vote instance
    if votes.filter(owner=requester).exists():
      vote = votes.filter(owner=requester)[0]
      setattr(vote, 'vote_type', request.data.get('vote_type'))
      vote.save(vote_query_set=votes)
      return Response(status=status.HTTP_200_OK)
    else:
      agenda_item_vote = AgendaItemVote.objects.create(
        owner=requester,
        agenda_item=agenda_item,
        vote_type=request.data.get('vote_type'))
      return Response(status=status.HTTP_200_OK)

  elif request.method == 'DELETE':
    if votes.filter(owner=requester).exists():
      vote = votes.filter(owner=requester)[0]
      vote.delete()
      return Response(status=status.HTTP_200_OK)
    else:
      return Response(status=status.HTTP_200_OK)


@api_view(['POST', 'DELETE'])
def post_agenda_item_stack_entry(request, *args, **kwargs):
  """View for adding or removing user from agenda item stack

  Args:
    request: HttpRequest, data attr has form:
      {'agenda_item_id': 1}
    args: None
    kwargs: None
  Returns:
    404 if agenda_item not found
    422 if already in stack
    200 otherwise
  """
  requester = getRequester(request)
  agenda_item_id = request.data.pop('agenda_item_id', None)
  agenda_item = get_object_or_404(AgendaItem, id=agenda_item_id)
  if request.method == 'POST':
  # If user is already on stack, reply 422
    if agenda_item.agendaitemstackentry_set.filter(owner=requester).exists():
      return Response(
        status=status.HTTP_422_UNPROCESSABLE_ENTITY, 
        data={'message': 'Already on stack.'})
    
    agenda_item_stack_entry = AgendaItemStackEntry.objects.create(
      owner=requester,
      agenda_item=agenda_item)
    return Response(status=status.HTTP_200_OK)

  elif request.method == 'DELETE':
    entries = agenda_item.agendaitemstackentry_set.filter(owner=requester)
    for e in entries:
      e.delete()
    return Response(status=status.HTTP_200_OK)



@api_view(['POST'])
def post_agenda_item(request, *args, **kwargs):
  """View for adding AgendaItems

  Args:
    request: HttpRequest, data attr has form:
      {'meeting_id': 1, 'title': 'some title', 'body': 'some body'}
    *args: None
    **kwargs: kwargs from url parsing.  If updating existing item,
      kwargs will have form {'agenda_item_id': 1}.  If adding new item,
      kwargs is empty.

  Returns:
    404 if related Meeting not found
    404 if target AgendaItem not found
    200 with no body otherwise
  """
  requester = getRequester(request)
  agenda_item_id = kwargs.get('agenda_item_id', None)
  meeting_id = request.data.pop('meeting_id')
  meeting = get_object_or_404(Meeting, id=meeting_id)

  # ** Note:  Right now, after update/create 
  # client receives data
  # via websocket publish called from save()
  # method of AgendaItem and NOT from this view.  
  # Refer to that save() method to see Group
  # publish

  # TODO: validation of form

  # if agenda_item_id, update item
  if agenda_item_id:
    agenda_item = get_object_or_404(AgendaItem, id=agenda_item_id)
    for k,v in request.data.items():
      setattr(agenda_item, k, v)
    agenda_item.save()
    return Response(status=status.HTTP_200_OK)
  # else create new agenda item
  else:
    agenda_item = AgendaItem.objects.create(
      meeting=meeting,
      owner=requester,
      **request.data)
    return Response(status=status.HTTP_200_OK)


@api_view(['GET', 'POST',])
def meetings_view(request, *args, **kwargs):
  """View for meetings.

  GET: get meetings to which requester has been invited and has accepted invitation.
  POST: post new meeting

  Args:
    request: HttpRequest, no body
    args: None
    kwargs: None

  Returns:
    200, {'[list_of_meetings]''}
  """
  requester = getRequester(request)
  if request.method == 'GET':
    meeting_invitations = MeetingInvitation.objects.filter(invitee=requester, status=MeetingInvitation.ACCEPTED)
    # make sure returned meetings are a set
    invited_meetings = list(set([mi.meeting for mi in meeting_invitations]))
    owned_meetings = Meeting.objects.filter(owner=requester)
    # merge lists
    meetings = list(owned_meetings) + invited_meetings
    slz = MeetingSlz(meetings, many=True, context={'requester': requester})
    return Response(slz.data)

  elif request.method == 'POST':
    # TODO(MPP): validate data before creating meeting
    meeting = Meeting.objects.create(
      owner=requester,
      **request.data)
    # create meeting participant 
    participant = MeetingParticipant.objects.create(
      app_user=requester,
      meeting=meeting)
    slz = MeetingSlz(meeting, context={'requester': requester})
    return Response(slz.data)


@api_view(['GET', 'PATCH',])
def meeting_view(request, *args, **kwargs):
  """View for single meeting

  GET: return meeting
  PATCH: update meeting

  Args:
    request: HttpRequest, data attr:
      {'title': 'some title', 'description': 'some desc'}
    args: None
    kwargs: {'meeting_id': 1}

  Returns:
    404 if meeting not found
    200 if meeting found or meeting created, body has form: {serial_repr_of_meeting}
  """
  #TODO(MPP): make sure requester is authorized to get/update meeting
  requester = getRequester(request)
  meeting_id = int(kwargs.get('meeting_id'))
  meeting = get_object_or_404(Meeting, id=meeting_id)

  if request.method == 'GET':
    slz = MeetingSlz(meeting, context={'requester': requester})
    return Response(slz.data)

  elif request.method == 'PATCH':
    # TODO(MPP): validate data
    for k,v in request.data.items():
      setattr(meeting, k, v)
    meeting.save()
    slz = MeetingSlz(meeting, context={'requester': requester})
    return Response(slz.data)




