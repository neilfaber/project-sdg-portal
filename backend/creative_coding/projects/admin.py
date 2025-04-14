from django.contrib import admin
from django.utils.html import format_html
from django.urls import path
from django.http import HttpResponseRedirect
from django.urls import reverse
from .models import Project, SDG, ProjectSDG

@admin.register(SDG)
class SDGAdmin(admin.ModelAdmin):
    list_display = ('sdg_number', 'sdg_name')
    search_fields = ('sdg_name',)
    ordering = ('sdg_number',)

class ProjectSDGInline(admin.TabularInline):
    model = ProjectSDG
    extra = 1

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'team', 'category', 'approval_status', 'created_at', 'approval_actions')
    list_filter = ('category', 'approval_status', 'created_at', 'sdgs')
    search_fields = ('title', 'description')
    date_hierarchy = 'created_at'
    actions = ['approve_projects', 'reject_projects']
    inlines = [ProjectSDGInline]
    
    def approval_actions(self, obj):
        if obj.approval_status == 'pending':
            approve_url = reverse('admin:approve_project', args=[obj.project_id])
            reject_url = reverse('admin:reject_project', args=[obj.project_id])
            return format_html(
                '<button type="button" onclick="window.location.href=\'{}\'">Approve</button> '
                '<button type="button" onclick="window.location.href=\'{}\'">Reject</button>',
                approve_url,
                reject_url
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
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'project/<int:project_id>/approve/',
                self.admin_site.admin_view(self.approve_project),
                name='approve_project',
            ),
            path(
                'project/<int:project_id>/reject/',
                self.admin_site.admin_view(self.reject_project),
                name='reject_project',
            ),
        ]
        return custom_urls + urls
    
    def approve_project(self, request, project_id):
        project = Project.objects.get(pk=project_id)
        project.approval_status = 'approved'
        project.save()
        self.message_user(request, f"Project '{project.title}' has been approved.")
        return HttpResponseRedirect(reverse('admin:projects_project_changelist'))
    
    def reject_project(self, request, project_id):
        project = Project.objects.get(pk=project_id)
        project.approval_status = 'rejected'
        project.save()
        self.message_user(request, f"Project '{project.title}' has been rejected.")
        return HttpResponseRedirect(reverse('admin:projects_project_changelist'))

@admin.register(ProjectSDG)
class ProjectSDGAdmin(admin.ModelAdmin):
    list_display = ('project', 'sdg')
    list_filter = ('sdg',)
    search_fields = ('project__title', 'sdg__sdg_name')
