import random
import copy
from ..models import *
from .factory_data import (
	username_list, 
	first_name_list, 
	last_name_list,
)
from django.contrib.auth import get_user_model
User = get_user_model()

class UserFactory(object):
	@staticmethod
	def make(*args, **kwargs):
		k = kwargs
		id = k.get('id')
		user = User.objects.create(
			id=id,
			username=k.get('username')
		)
		user.set_password(k.get('password', 'asdf'))
		user.save()
		return user

	@staticmethod
	def make_fake(*args, **kwargs):
		indices = [i for i in range(0, len(username_list))]

		username = kwargs.get('username', None)

		if username == None:
			while len(indices):
				rand_index = random.choice(indices)
				test_name = username_list[rand_index]
				if User.objects.filter(username=test_name).exists():
					indices.remove(rand_index)
				else:
					username = test_name
					break

			if len(indices) == 0 and not username:
				raise Exception('username_list exhausted!!')
			else:
				return UserFactory.make(username=username, **kwargs)
		else:
			return UserFactory.make(**kwargs)



class AppUserFactory(object):
	@staticmethod
	def make(*args, **kwargs):
		k = kwargs
		user = k.get('user', UserFactory.make_fake(*args, **kwargs)) 
		app_user = AppUser.objects.create(
			id=k.get('id'),
			first_name=k.get('first_name'),
			last_name=k.get('last_name'),
			user=user
		)

		if k.get('email'):
			setattr(user, 'email', k.get('email'))
			user.save()

		return app_user

	@staticmethod
	def make_fake(*args, **kwargs):
		first_name = random.choice(first_name_list)
		last_name = random.choice(last_name_list)
		email = make_email(first_name, last_name)
		return AppUserFactory.make(first_name=first_name, last_name=last_name, email=email, **kwargs)


def make_email(first_name, last_name):
	return '{0}.{1}@gmail.com'.format(first_name, last_name)