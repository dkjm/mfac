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
from app_users.models import AppUser


User = get_user_model()

defaultEmail = 'mark.p.pare@gmail.com'
defaultPassword = 'asdf'


class Command(BaseCommand):

	def add_arguments(self, parser):
		parser.add_argument(
			'--email',
			dest='email',
			default=defaultEmail)

		parser.add_argument(
			'--password',
			dest='password',
			default=defaultPassword)


	def handle(self, *args, **options):

		# handle options
		email = options.get('email', defaultEmail)
		password = options.get('password', defaultPassword)

	# makemigrations and migrate
		print('Performing migrations...')
		subprocess.call('python manage.py makemigrations', shell=True)
		subprocess.call('python manage.py migrate', shell=True)
		print('Migrated successfully.')

	# create superuser
		try:
			admin = User.objects.get(username='admin')
		except User.DoesNotExist:
			admin = User.objects.create_superuser(
				'admin',
				email,
				password)
			print('Created superuser with username and password: %s %s' % (admin.username, password))

		try:
			admin_app_user = AppUser.objects.get(user=admin)
		except AppUser.DoesNotExist:
			admin_app_user = AppUser.objects.create(
				first_name='admin',
				user=admin)

		# create OAuth app
		try:
		 app = Application.objects.get(name='App')
		except Application.DoesNotExist:
			app = Application(
				name='App',
				user=admin,
				client_type=Application.CLIENT_CONFIDENTIAL,
				authorization_grant_type=Application.GRANT_PASSWORD
			)
			app.save()
			print('Created OAuth app.')
			print('Client ID: ', app.client_id)
			print('Client Secret: ', app.client_secret)
		
		print()
