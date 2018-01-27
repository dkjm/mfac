import sys
import json
from django.conf import settings
sys.path.insert(0, settings.BASE_DIR)
from channels import Channel, Group
from channels.sessions import channel_session
from app_users.models import AppUser
from st.models import Topic, Vote
from st.serializers import TopicSlz


# Connected to websocket.connect
@channel_session
def meetings_connect(message, **kwargs):
    # Work out room name from path (ignore slashes)
    #meeting_id = message.content['path'].strip("/")
    meeting_id = int(kwargs.get('meeting_id'))
    # Save room in session and add us to the group
    message.channel_session['meeting_id'] = meeting_id
    Group("meetings-%d" % meeting_id).add(message.reply_channel)
    # Accept the connection request
    message.reply_channel.send({"accept": True})

# Connected to websocket.receive
@channel_session
def meetings_message(message, **kwargs):
    # Stick the message onto the processing queue
    Channel("meetings").send({
        "meeting_id": message.channel_session['meeting_id'],
        "message": message['text'],
    })

# Connected to websocket.disconnect
@channel_session
def meetings_disconnect(message, **kwargs):
    Group("meetings-%d" % message.channel_session['meeting_id']).discard(message.reply_channel)










# Connected to chat-messages
def topic_consumer(message):
    # Save to model
    print('message: ', message)
    room = message.content['room']
    topic = Topic.objects.first()
    topic.save()
    # Broadcast to listening sockets
    Group("topics-%d" % topic.id).send({
        "topic": TopicSlz(topic).data,
    })

# Connected to websocket.connect
@channel_session
def ws_connect(message, **kwargs):
    # Work out room name from path (ignore slashes)
    #topic_id = message.content['path'].strip("/")
    topic_id = int(kwargs.get('topic_id'))
    print('TOPIC ID', topic_id)
    # Save room in session and add us to the group
    message.channel_session['topic_id'] = topic_id
    Group("topics-%d" % topic_id).add(message.reply_channel)
    # Accept the connection request
    message.reply_channel.send({"accept": True})

# Connected to websocket.receive
@channel_session
def ws_message(message, **kwargs):
    # Stick the message onto the processing queue
    print('message', message['text'])
    Channel("topics").send({
        "topic_id": message.channel_session['topic_id'],
        "message": message['text'],
    })

    user_id = 2

    data = json.loads(message['text'])
    vote_type = data.get('vote_type')
    topic_id = message.channel_session['topic_id']
    topic = Topic.objects.get(id=topic_id)
    user_votes = topic.vote_set.filter(owner__id=user_id)

    if user_votes.count():
    	# get first item because filter
    	# returns an array.  There
    	# should only every be one vote
    	# for each user per topic
    	vote = user_votes[0]
    	# if vote_type is the same as
    	# the already-cast-vote,
    	# delete it,
    	# otherwise, change vote_type
    	if vote.vote_type == vote_type:
    		vote.delete()
    	else:
    		old_vote_type = vote.vote_type
    		setattr(vote, 'vote_type', vote_type)
    		# need get value of vote_type before changing it,
    		# then pass into save method.
    		# This way, channels can be alerted of change
    		vote.save(old_vote_type=old_vote_type)
    # if user has not cast a vote
    # for this topic, create new vote
    else:
    	vote = Vote.objects.create(
    		owner=AppUser.objects.get(id=user_id),
    		topic=topic,
    		vote_type=vote_type)



# Connected to websocket.disconnect
@channel_session
def ws_disconnect(message, **kwargs):
    Group("topic-%d" % message.channel_session['topic_id']).discard(message.reply_channel)