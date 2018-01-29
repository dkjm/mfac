import datetime
import os

from django.db import models
#from django.contrib.auth.models import User, Group
from django.conf import settings
from app_users.models import AppUser
from channels import Channel, Group
from rest_framework.renderers import JSONRenderer
import json

# using this for testing
meeting_id = 1


class Topic(models.Model):

	owner = models.ForeignKey(
		AppUser,
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	title = models.CharField(
		max_length=500,
		blank=False,
		null=False)

	body = models.CharField(
		max_length=5000,
		blank=True,
		null=False)

	created_on = models.DateTimeField(
		auto_now_add=True,
		null=False, 
		blank=False)

	updated_on = models.DateTimeField(
		auto_now=True,
		null=False, 
		blank=False)

	version = models.PositiveIntegerField(
		blank=False,
		null=False,
		default=0)


	def __str__(self):
		body = self.body[:len(self.body) if len(self.body) < 20 else 20]
		s = '{0} - {1} - {2}'.format(self.id, self.title, body)
		return s

	def get_vote_counts(self, *args, **kwargs):
		requester = kwargs.get('requester')
		votes = kwargs.get('votes')
		# if votes (a query set) not passed as arg,
		# query for votes here
		if not votes:
			votes = self.vote_set.all()

		up = votes.filter(vote_type=Vote.UP).count()
		down = votes.filter(vote_type=Vote.DOWN).count()
		meh = votes.filter(vote_type=Vote.MEH).count()

		user_vote = None

		if requester:
			try:
				user_vote = votes.filter(owner=requester)[0].vote_type
			except IndexError:
				pass

		result = {
			'up': up,
			'down': down,
			'meh': meh,
			'user_vote': user_vote,
		}

		return result


	def save(self, *args, **kwargs):
		# doing serializer import here to avoid
		# circular dependency issues
		from .serializers import TopicSlz

		setattr(self, 'version', self.version + 1)
		super().save(*args, **kwargs)
		slz = TopicSlz(self)
		# slz.data is of type ReturnDict,
		# which is almost the same as a
		# regular python dict.  
		# Need to convert dict to string 
		# using json.dumps, then send
		# ** I think that you can only
		# send messages with a "text" key.
		# Other keys will break
		data = {
			'event': 'add_topic',
			'topic': slz.data,
		}
		
		# this is where all subscribers to this 
		# channel will be notified of new topic
		Group("meetings-%d" % meeting_id).send({"text": json.dumps(data)})


class TopicComment(models.Model):

	owner = models.ForeignKey(
		AppUser,
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	topic = models.ForeignKey(
		'Topic',
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	parent_topic_comment = models.ForeignKey(
		'self', 
		null=True,
		on_delete=models.CASCADE)

	body = models.CharField(
		max_length=5000,
		blank=True,
		null=False)

	version = models.PositiveIntegerField(
		blank=False,
		null=False,
		default=0)

	created_on = models.DateTimeField(
		auto_now_add=True,
		null=True, 
		blank=True)

	updated_on = models.DateTimeField(
		auto_now=True,
		null=True, 
		blank=True)

	def __str__(self):
		body = self.body[:len(self.body) if len(self.body) < 20 else 20]
		s = '{0} - {1}'.format(self.id, body)
		return s

	def get_owner_name(self):
		return self.owner.get_full_name()

	def get_owner_id(self):
		return self.owner.id





class Vote(models.Model):

	UP = 'up'
	DOWN = 'down'
	MEH = 'meh'

	# pass this iterable as 
	# 'choices' to model and control
	# how choices appear in admin interface
	VOTE_TYPES = (
		(UP, 'up'),
		(DOWN, 'down'),
		(MEH, 'meh'),
	)

	owner = models.ForeignKey(
		AppUser,
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	topic = models.ForeignKey(
		Topic,
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	vote_type = models.CharField(
		'self', 
		max_length=10,
		null=False,
		blank=False,
		choices=VOTE_TYPES)

	# todo:  add prev_vote_type field to avoid
	# having to pass 'old_vote_type' param to 
	# save method
	prev_vote_type = models.CharField(
		'self', 
		max_length=10,
		null=True,
		blank=True,
		choices=VOTE_TYPES)

	version = models.PositiveIntegerField(
		blank=False,
		null=False,
		default=0)

	created_on = models.DateTimeField(
		auto_now_add=True,
		null=True, 
		blank=True)

	updated_on = models.DateTimeField(
		auto_now=True,
		null=True, 
		blank=True)

	def __str__(self):
		s = '{0} - topic: {1} - {2} - {3}'.format(self.id, self.topic.id, self.topic.title, self.vote_type)
		return s

	def save(self, *args, **kwargs):
		old_vote_type = kwargs.pop('old_vote_type', None)
		# print(self.vote_type)
		# print('prev_vote_type before', self.prev_vote_type)
		# setattr(self, 'prev_vote_type', self.vote_type)
		setattr(self, 'version', self.version + 1)
		super().save(*args, **kwargs)
		data = {
			'event': 'add_vote',
			'topic_id': self.topic.id,
			'vote': {
				'id': self.id,
				'owner_id': self.owner.id,
				'vote_type': self.vote_type,
				'old_vote_type': old_vote_type,
			}
		}
		Group("meetings-%d" % meeting_id).send({
				"text": json.dumps(data),
			})

	def delete(self, *args, **kwargs):
		id = self.id
		super().delete(*args, **kwargs)
		data = {
			'event': 'delete_vote',
			'topic_id': self.topic.id,
			'vote': {
				'id': id,
				'owner_id': self.owner.id,
				'vote_type': self.vote_type,
			}
		}
		Group("topics-%d" % self.topic.id).send({
				"text": json.dumps(data),
			})


# 180127 - MPP - Nothing implemented using 
# below Stack model
class Stack(models.Model):

	owner = models.ForeignKey(
		AppUser,
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	version = models.PositiveIntegerField(
		blank=False,
		null=False,
		default=0)

	created_on = models.DateTimeField(
		auto_now_add=True,
		null=True, 
		blank=True)

	updated_on = models.DateTimeField(
		auto_now=True,
		null=True, 
		blank=True)


	def __str__(self):
		s = '{0}'.format(self.id)
		return s

	def save(self, *args, **kwargs):
		super().save(*args, **kwargs)




