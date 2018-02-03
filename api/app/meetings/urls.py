from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from oauth2_provider import views as auth_views

from .views import (
	login,
  get_user_data,
  meeting_view, 
  meetings_view, 
  post_agenda_item, 
  post_agenda_item_stack_entry,
  post_agenda_item_vote,
  accept_or_decline_meeting_invitation,
  meeting_invitation_view,
)


urlpatterns = [
  url(r'^login/$', login),
  url(r'^user_data/$', get_user_data),
	url(r'^meeting_invitations/(?P<meeting_invitation_id>[0-9]+)/(?P<action>[a-zA-Z]+)/$', accept_or_decline_meeting_invitation),
  url(r'^meeting_invitations/$', meeting_invitation_view),
  url(r'^meeting_invitations/(?P<meeting_invitation_id>[0-9]+)/$', meeting_invitation_view),
  url(r'^meetings/$', meetings_view),
  url(r'^meetings/(?P<meeting_id>[0-9]+)/$', meeting_view),
  url(r'^agenda_items/$', post_agenda_item),
  url(r'^agenda_items/(?P<agenda_item_id>[0-9]+)/$', post_agenda_item),
  url(r'^agenda_items/(?P<agenda_item_id>[0-9]+)/votes/$', post_agenda_item_vote),
  url(r'^agenda_item_stack_entries/$', post_agenda_item_stack_entry),
]