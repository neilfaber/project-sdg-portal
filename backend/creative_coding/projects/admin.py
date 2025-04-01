
from django.contrib import admin
from .models import Project, SDG, ProjectSDG

# Register your models here.
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'team', 'category', 'approval_status', 'created_at')
    list_filter = ('category', 'approval_status', 'created_at')
    search_fields = ('title', 'description')
    date_hierarchy = 'created_at'
    actions = ['approve_projects', 'reject_projects']
    
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
