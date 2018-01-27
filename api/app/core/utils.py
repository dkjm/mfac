import datetime
import os

from django.db import models
#from django.contrib.auth.models import User, Group
from django.conf import settings
from app_users.models import AppUser
from channels import Channel, Group
from rest_framework.renderers import JSONRenderer
import json


def parse_url_params(params):
	pairs = params.split('&')
	mapping = {}
	for p in pairs:
		k,v = p.split('=')
		mapping[k] = v
	return mapping

class GeneralPurposeModel(models.Model):

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

	def save(self, *args, **kwargs):

		super().save(*args, **kwargs, version=self.version + 1)


	def __str__(self):
		return self.id