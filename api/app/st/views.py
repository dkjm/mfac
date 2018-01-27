import sys
from django.conf import settings
sys.path.insert(0,settings.BASE_DIR)
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.http import HttpRequest
from .models import Topic, Vote
from .serializers import TopicSlz
import random
from django.shortcuts import get_object_or_404
from copy import deepcopy
from app_users.models import AppUser
from core.utils import parse_url_params

# using this just for consistency in
# requests.  Actual requests will get
# requester via token
owner_id = 2


# @api_view(['POST'])
# def post_vote(request):
# 	requester = AppUser.objects.get(id=owner_id)
# 	print('++++++', request.query_params)

# 	if 'topic_id' in request.query_params:
# 		print('in keys')
# 		params = deepcopy(request.query_params)
# 		print('**** params', params)
		
# 		if request.method == 'GET':
# 			return get_topic(topic_id=topic_id, **request.query_params)
# 		elif request.method == 'POST':
# 			return post_vote(**request.query_params)

# 	else:
# 		print('not in keys')
# 		topics = Topic.objects.order_by('created_on')
# 		slz = TopicSlz(topics, many=True, context={'requester': requester})
# 		return Response(slz.data)


@api_view(['GET', 'POST'])
def all_topics(request):
	requester = AppUser.objects.get(id=owner_id)

	if request.method == 'GET':
		topics = Topic.objects.order_by('created_on')
		slz = TopicSlz(topics, many=True, context={'requester': requester})
		return Response(slz.data)

	elif request.method == 'POST':
		# todo:  validate data using serializer

		print('data', request.data)
		topic = Topic.objects.create(owner=requester, **request.data)

		# not sure if I should return data in this
		# response, or let the channel handle it.
		# Letting channel handle it for now
		return Response(status=status.HTTP_200_OK)


#@api_view(['GET'])
def get_topic(request, *args, **kwargs):
	print('kwargs', kwargs)
	topic_id = int(kwargs.get('topic_id').replace('/', '').strip())
	#topic = Topic.objects.get(kwargs.get('topic_id'))
	try:
		topic = Topic.objects.get(id=topic_id)
	except Topic.DoesNotExist:
		topic = Topic.objects.first()
	print('=====', topic)
	slz = TopicSlz(topic)
	return Response(slz.data)


@api_view(['POST', 'DELETE'])
def post_vote(request, *args, **kwargs):

	requester = AppUser.objects.get(id=owner_id)
	params = parse_url_params(kwargs.get('params', ''))
	topic_id = int(params.get('topic_id'))
	vote_type = params.get('vote_type')
	topic = get_object_or_404(Topic, id=topic_id)
	user_votes = topic.vote_set.filter(owner=requester)

	if request.method == 'POST':
		# if user has voted for this topic...
		if user_votes.exists():
			vote = user_votes[0]
			# if vote_type is not changing, ignore
			if vote.vote_type == vote_type:
				data = {
					'event': 'post_vote',
					'topic_id': topic.id,
					'votes': topic.get_vote_counts(requester=requester),
				}
				return Response(data)
			# else vote_type is changing...
			else:
				#print('changing vote')
				old_vote_type = vote.vote_type
				setattr(vote, 'vote_type', vote_type)
				vote.save(old_vote_type=old_vote_type)
				# DO send data here back as response
				data = {
					'event': 'post_vote',
					'topic_id': topic.id,
					'votes': topic.get_vote_counts(requester=requester),
				}
				return Response(data)
		# else user has NOT voted for topic...
		else:
			#print('new vote')
			vote = Vote.objects.create(
				topic=topic,
				vote_type=vote_type,
				owner=requester)

			data = {
				'event': 'post_vote',
				'topic_id': topic.id,
				'votes': topic.get_vote_counts(requester=requester),
			}
			return Response(data)



	elif request.method == 'DELETE':
		# if user has voted for this topic...
		user_votes = topic.vote_set.filter(owner=requester)
		# save the query set for reuse in 
		# get_vote_count method on topic
		updated_votes = user_votes
		if user_votes.exists():
			vote = user_votes[0]
			# get vote_id before deleting
			vote_id = vote.id
			vote.delete()
			updated_votes = user_votes.exclude(id=vote_id)
		# even if user has not voted for this topic
		# (due to some kind of error), return 200
		data = {
			'event': 'post_vote',
			'topic_id': topic.id,
			'votes': topic.get_vote_counts(requester=requester, votes=updated_votes),
		}
		return Response(data)


@api_view(['POST'])
def delete_vote(request, *args, **kwargs):

	requester = AppUser.objects.get(id=owner_id)
	print('post_vote')
	print('kwargs', kwargs)
	params = parse_url_params(kwargs.get('params', ''))
	print('params', params)
	#return Response(status.HTTP_200_OK)

	topic_id = int(params.get('topic_id'))
	vote_type = params.get('vote_type')

	topic = get_object_or_404(Topic, id=topic_id)

	votes = topic.vote_set.all()

	# if user has voted for this topic...
	if votes.filter(owner=requester).exists():
		vote = votes.filter(owner=requester)[0]
		# if vote_type is not changing, ignore
		if vote.vote_type == vote_type:
			print('same vote')
			return Response(status=status.HTTP_200_OK)
		# else vote_type is changing...
		else:
			print('changing vote')
			old_vote_type = vote.vote_type
			setattr(vote, 'vote_type', vote_type)
			vote.save(old_vote_type=old_vote_type)
			# don't send data in response; channels
			# will handle that
			return Response(status=status.HTTP_200_OK)
	# else user has NOT voted for topic...
	else:
		print('new vote')
		vote = Vote.objects.create(
			topic=topic,
			vote_type=vote_type,
			owner=requester)
		return Response(status=status.HTTP_200_OK)