import datetime
import os

from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class AppUser(models.Model):

	user = models.OneToOneField(
		User,
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	first_name = models.CharField(
		max_length=100,
		blank=False)

	middle_name = models.CharField(
		max_length=100,
		blank=True,
		default='')

	last_name = models.CharField(
		max_length=100,
		blank=True,
		default='')

	suffix = models.CharField(
		max_length=100,
		blank=True,
		default='')

	is_active = models.BooleanField(default=True)

	created_on = models.DateTimeField(
		auto_now_add=True,
		null=False, 
		blank=False)

	updated_on = models.DateTimeField(
		auto_now=True,
		null=False, 
		blank=False)


	def __str__(self):
		s = '{0} - {1} - {2}'.format(self.id, self.user.username, self.get_full_name_reverse())
		return s

	def get_full_name(self):
		if self.last_name:	
			s = '{0} {1}'.format(self.first_name, self.last_name)
			return s
		else:
			return self.first_name

	def get_full_name_reverse(self):
		if self.last_name:	
			s = '{0}, {1}'.format(self.last_name, self.first_name)
			return s
		else:
			return self.first_name

	def get_username(self): 
		return self.user.username

	def get_user_id(self):
		return self.user.id



class AuthToken(models.Model):
	user = models.ForeignKey(
		User,
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	token = models.CharField(
		max_length=100,
		blank=False)

	expiry = models.DateTimeField()


	def __str__(self):
		date = '{:%m-%d-%Y}'.format(self.expiry)
		time = '{:%H:%M}'.format(self.expiry)
		string = '%s -- %s -- %s %s' % (self.user.username, self.token, date, time)
		return string

