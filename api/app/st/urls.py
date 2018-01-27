from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from oauth2_provider import views as auth_views
from .views import all_topics, get_topic, post_vote


urlpatterns = [
  
  #url(r'(?P<topic_id>[0-9]+)/$', get_topic),
  #url(r'id=[0-9]+/$', get_topic),
  
  #url(r'(?P<topic_id>[0-9]+)/$', post_vote),
  #url(r'(?P<params>[a-zA-Z0-9_\-\&\?]+)/$', post_vote),
  url(r'(?P<params>[a-zA-Z0-9=_&]+)/$', post_vote),
  # todo: fix below catch-all to actual proper routing
  url(r'.*', all_topics),
]