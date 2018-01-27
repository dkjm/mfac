from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from oauth2_provider import views as auth_views
from views import health_check, health_check_json

urlpatterns = [
  url(r'^health_check/$', health_check),
  url(r'^health_check_json/$', health_check_json),
]