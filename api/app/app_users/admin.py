from django.contrib import admin
from .models import *


class AppUserAdmin(admin.ModelAdmin):
	readonly_fields = ('id',)

admin.site.register(AppUser, AppUserAdmin)