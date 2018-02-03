from django.contrib import admin
from .models import *


class MeetingAdmin(admin.ModelAdmin):
	readonly_fields = ('id',)
admin.site.register(Meeting, MeetingAdmin)

class MeetingParticipantAdmin(admin.ModelAdmin):
	readonly_fields = ('id',)
admin.site.register(MeetingParticipant, MeetingParticipantAdmin)

class MeetingInvitationAdmin(admin.ModelAdmin):
	readonly_fields = ('id',)
admin.site.register(MeetingInvitation, MeetingInvitationAdmin)

class AgendaItemAdmin(admin.ModelAdmin):
	readonly_fields = ('id',)
admin.site.register(AgendaItem, AgendaItemAdmin)

class AgendaItemStackEntryAdmin(admin.ModelAdmin):
	readonly_fields = ('id',)
admin.site.register(AgendaItemStackEntry, AgendaItemStackEntryAdmin)

class CommentAdmin(admin.ModelAdmin):
	readonly_fields = ('id',)
admin.site.register(Comment, CommentAdmin)

class AgendaItemCommentAdmin(admin.ModelAdmin):
	readonly_fields = ('id',)
admin.site.register(AgendaItemComment, AgendaItemCommentAdmin)

class AgendaItemVoteAdmin(admin.ModelAdmin):
	readonly_fields = ('id',)
admin.site.register(AgendaItemVote, AgendaItemVoteAdmin)
