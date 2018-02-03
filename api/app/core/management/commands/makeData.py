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
	Meeting,
	MeetingInvitation,
	MeetingParticipant,
	AgendaItem,
	AgendaItemVote,
	AgendaItemStackEntry,
)

from app_users.factories.app_user_factory import (
	UserFactory, 
	AppUserFactory
)
from meetings.factories.factory import (
	MeetingFactory, 
	AgendaItemFactory, 
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
			'--username',
			dest='username',
			default='Blade')
		parser.add_argument(
			'--meeting-count',
			dest='meeting_count',
			default=5)
		parser.add_argument(
			'--agenda-item-count',
			dest='agenda_item_count',
			default=5)

	def handle(self, *args, **options):
		print('Making data...')

		user_count = options.get('user_count')
		meeting_count = options.get('meeting_count') 
		agenda_item_count = options.get('agenda_item_count')
		user_id = options.get('user_id')
		username = options.get('username')

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
			chosen_app_user = AppUserFactory.make_fake(id=user_id, username=username)

		for i in range(1, user_count + 1):
			try:
				app_user = AppUser.objects.get(id=i)
			except AppUser.DoesNotExist:
				app_user = AppUserFactory.make_fake(id=i)
		
		# excluding admin user, assuming its used
		# for internal purposes only
		app_users = AppUser.objects.exclude(user__username='admin')

		total = 0
		for _ in range(meeting_count):
			total += 1
			meeting = MeetingFactory.make_fake(owner=chosen_app_user)
			for __ in range(agenda_item_count):
				agenda_item = AgendaItemFactory.make_fake(meeting=meeting, owner=chosen_app_user)

		print("Created {0} users".format(user_count))
		print("Created {0} meetings".format(meeting_count))
		print("Created {0} agenda items".format(agenda_item_count))

