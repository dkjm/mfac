import sys
import os
import re
import subprocess

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from oauth2_provider.models import get_application_model
Application = get_application_model()



class Command(BaseCommand):
	def add_arguments(self, parser):
		parser.add_argument(
			'--name',
			dest='projectName')
		parser.add_argument(
			'--db',
			dest='db')


	def handle(self, *args, **options):
		projectName = options.get('projectName')
		dbName = options.get('db')

		print('Renaming files and dirs...')
	# rename app
		settingsFilePath = os.path.join(settings.PROJECT_ROOT, 'settings.py')
		wsgiFilePath = os.path.join(settings.PROJECT_ROOT, 'wsgi.py')
		manageFilePath = os.path.join(settings.BASE_DIR, 'manage.py')
		tasksFilePath = os.path.join(settings.BASE_DIR, 'tasks.py')
		
	# settings.py
		with open(settingsFilePath, 'r+') as f:
			contents = ''.join([ line for line in f ])

			wsgiOriginal = "WSGI_APPLICATION = 'starter.wsgi.application'"
			wsgiNew = "WSGI_APPLICATION = '{0}.wsgi.application'".format(projectName)

			urlConfigOriginal = "ROOT_URLCONF = 'starter.urls'"
			urlConfigNew = "ROOT_URLCONF = '{0}.urls'".format(projectName)

			dbOriginal = "'NAME': 'dbName'"
			dbNew = "'NAME': '{0}'".format(dbName)

			settingsFilePatterns = [ 
				(wsgiOriginal, wsgiNew), 
				(urlConfigOriginal, urlConfigNew), 
				(dbOriginal, dbNew),
			]

			recycled = ''
			for index, pattern in enumerate(settingsFilePatterns):
				if index == 0:
					recycled = contents
				recycled = re.sub(pattern[0], pattern[1], recycled)

			#print(recycled)
			f.seek(0)
			f.truncate()
			f.write(recycled)

	# wsgi.py
		with open(wsgiFilePath, 'r+') as f:
			contents = ''.join( [ line for line in f ])
			settingsOriginal = r'os.environ.setdefault\("DJANGO_SETTINGS_MODULE", "starter.settings"\)'
			#settingsOriginal = r'os.environ.setdefault\('
			settingsNew = 'os.environ.setdefault("DJANGO_SETTINGS_MODULE", "{0}.settings")'.format(projectName)

			wsgiFilePatterns = [
				(settingsOriginal, settingsNew)
			]

			recycled = ''
			for index, pattern in enumerate(wsgiFilePatterns):
				if index == 0:
					recycled = contents
				recycled = re.sub(pattern[0], pattern[1], recycled)

			#print(recycled)
			f.seek(0)
			f.truncate()
			f.write(recycled)


	# manage.py
		with open(manageFilePath, 'r+') as f:
			contents = ''.join( [ line for line in f ])
			settingsOriginal = r'starter.settings'
			settingsNew = '{0}.settings'.format(projectName)

			recycled = contents
			recycled = re.sub(settingsOriginal, settingsNew, recycled)

			f.seek(0)
			f.truncate()
			f.write(recycled)

	# tasks.py
		with open(tasksFilePath, 'r+') as f:
			contents = ''.join( [ line for line in f ])
			settingsOriginal = r'starter.settings'
			settingsNew = '{0}.settings'.format(projectName)

			recycled = contents
			recycled = re.sub(settingsOriginal, settingsNew, recycled)

			f.seek(0)
			f.truncate()
			f.write(recycled)


	# rename dirs
		projectRoot = settings.PROJECT_ROOT
		baseDir = settings.BASE_DIR

	# project dir
		os.rename(projectRoot, projectName)
	# base dir
		s = baseDir.split('/')
		s[-1] = projectName
		res = '/'.join(s)
		os.rename(baseDir, res)

		print('Files and dirs renamed successfully.')













