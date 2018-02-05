import datetime
import os
import json

from django.db import models
from django.conf import settings
from channels import Channel, Group
from rest_framework.renderers import JSONRenderer



def parse_url_params(params):
	pairs = params.split('&')
	mapping = {}
	for p in pairs:
		k,v = p.split('=')
		mapping[k] = v
	return mapping