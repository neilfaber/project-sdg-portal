
from django.contrib import admin
from .models import Notification, Report, Feedback, Leaderboard

# Register your models here.
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('user__full_name', 'message')
    date_hierarchy = 'created_at'

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('report_type', 'generated_by', 'created_at')
    list_filter = ('report_type', 'created_at')
    search_fields = ('generated_by__full_name', 'report_content')
    date_hierarchy = 'created_at'
    actions = ['generate_engagement_report', 'generate_user_activity_report']
    
    def generate_engagement_report(self, request, queryset):
        # Logic to generate engagement report would go here in a real implementation
        self.message_user(request, "Engagement report generated successfully")
    generate_engagement_report.short_description = "Generate engagement report"
    
    def generate_user_activity_report(self, request, queryset):
        # Logic to generate user activity report would go here in a real implementation
        self.message_user(request, "User activity report generated successfully")
    generate_user_activity_report.short_description = "Generate user activity report"

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('project', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('project__title', 'user__full_name', 'comment')
    date_hierarchy = 'created_at'

@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('project', 'average_rating', 'total_ratings', 'views', 'engagement_score')
    list_filter = ('average_rating', 'views')
    search_fields = ('project__title',)
    ordering = ('-engagement_score',)
