
from django.contrib import admin
from django.utils.html import format_html
from .models import Project, SDG, ProjectSDG

# Register your models here.
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'team', 'category', 'approval_status', 'created_at', 'approval_actions')
    list_filter = ('category', 'approval_status', 'created_at')
    search_fields = ('title', 'description')
    date_hierarchy = 'created_at'
    actions = ['approve_projects', 'reject_projects']
    
    def approval_actions(self, obj):
        if obj.approval_status == 'pending':
            return format_html(
                '<button type="button" onclick="window.location.href=\'{}\'">Approve</button> '
                '<button type="button" onclick="window.location.href=\'{}\'">Reject</button>',
                f'/admin/projects/project/{obj.project_id}/approve/',
                f'/admin/projects/project/{obj.project_id}/reject/'
            )
        elif obj.approval_status == 'approved':
            return format_html('<span style="color: green;">Approved</span>')
        else:
            return format_html('<span style="color: red;">Rejected</span>')
    approval_actions.short_description = 'Actions'
    
    def approve_projects(self, request, queryset):
        queryset.update(approval_status='approved')
    approve_projects.short_description = "Approve selected projects"
    
    def reject_projects(self, request, queryset):
        queryset.update(approval_status='rejected')
    reject_projects.short_description = "Reject selected projects"

@admin.register(SDG)
class SDGAdmin(admin.ModelAdmin):
    list_display = ('sdg_name',)
    search_fields = ('sdg_name',)

@admin.register(ProjectSDG)
class ProjectSDGAdmin(admin.ModelAdmin):
    list_display = ('project', 'sdg')
    list_filter = ('sdg',)
