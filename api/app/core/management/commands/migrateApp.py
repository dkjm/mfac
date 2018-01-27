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



class Command(BaseCommand):

	def add_arguments(self, parser):
		parser.add_argument(
			'--email',
			dest='email')

		parser.add_argument(
			'--password',
			dest='password')


	def handle(self, *args, **options):

		# handle options
		email = options.get('email')
		if not email:
			email = 'mark.p.pare@gmail.com'

		password = options.get('password')
		if not password:
			password = 'asdf'


	# makemigrations and migrate
		print('Performing migrations...')
		subprocess.call('python manage.py makemigrations', shell=True)
		subprocess.call('python manage.py migrate', shell=True)
		print('Migrated successfully.')

		print('Creating superuser and OAuth app...')
	# create superuser
		try:
			admin = User.objects.get(username='admin')
		except User.DoesNotExist:
			admin = User.objects.create_superuser(
				'admin',
				email,
				password)

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

		print('Superuser and OAuth app created successfully.\n')
		print('Client ID: ', app.client_id)
		print('Client Secret: ', app.client_secret)
