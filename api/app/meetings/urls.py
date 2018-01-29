from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from oauth2_provider import views as auth_views
from .views import all_topics, post_vote


urlpatterns = [
  # TODO: change how urls are routed. 
  # Right now any param passed will be caught
  # by post_vote url (e.g. topics/some_param=some_val)
  # only "topics/" without any params will go to
  # all_topics view/controller
  url(r'(?P<params>[a-zA-Z0-9=_&]+)/$', post_vote),
  url(r'.*', all_topics),
]