from django.contrib import admin
from .models import *


class TopicAdmin(admin.ModelAdmin):
	readonly_fields = ('id',)
admin.site.register(Topic, TopicAdmin)

class TopicCommentAdmin(admin.ModelAdmin):
	readonly_fields = ('id',)
admin.site.register(TopicComment, TopicCommentAdmin)

class VoteAdmin(admin.ModelAdmin):
	readonly_fields = ('id',)
admin.site.register(Vote, VoteAdmin)