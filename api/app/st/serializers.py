import sys
from django.conf import settings
sys.path.insert(0, settings.BASE_DIR)
from rest_framework import serializers

from .models import Topic, TopicComment, Vote
from app_users.serializers import AppUserSlz


class TopicSlz(serializers.ModelSerializer):

	topic_comments = serializers.SerializerMethodField()

	owner = serializers.SerializerMethodField()

	votes = serializers.SerializerMethodField()

	def get_topic_comments(self, obj):
		topic_comments = obj.topiccomment_set.order_by('created_on')
		slz = TopicCommentSlz(topic_comments, many=True)
		return slz.data

	def get_owner(self, obj):
		slz = AppUserSlz(obj.owner)
		return slz.data

	def get_votes(self, obj):
		requester = self.context.get('requester')
		all_votes = obj.vote_set.all()
		up_votes = all_votes.filter(vote_type=Vote.UP)
		down_votes = all_votes.filter(vote_type=Vote.DOWN)
		meh_votes = all_votes.filter(vote_type=Vote.MEH)

		user_vote = None
		if requester:
			if up_votes.filter(owner_id=requester.id).exists():
				user_vote = Vote.UP
			elif down_votes.filter(owner_id=requester.id).exists():
				user_vote = Vote.DOWN
			elif meh_votes.filter(owner_id=requester.id).exists():
				user_vote = Vote.MEH 

		result = {
			'up': up_votes.count(),
			'down': down_votes.count(),
			'meh': meh_votes.count(),
			'user_vote': user_vote,
		}

		return result


	class Meta:
		model = Topic
		fields = (
			'id',
			'topic_comments',
			'title',
			'body',
			'owner',
			'votes',
			'created_on',
			'updated_on',
			)


class TopicCommentSlz(serializers.ModelSerializer):

	owner = serializers.SerializerMethodField()

	def get_owner(self, obj):
		slz = AppUserSlz(obj.owner)
		return slz.data

	class Meta:
		model = TopicComment
		fields = (
			'id',
			'owner',
			'body',
			'created_on',
			'updated_on',
			)







