from __future__ import absolute_import
import os
import json
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')

from datetime import timedelta
from django.conf import settings
from celery import Celery
from celery.schedules import crontab
from channels import Channel, Group

#app = Celery('tasks', backend='rpc://', broker='amqp://guest@localhost//')
app = Celery('tasks')
app.conf.broker_url = settings.REDIS_URL
app.conf.result_backend = settings.REDIS_URL


@app.task
def simulate_update_agenda_item_vote_counts():
	# must do model imports inside function
	# to prevent dependency loading issues
	# for all celery tasks
	from meetings.models import (
		Meeting, 
		AgendaItem, 
		AgendaItemStackEntry, 
		AgendaItemVote,
	)
	from app_users.models import AppUser

	vote_types = [AgendaItemVote.UP, AgendaItemVote.DOWN]

	meeting = Meeting.objects.first()
	agenda_items = meeting.agendaitem_set.all()
	users = AppUser.objects.exclude(user__username='admin')

	item = random.choice(agenda_items)

	votes = item.agendaitemvote_set.all()
	up = votes.filter(vote_type=AgendaItemVote.UP).count()
	down = votes.filter(vote_type=AgendaItemVote.DOWN).count()

	_up, _down = [ random.randint(-5, 5) for _ in vote_types ]

	result = {
		'event': 'update_agenda_item_vote_counts',
		'agenda_item_id': item.id,
		'votes': {
			'up': _up,
			'down': _down,
			'meh': 0,
		},
	}

	Group("meetings-%d" % meeting.id).send({
			"text": json.dumps(result),
		})



app.conf.beat_schedule = {
	'simulate_update_agenda_item_vote_counts': {
		'task': 'tasks.simulate_update_agenda_item_vote_counts',
		'schedule': 1,	
		#'schedule': crontab(minute='0', hour='20'),
	},
}







