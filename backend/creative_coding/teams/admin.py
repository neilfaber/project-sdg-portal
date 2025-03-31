from django.contrib import admin
from .models import StudentTeam, TeamMember, MentorshipRequest

# Register your models here.
@admin.register(StudentTeam)
class StudentTeamAdmin(admin.ModelAdmin):
    list_display = ('team_name', 'created_by', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('team_name',)
    date_hierarchy = 'created_at'

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'team')
    list_filter = ('team',)
    search_fields = ('user__full_name', 'team__team_name')

@admin.register(MentorshipRequest)
class MentorshipRequestAdmin(admin.ModelAdmin):
    list_display = ('student', 'faculty', 'project', 'status', 'request_date')
    list_filter = ('status', 'request_date')
    search_fields = ('student__full_name', 'faculty__full_name')
    date_hierarchy = 'request_date'
