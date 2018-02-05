import datetime
import os
import json

from django.db import models
from django.conf import settings
from channels import Channel, Group
from rest_framework.renderers import JSONRenderer

from app_users.models import AppUser


class Meeting(models.Model):

	owner = models.ForeignKey(
		AppUser,
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	title = models.CharField(
		max_length=500,
		blank=False,
		null=False)

	description = models.CharField(
		max_length=5000,
		blank=True,
		default='')

	allotted_duration = models.PositiveIntegerField(
		default=0)

	created_on = models.DateTimeField(
		auto_now_add=True,
		null=False, 
		blank=False)

	started_on = models.DateTimeField(
		null=True, 
		blank=True)

	ended_on = models.DateTimeField(
		null=True, 
		blank=True)

	version = models.PositiveIntegerField(
		blank=False,
		null=False,
		default=0)

	def __str__(self):
		s = '{} - {}'.format(self.id, self.title)
		return s

	def save(self, *args, **kwargs):
		from .serializers import MeetingDetailSlz
		setattr(self, 'version', self.version+1)
		super().save(*args, **kwargs)
		data = {
			'event': 'update_meeting_detail',
			'meeting': MeetingDetailSlz(self).data,
		}
		Group("meetings-%d" % self.id).send({"text": json.dumps(data)})


class MeetingInvitation(models.Model):
	PENDING = 'PENDING'
	ACCEPTED = 'ACCEPTED'
	DECLINED = 'DECLINED'

	STATUS_CHOICES = (
		(PENDING, 'PENDING'),
		(ACCEPTED, 'ACCEPTED'),
		(DECLINED, 'DECLINED'),
	)

	status = models.CharField(
		max_length=10,
		null=False,
		blank=False,
		choices=STATUS_CHOICES,
		default=PENDING)

	inviter = models.ForeignKey(
		AppUser,
		null=False,
		blank=False,
		on_delete=models.CASCADE,
		related_name='inviter')

	invitee = models.ForeignKey(
		AppUser,
		null=False,
		blank=False,
		on_delete=models.CASCADE,
		related_name='invitee')

	meeting = models.ForeignKey(
		'Meeting',
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	created_on = models.DateTimeField(
		auto_now_add=True,
		null=False, 
		blank=False)

	accepted_on = models.DateTimeField(
		null=True, 
		blank=True)

	declined_on = models.DateTimeField(
		null=True, 
		blank=True)

	version = models.PositiveIntegerField(
		blank=False,
		null=False,
		default=0)


	def __str__(self):
		s = '{} - Meeting: {} - {} - {} - {}'.format(
			self.id, 
			self.meeting.id, 
			self.meeting.title, 
			self.inviter.get_full_name(), 
			self.invitee.get_full_name())
		return s

	def save(self, *args, **kwargs):
		from .serializers import MeetingInvitationSlz
		setattr(self, 'version', self.version+1)
		super().save(*args, **kwargs)
		user_invitations = MeetingInvitation.objects.filter(invitee=self.invitee)
		data = {
			'event': 'update_meeting_invitations',
			'meeting_id': self.meeting.id,
			'meeting_invitations': MeetingInvitationSlz(user_invitations, many=True).data,
		}
		Group("users-%d" % self.invitee.id).send({"text": json.dumps(data)})

		meeting_invitations = MeetingInvitation.objects.filter(meeting=self.meeting)
		data = {
			'event': 'update_meeting_invitations',
			'meeting_id': self.meeting.id,
			'meeting_invitations': MeetingInvitationSlz(meeting_invitations, many=True).data,
		}
		Group("meetings-%d" % self.meeting.id).send({"text": json.dumps(data)})

	def delete(self, *args, **kwargs):
		from .serializers import MeetingInvitationSlz
		invitee = self.invitee
		meeting = self.meeting
		meeting_invitation_id = self.id
		super().delete(*args, **kwargs)
		invitations = MeetingInvitation.objects.filter(invitee=invitee)
		data = {
			'event': 'update_meeting_invitations',
			'meeting_invitations': MeetingInvitationSlz(invitations, many=True).data,
		}
		# notify invitee
		Group("users-%d" % invitee.id).send({"text": json.dumps(data)})


		data = {
			'event': 'remove_meeting_invitation',
			'meeting_id': meeting.id,
			'meeting_invitation_id': meeting_invitation_id,
		}
		print('data', data)
		# notify meeting
		Group("meetings-%d" % meeting.id).send({"text": json.dumps(data)})



class MeetingParticipant(models.Model):
	PRESENT = 'PRESENT'
	ABSENT = 'ABSENT'

	STATUS_CHOICES = (
		(PRESENT, 'PRESENT'),
		(ABSENT, 'ABSENT'),
	)

	status = models.CharField(
		max_length=10,
		null=False,
		blank=False,
		choices=STATUS_CHOICES,
		default=ABSENT)

	app_user = models.ForeignKey(
		AppUser,
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	meeting = models.ForeignKey(
		'Meeting',
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	created_on = models.DateTimeField(
		auto_now_add=True,
		null=False, 
		blank=False)

	joined_on = models.DateTimeField(
		null=True, 
		blank=True)

	left_on = models.DateTimeField(
		null=True, 
		blank=True)

	version = models.PositiveIntegerField(
		blank=False,
		null=False,
		default=0)


	def __str__(self):
		s = '{} - Meeting: {} - {} - {} - {}'.format(
			self.id, 
			self.meeting.id, 
			self.meeting.title, 
			self.app_user.get_full_name())
		return s

	def save(self, *args, **kwargs):
		setattr(self, 'version', self.version+1)
		super().save(*args, **kwargs)



class AgendaItem(models.Model):
	PENDING = 'PENDING'
	OPEN = 'OPEN'
	CLOSED = 'CLOSED'
	REJECTED = 'REJECTED'

	STATUS_CHOICES = (
		(PENDING, 'PENDING'),
		(OPEN, 'OPEN'),
		(CLOSED, 'CLOSED'),
		(REJECTED, 'REJECTED'),
	)

	status = models.CharField(
		max_length=10,
		null=False,
		blank=False,
		choices=STATUS_CHOICES,
		default=PENDING)

	owner = models.ForeignKey(
		AppUser,
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	meeting = models.ForeignKey(
		'Meeting',
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	title = models.CharField(
		max_length=500,
		blank=False,
		null=False)

	body = models.CharField(
		max_length=5000,
		blank=True,
		default='')

	allotted_duration = models.PositiveIntegerField(
		default=0)

	created_on = models.DateTimeField(
		auto_now_add=True,
		null=False, 
		blank=False)

	opened_on = models.DateTimeField(
		null=True, 
		blank=True)

	closed_on = models.DateTimeField(
		null=True, 
		blank=True)

	version = models.PositiveIntegerField(
		blank=False,
		null=False,
		default=0)


	def __str__(self):
		s = '{} - {}'.format(self.id, self.title)
		return s

	def save(self, *args, **kwargs):
		from .serializers import AgendaItemSlz
		setattr(self, 'version', self.version+1)
		super().save(*args, **kwargs)
		slz = AgendaItemSlz(self, context={'requester': self.owner})
		data = {
			'event': 'add_agenda_item',
			'agenda_item': slz.data,
		}
		Group("meetings-%d" % self.meeting.id).send({"text": json.dumps(data)})


	def get_vote_counts(self, *args, **kwargs):
		"""Utility for getting AgendaItemVote's for an AgendaItem instance

		Args:
			self: instance of AgendaItem
			*args: None
			**kwargs: 
				requester: optional, an instance of AppUser.  If provided,
					result will have a 'user_vote' key whose value is vote_type
					of user for this AgendaItem instance
				vote_query_set: optional, a QuerySet of AgendaItemVote's 
					related to this AgendaItem instance.  Useful for limiting
					the amount of times we need to query database.

		Returns:
			Dict of form: {'up': 20, 'down': 10: 'meh': 15}
			If 'requester' kwarg passed, return dict will also have a
			'user_vote' key as described above
		"""
		requester = kwargs.get('requester')
		votes = kwargs.get('vote_query_set')
		# if votes (a query set) not passed as arg,
		# query for votes here
		if not votes:
			votes = self.agendaitemvote_set.all()

		up = votes.filter(vote_type=AgendaItemVote.UP).count()
		down = votes.filter(vote_type=AgendaItemVote.DOWN).count()
		meh = votes.filter(vote_type=AgendaItemVote.MEH).count()
		# if requester passed as kwarg, result should
		# include their vote_type.  Else, result is
		# for general meeting broadcast and not 
		# specific to one user
		if requester and votes.filter(owner=requester).exists():
			user_vote_type = votes.filter(owner=requester)[0].vote_type
			result = {
				'up': up,
				'down': down,
				'meh': meh,
				'user_vote': user_vote_type,
			} 
			return result
		else:
			result = {
				'up': up,
				'down': down,
				'meh': meh,
			}
			return result




class AgendaItemVote(models.Model):

	UP = 'up'
	DOWN = 'down'
	MEH = 'meh'

	VOTE_TYPES = (
		(UP, 'up'),
		(DOWN, 'down'),
		(MEH, 'meh'),
	)

	owner = models.ForeignKey(
		AppUser,
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	agenda_item = models.ForeignKey(
		'AgendaItem',
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	vote_type = models.CharField(
		max_length=10,
		null=False,
		blank=False,
		choices=VOTE_TYPES)

	version = models.PositiveIntegerField(
		blank=False,
		null=False,
		default=0)

	created_on = models.DateTimeField(
		auto_now_add=True,
		null=True, 
		blank=True)

	updated_on = models.DateTimeField(
		auto_now=True,
		null=True, 
		blank=True)

	def __str__(self):
		s = '{0} - agenda_item: {1} - {2} - {3}'.format(
			self.id, 
			self.agenda_item.id, 
			self.agenda_item.title, 
			self.vote_type)
		return s

	def save(self, *args, **kwargs):
		vote_query_set = kwargs.pop('vote_query_set', None)
		setattr(self, 'version', self.version + 1)
		super().save(*args, **kwargs)
		votes = self.agenda_item.get_vote_counts(vote_query_set=vote_query_set)
		data = {
			'event': 'update_agenda_item_vote_counts',
			'agenda_item_id': self.agenda_item.id,
			'votes': votes,
		}
		Group("meetings-%d" % self.agenda_item.meeting.id).send({
				"text": json.dumps(data),
			})

	def delete(self, *args, **kwargs):
		agenda_item = self.agenda_item
		super().delete(*args, **kwargs)
		votes = agenda_item.get_vote_counts()
		data = {
			'event': 'update_agenda_item_vote_counts',
			'agenda_item_id': agenda_item.id,
			'votes': votes,
		}
		Group("meetings-%d" % agenda_item.meeting.id).send({
				"text": json.dumps(data),
			})





class AgendaItemStackEntry(models.Model):
	PENDING = 'PENDING'
	OPEN = 'OPEN'
	CLOSED = 'CLOSED'
	REJECTED = 'REJECTED'

	STATUS_CHOICES = (
		(PENDING, 'PENDING'),
		(OPEN, 'OPEN'),
		(CLOSED, 'CLOSED'),
		(REJECTED, 'REJECTED'),
	)

	status = models.CharField(
		max_length=10,
		null=False,
		blank=False,
		choices=STATUS_CHOICES,
		default=PENDING)

	owner = models.ForeignKey(
		AppUser,
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	agenda_item = models.ForeignKey(
		'AgendaItem',
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	allotted_duration = models.PositiveIntegerField(
		default=0)

	created_on = models.DateTimeField(
		auto_now_add=True,
		null=False, 
		blank=False)

	opened_on = models.DateTimeField(
		null=True, 
		blank=True)

	closed_on = models.DateTimeField(
		null=True, 
		blank=True)

	version = models.PositiveIntegerField(
		blank=False,
		null=False,
		default=0)


	def __str__(self):
		s = '{} - {} - {}'.format(
				self.id, 
				self.agenda_item.title, 
				self.owner.get_full_name())
		return s

	def save(self, *args, **kwargs):
		from .serializers import AgendaItemStackEntrySlz
		setattr(self, 'version', self.version+1)
		super().save(*args, **kwargs)
		entries = AgendaItemStackEntry.objects.filter(agenda_item=self.agenda_item) 
		data = {
			'event': 'update_agenda_item_stack_entries',
			'agenda_item_id': self.agenda_item.id,
			'agenda_item_stack_entries': AgendaItemStackEntrySlz(entries, many=True).data,
		}
		# # channel will be notified of updated stack entries list
		Group("meetings-%d" % self.agenda_item.meeting.id).send({"text": json.dumps(data)})

	def delete(self, *args, **kwargs):
		from .serializers import AgendaItemStackEntrySlz
		agenda_item = self.agenda_item
		super().delete(*args, **kwargs) 
		entries = AgendaItemStackEntry.objects.filter(agenda_item=agenda_item)
		data = {
			'event': 'update_agenda_item_stack_entries',
			'agenda_item_id': agenda_item.id,
			'agenda_item_stack_entries': AgendaItemStackEntrySlz(entries, many=True).data,
		}
		# # channel will be notified of updated stack entries list
		Group("meetings-%d" % agenda_item.meeting.id).send({"text": json.dumps(data)})


# TODO(MPP - 180203): nothing implemented
# for Comment
class Comment(models.Model):

	owner = models.ForeignKey(
		AppUser,
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	body = models.CharField(
		max_length=5000,
		blank=True,
		null=False)

	version = models.PositiveIntegerField(
		blank=False,
		null=False,
		default=0)

	created_on = models.DateTimeField(
		auto_now_add=True,
		null=True, 
		blank=True)

	updated_on = models.DateTimeField(
		auto_now=True,
		null=True, 
		blank=True)

	def __str__(self):
		body = self.body[:len(self.body) if len(self.body) < 20 else 20]
		s = '{0} - {1}'.format(self.id, body)
		return s

	def get_owner_name(self):
		return self.owner.get_full_name()

	def get_owner_id(self):
		return self.owner.id


# TODO(MPP - 180203): nothing implemented
# for AgendaItemComment
class AgendaItemComment(models.Model):

	agenda_item = models.ForeignKey(
		'AgendaItem',
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	comment = models.ForeignKey(
		'Comment',
		null=False,
		blank=False,
		on_delete=models.CASCADE)

	def __str__(self):
		s = '{} - {} - {} - {}'.format(
			self.agenda_item.id, 
			self.agenda_item.title, 
			self.comment.id, 
			self.comment.body)
		return s

