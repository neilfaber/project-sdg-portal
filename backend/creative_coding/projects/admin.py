from django.contrib import admin
from .models import Project, SDG, ProjectSDG

# Register your models here.
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'team', 'category', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('title', 'description')
    date_hierarchy = 'created_at'

@admin.register(SDG)
class SDGAdmin(admin.ModelAdmin):
    list_display = ('sdg_name',)
    search_fields = ('sdg_name',)

@admin.register(ProjectSDG)
class ProjectSDGAdmin(admin.ModelAdmin):
    list_display = ('project', 'sdg')
    list_filter = ('sdg',)
