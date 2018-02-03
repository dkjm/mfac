import datetime
import pytz
import re
import sys

from django.conf import settings
sys.path.insert(0, settings.BASE_DIR)

from modules.secrets import token_hex, token_urlsafe
from .models import AuthToken


def getRequester(request):
	"""Get AppUser instance from a request via authorization headers

	Args:
		request: HttpRequest
	Returns:
		AppUser instance request has a valid token
		None otherwise
	"""
	auth_str = request.META.get('HTTP_AUTHORIZATION', None)
	if not auth_str:
		return None
	m = re.search('(Bearer)(\s)(.*)', auth_str)
	token = m.group(3)
	tokenObj = AuthToken.objects.get(token=token)
	if not tokenObj:
		return None
	else:
		return tokenObj.user.appuser


def getRequesterFromToken(token_str):
	"""Get AppUser instance from a request via authorization headers

	Args:
		request: HttpRequest
	Returns:
		AppUser instance request has a valid token
		None otherwise
	"""
	try:
		tokenObj = AuthToken.objects.get(token=token_str)
		return tokenObj.user.appuser
	except tokenObj.DoesNotExist:
		return None
		


def makeAuthTokenObject():
	obj = {}
	token = token_urlsafe(nbytes=40)
	tz = pytz.timezone(settings.TIME_ZONE)
	expiry = datetime.datetime.now(tz) + datetime.timedelta(minutes=settings.AUTH_TOKEN_LIFESPAN)
	obj['token'] = token
	obj['expiry'] = expiry
	return obj

def isAuthTokenExpired(instance=None):
	tz = pytz.timezone(settings.TIME_ZONE)
	now = datetime.datetime.now(tz)
	if instance.expiry < now:
		return True
	else:
		return False

def isValidToken(tokenStr):
	try:
		tokenObj = AuthToken.objects.get(token=tokenStr)
	except AuthToken.DoesNotExist:
		return False
	isExpired = isAuthTokenExpired(instance=tokenObj)
	return not isExpired