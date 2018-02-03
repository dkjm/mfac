import random
from ..models import *
from django.contrib.auth import get_user_model
from faker import Faker
fake = Faker()

app_users = AppUser.objects.all()

class MeetingFactory(object):
	@staticmethod
	def make(*args, **kwargs):
		k = kwargs
		id = k.get('id')
		meeting = Meeting.objects.create(
			id=id,
			**kwargs
		)
		return meeting

	@staticmethod
	def make_fake(*args, **kwargs):
		title = make_title()
		description = make_text()
		owner = kwargs.pop('owner', get_owner())
		return MeetingFactory.make(
			title=title, 
			description=description, 
			owner=owner, 
			**kwargs)


class AgendaItemFactory(object):
	@staticmethod
	def make(*args, **kwargs):
		k = kwargs
		id = k.get('id', None)

		meeting = k.get('meeting', None)
		if meeting == None:
			MeetingFactory.make_fake()
		
		owner = k.get('owner', None)
		if owner == None:
			owner = get_owner()

		agenda_item = AgendaItem.objects.create(
			id=id,
			meeting=meeting,
			owner=owner,
			title=make_title(),
			body=make_text())
		return agenda_item

	@staticmethod
	def make_fake(*args, **kwargs):
		return AgendaItemFactory.make(*args, **kwargs)


# TODO(MPP - 180203) - not using below make_vote_counts
# for making initial fake data
def make_vote_counts(users_count):
	# ensure that there are never
	# more votes than there are users
	third = int(users_count/3)
	up_votes = random.randint(0, third)
	down_votes = random.randint(0, third)
	meh_votes = random.randint(0, third)
	# up_votes = 2
	# down_votes = 3
	# meh_votes = 4
	return up_votes, down_votes, meh_votes

def get_owner():
	app_users = AppUser.objects.filter(user__username='admin')
	return random.choice(app_users)

def make_title():
	return fake.sentence()

def make_text():
	return fake.text()

