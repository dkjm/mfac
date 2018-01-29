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


meeting_id = 1


# send_update will periodically send 
# updated vote counts.  You can change the
# period length at the bottom in the 
# app.conf.beat_schedule object.  
# "Schedule" is given in seconds
# ** This task is just making random numbers
# for vote counts but can be used to simulate
# receiving live updates on client via websockets
@app.task
def send_update():
	# must do model imports inside function
	# to prevent dependency loading issues
	# for all celery tasks
	from meetings.models import Topic, Vote

	vote_types = [Vote.UP, Vote.DOWN, Vote.MEH]

	result = {
		'event': 'update_vote_counts',
		'topics': []
	}

	topics = Topic.objects.all()

	for topic in topics:
		votes = topic.vote_set.all()
		up = votes.filter(vote_type=Vote.UP).count()
		down = votes.filter(vote_type=Vote.DOWN).count()
		meh = votes.filter(vote_type=Vote.MEH).count()

		_up, _down, _meh = [ random.randint(-5, 5) for _ in vote_types ]

		obj = {
			'id': topic.id,
			'votes': {
				'up': up + _up,
				'down': down + _down,
				'meh': meh + _meh,
			}
		}
		result['topics'].append(obj)

	Group("meetings-%d" % meeting_id).send({
			"text": json.dumps(result),
		})




app.conf.beat_schedule = {
	'send_update': {
		'task': 'tasks.send_update',
		'schedule': 5,	
		#'schedule': crontab(minute='0', hour='20'),
	},
}







