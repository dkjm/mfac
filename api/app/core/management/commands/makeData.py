import sys
import os
import re
import subprocess
import random
import copy
from django.conf import settings
sys.path.insert(0, settings.BASE_DIR)


from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
#from django.contrib.auth.models import User
from oauth2_provider.models import get_application_model
Application = get_application_model()


User = get_user_model()

from app_users.models import AppUser
from st.models import Topic, TopicComment, Vote
from app_users.factories.app_user_factory import UserFactory, AppUserFactory
from st.factories import TopicFactory, TopicCommentFactory, VoteFactory, make_vote_counts



class Command(BaseCommand):

	def add_arguments(self, parser):
		parser.add_argument(
			'--user_count',
			dest='user_count')
		parser.add_argument(
			'--user_id',
			dest='user_id')



	def handle(self, *args, **options):
		print('Making data...')

		if options.get('user_count'):
			user_count = options.get('user_count')
		else:
			user_count = 30

		if options.get('topic_count'):
			topic_count = options.get('topic_count')
		else:
			topic_count = 10

		if options.get('topic_comment_count'):
			topic_comment_count = options.get('topic_comment_count')
		else:
			topic_comment_count = 10

		if options.get('user_id'):
			user_id = options.get('user_id')
		else:
			user_id = 2


		
		try:
			chosen_app_user = AppUser.objects.get(id=user_id)
		except AppUser.DoesNotExist:
			chosen_app_user = AppUserFactory.make_fake(id=user_id)

		print(chosen_app_user)

		for _ in range(user_count):
			app_user = AppUserFactory.make_fake()
		
		topic_comment_counter = 0

		app_users = AppUser.objects.exclude(user__username='admin')
		#copy1 = copy.deepcopy(app_users)
		

		vote_count = 0

		for _ in range(topic_count):

			copy1 = list(app_users)

			topic = TopicFactory.make_fake()

			up, down, meh = make_vote_counts(app_users.count())

			# augment vote_count for each topic
			vote_count += up + down + meh

			# print('copy1 count before:', len(copy1))
			chosen_app_user_vote_type = random.choice(Vote.VOTE_TYPES)[0]
			chosen_app_user_has_voted = False

			for __ in range(up):
				if chosen_app_user_vote_type == Vote.UP and not chosen_app_user_has_voted:
					owner = chosen_app_user
					chosen_app_user_has_voted = True
				else:
					owner = random.choice(copy1)
				v = VoteFactory.make(topic=topic, owner=owner, vote_type=Vote.UP)
				if owner in copy1: copy1.remove(owner)

			# print('copy1 count after 1:', len(copy1))

		# down
			for __ in range(down):
				if chosen_app_user_vote_type == Vote.DOWN and not chosen_app_user_has_voted:
					owner = chosen_app_user
					chosen_app_user_has_voted = True
				else:
					owner = random.choice(copy1)
				v = VoteFactory.make(topic=topic, owner=owner, vote_type=Vote.DOWN)
				if owner in copy1: copy1.remove(owner) 

			# print('copy1 count after 2:', len(copy1))


			for __ in range(meh):
				if chosen_app_user_vote_type == Vote.MEH and not chosen_app_user_has_voted:
					owner = chosen_app_user
					chosen_app_user_has_voted = True
				else:
					owner = random.choice(copy1)
				v = VoteFactory.make(topic=topic, owner=owner, vote_type=Vote.MEH)
				if owner in copy1: copy1.remove(owner) 

			# print('copy1 count after 3:', len(copy1))

			for _ in range(random.randint(0, topic_comment_count)):
				topic_comment = TopicCommentFactory.make_fake(topic=topic)
				topic_comment_counter += 1


		print("Created {0} users".format(user_count))
		print("Created {0} topics".format(topic_count))
		print("Created {0} votes".format(vote_count))
		print("Created {0} topic comments".format(topic_comment_counter))














