import random
from .models import *
from django.contrib.auth import get_user_model
from faker import Faker
fake = Faker()

app_users = AppUser.objects.all()

class TopicFactory(object):
	@staticmethod
	def make(*args, **kwargs):
		k = kwargs
		id = k.get('id')
		topic = Topic.objects.create(
			id=id,
			**kwargs
		)
		return topic

	@staticmethod
	def make_fake(*args, **kwargs):
		k = kwargs

		title = make_topic_title()
		body = make_topic_body()
		owner = k.get('owner', get_owner())

		return TopicFactory.make(title=title, body=body, owner=owner, **kwargs)


class TopicCommentFactory(object):
	@staticmethod
	def make(*args, **kwargs):
		k = kwargs
		id = k.get('id')
		topic = k.get('topic', TopicFactory.make_fake())
		owner = k.get('owner', get_owner())
		topic_comment = TopicComment.objects.create(
			id=id,
			owner=owner,
			body=make_topic_comment_body(),
		)
		return topic_comment

	@staticmethod
	def make_fake(*args, **kwargs):
		k = kwargs

		id = k.get('id')
		body = make_topic_comment_body()
		#topic = k.get('topic', TopicFactory.make_fake())
		topic = k.get('topic')
		owner = k.get('owner', get_owner())

		topic_comment = TopicComment.objects.create(
			id=id,
			owner=owner,
			topic=topic,
			body=body,
		)
		return topic_comment


class VoteFactory(object):
	@staticmethod
	def make(*args, **kwargs):
		vote = Vote.objects.create(
			**kwargs
		)
		return vote

	@staticmethod
	def make_fake(*args, **kwargs):
		return VoteFactory.make(**kwargs)


def make_vote_counts(users_count):
	# ensure that there are never
	# more votes than there are users
	third = int(users_count/3)
	up_votes = random.randint(0, third)
	down_votes = random.randint(0, third)
	meh_votes = random.randint(0, third)
	# up_votes = 2
	# down_votes = 3
	# meh_votes = 4
	return up_votes, down_votes, meh_votes

def get_owner():
	app_users = AppUser.objects.all()
	return random.choice(app_users)

def make_topic_title():
	return fake.sentence()

def make_topic_body():
	return fake.text()

def make_topic_comment_body():
	return make_topic_body()
