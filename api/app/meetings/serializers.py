import sys
from django.conf import settings
from rest_framework import serializers

from .models import (
	Meeting,
	MeetingInvitation,
	MeetingParticipant,
	AgendaItem,
	AgendaItemStackEntry,
)
from app_users.serializers import AppUserSlz



class MeetingSlz(serializers.ModelSerializer):

	agenda_items = serializers.SerializerMethodField()
	meeting_invitations = serializers.SerializerMethodField()
	owner = serializers.SerializerMethodField()
	participants = serializers.SerializerMethodField()
	resources = serializers.SerializerMethodField()

	def get_agenda_items(self, obj):
		items = obj.agendaitem_set.order_by('created_on')
		slz = AgendaItemSlz(items, many=True, context=self.context)
		return slz.data

	def get_meeting_invitations(self, obj):
		items = obj.meetinginvitation_set.order_by('created_on')
		slz = MeetingInvitationSlz(items, many=True, context=self.context)
		return slz.data

	def get_owner(self, obj):
		slz = AppUserSlz(obj.owner)
		return slz.data

	def get_participants(self, obj):
		participants = obj.meetingparticipant_set.filter(status=MeetingParticipant.PRESENT)
		slz = AppUserSlz([p.app_user for p in participants], many=True)
		return slz.data

	def get_resources(self, obj):
		# TODO(MPP - 180131): implement
		return []

	class Meta:
		model = Meeting
		fields = (
			'id',
			'agenda_items',
			'meeting_invitations',
			'title',
			'description',
			'owner',
			'allotted_duration',
			'created_on',
			'started_on',
			'ended_on',
			'version',

			'participants',
			'resources',
			)


class MeetingDetailSlz(serializers.ModelSerializer):

	owner = serializers.SerializerMethodField()

	def get_owner(self, obj):
		slz = AppUserSlz(obj.owner)
		return slz.data

	class Meta:
		model = Meeting
		fields = (
			'id',
			'owner',
			'title',
			'description',
			'owner',
			'allotted_duration',
			'created_on',
			'started_on',
			'ended_on',
			'version',
			)


class MeetingInvitationSlz(serializers.ModelSerializer):

	inviter = serializers.SerializerMethodField()
	invitee = serializers.SerializerMethodField()
	meeting = serializers.SerializerMethodField()

	def get_inviter(self, obj):
		slz = AppUserSlz(obj.inviter)
		return slz.data

	def get_invitee(self, obj):
		slz = AppUserSlz(obj.invitee)
		return slz.data

	def get_meeting(self, obj):
		m = obj.meeting
		return {'id': m.id, 'title': m.title}


	class Meta:
		model = MeetingInvitation
		fields = (
			'id',
			'inviter',
			'invitee',
			'meeting',
			'status',
			'created_on',
			'accepted_on',
			'declined_on',
			'version',
			)



class AgendaItemSlz(serializers.ModelSerializer):

	owner = serializers.SerializerMethodField()
	votes = serializers.SerializerMethodField()
	stack_entries = serializers.SerializerMethodField()

	def get_owner(self, obj):
		slz = AppUserSlz(obj.owner)
		return slz.data

	def get_votes(self, obj):
		requester = self.context.get('requester')
		votes = obj.get_vote_counts(requester=requester)
		return votes

	def get_stack_entries(self, obj):
		stack_entries = obj.agendaitemstackentry_set.order_by('created_on')
		return AgendaItemStackEntrySlz(stack_entries, many=True).data

	class Meta:
		model = AgendaItem
		fields = (
			'id',
			'title',
			'body',
			'owner',
			'votes',
			'status',
			'allotted_duration',
			'created_on',
			'opened_on',
			'closed_on',
			'version',
			'stack_entries',
			)


class AgendaItemStackEntrySlz(serializers.ModelSerializer):

	agenda_item_id = serializers.SerializerMethodField()
	owner_id = serializers.SerializerMethodField()
	owner_full_name = serializers.SerializerMethodField()

	def agenda_item_id(self, obj):
		return obj.agenda_item.id

	def get_owner_id(self, obj):
		return obj.owner.id

	def get_owner_full_name(self, obj):
		return obj.owner.get_full_name()

	class Meta:
		model = AgendaItemStackEntry
		fields = (
			'id',
			'agenda_item_id',
			'owner_id',
			'owner_full_name',
			'status',
			'allotted_duration',
			'created_on',
			'opened_on',
			'closed_on',
			'version',
			)

