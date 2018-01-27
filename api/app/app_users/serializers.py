import sys
from django.conf import settings
sys.path.insert(0, settings.BASE_DIR)
from rest_framework import serializers

from django.contrib.auth import get_user_model
User = get_user_model()
from .models import AppUser


class AppUserSlz(serializers.ModelSerializer):

	user_id = serializers.SerializerMethodField()

	username = serializers.SerializerMethodField()

	email = serializers.SerializerMethodField()

	full_name = serializers.SerializerMethodField()

	full_name_reverse = serializers.SerializerMethodField()

	def get_user_id(self, obj):
		return obj.user.id

	def get_username(self, obj):
		return obj.user.username

	def get_email(self, obj):
		return obj.user.email

	def get_full_name(self, obj):
		return obj.get_full_name()

	def get_full_name_reverse(self, obj):
		return obj.get_full_name_reverse()

	class Meta:
		model = AppUser
		fields = (
			'id',
			'first_name',
			'last_name',
			'full_name',
			'full_name_reverse',
			'is_active',
			'user_id',
			'username',
			'email',
			'created_on',
			'updated_on',
			)







