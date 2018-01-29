import sys
import os
import re
import subprocess
import random
import copy
from django.conf import settings
sys.path.insert(0, settings.BASE_DIR)


from django.core.management.base import BaseCommand, CommandError
from oauth2_provider.models import get_application_model
Application = get_application_model()

from app_users.models import AppUser
from meetings.models import (
	Topic, 
	TopicComment, 
	Vote,
)

from app_users.factories.app_user_factory import (
	UserFactory, 
	AppUserFactory
)
from meetings.factories.topic_factory import (
	TopicFactory, 
	TopicCommentFactory, 
	VoteFactory, 
	make_vote_counts,
)



class Command(BaseCommand):

	def add_arguments(self, parser):
		parser.add_argument(
			'--user-count',
			dest='user_count',
			default=30)
		parser.add_argument(
			'--user-id',
			dest='user_id',
			default=2)
		parser.add_argument(
			'--topic-count',
			dest='topic_count',
			default=10)
		parser.add_argument(
			'--topic-comment-count',
			dest='topic_comment_count',
			default=10)

	def handle(self, *args, **options):
		print('Making data...')

		user_count = options.get('user_count')
		topic_count = options.get('topic_count') 
		topic_comment_count = options.get('topic_comment_count')
		user_id = options.get('user_id')

		# using user_id as a way of maintaining
		# consistency in the event that you run
		# makeData and deleteData multiple times.
		# id's will be different on each run, so
		# you can have at least 1 user whose id
		# will always == user_id
		# (also, admin user will always have id==1)
		try:
			chosen_app_user = AppUser.objects.get(id=user_id)
		except AppUser.DoesNotExist:
			chosen_app_user = AppUserFactory.make_fake(id=user_id)

		for i in range(1, user_count + 1):
			try:
				app_user = AppUser.objects.get(id=i)
			except AppUser.DoesNotExist:
				app_user = AppUserFactory.make_fake(id=i)
		
		topic_comment_counter = 0

		# excluding admin user, assuming its used
		# for internal purposes only
		app_users = AppUser.objects.exclude(user__username='admin')

		vote_count = 0

		for _ in range(topic_count):
			# make a copy of app_users query set
			# as for each topic we will remove
			# app_users from list as they "cast"
			# their votes
			copy1 = list(app_users)

			topic = TopicFactory.make_fake()

			up, down, meh = make_vote_counts(app_users.count())

			# augment vote_count for each topic
			vote_count += up + down + meh

			chosen_app_user_vote_type = random.choice(Vote.VOTE_TYPES)[0]
			chosen_app_user_has_voted = False

		# up
			for __ in range(up):
				if chosen_app_user_vote_type == Vote.UP and not chosen_app_user_has_voted:
					owner = chosen_app_user
					chosen_app_user_has_voted = True
				else:
					owner = random.choice(copy1)
				v = VoteFactory.make(topic=topic, owner=owner, vote_type=Vote.UP)
				if owner in copy1: copy1.remove(owner)

		# down
			for __ in range(down):
				if chosen_app_user_vote_type == Vote.DOWN and not chosen_app_user_has_voted:
					owner = chosen_app_user
					chosen_app_user_has_voted = True
				else:
					owner = random.choice(copy1)
				v = VoteFactory.make(topic=topic, owner=owner, vote_type=Vote.DOWN)
				if owner in copy1: copy1.remove(owner) 

		# meh
			for __ in range(meh):
				if chosen_app_user_vote_type == Vote.MEH and not chosen_app_user_has_voted:
					owner = chosen_app_user
					chosen_app_user_has_voted = True
				else:
					owner = random.choice(copy1)
				v = VoteFactory.make(topic=topic, owner=owner, vote_type=Vote.MEH)
				if owner in copy1: copy1.remove(owner) 


			for _ in range(random.randint(0, topic_comment_count)):
				topic_comment = TopicCommentFactory.make_fake(topic=topic)
				topic_comment_counter += 1


		print("Created {0} users".format(user_count))
		print("Created {0} topics".format(topic_count))
		print("Created {0} votes".format(vote_count))
		print("Created {0} topic comments".format(topic_comment_counter))
