import sys
import os
import re
import subprocess
from django.conf import settings
sys.path.insert(0, settings.BASE_DIR)


from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
#from django.contrib.auth.models import User
from oauth2_provider.models import get_application_model
Application = get_application_model()


User = get_user_model()

from app_users.models import AppUser
from st.models import Topic, TopicComment
from app_users.factories.app_user_factory import UserFactory, AppUserFactory



class Command(BaseCommand):

	def add_arguments(self, parser):
		parser.add_argument(
			'--user_count',
			dest='user_count')



	def handle(self, *args, **options):
		print('Deleting data...')

		topic_counter = 0
		topic_comment_counter = 0
		for topic in Topic.objects.all():
			topic_comment_counter += topic.topiccomment_set.count()
			topic_counter += 1
			topic.delete()

		user_counter = 0
		for user in User.objects.all():
			if user.username != 'admin':
				user.delete()
				user_counter += 1

		print('Deleted users ', user_counter)
		print('Deleted topics ', topic_counter)
		print('Deleted topic comments ', topic_comment_counter)


















