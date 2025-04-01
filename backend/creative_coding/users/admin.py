
from django.contrib import admin
from django.utils.html import format_html
from .models import User

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'role', 'is_active', 'created_at', 'approval_actions')
    list_filter = ('role', 'is_active', 'created_at')
    search_fields = ('full_name', 'email')
    ordering = ('full_name',)
    actions = ['approve_user', 'reject_user']

    def approval_actions(self, obj):
        if not obj.is_active:
            return format_html(
                '<button type="button" onclick="window.location.href=\'{}\'">Approve</button>',
                f'/admin/users/user/{obj.id}/approve/'
            )
        else:
            return format_html(
                '<button type="button" onclick="window.location.href=\'{}\'">Deactivate</button>',
                f'/admin/users/user/{obj.id}/reject/'
            )
    approval_actions.short_description = 'Actions'
    
    def approve_user(self, request, queryset):
        queryset.update(is_active=True)
    approve_user.short_description = "Approve selected users"
    
    def reject_user(self, request, queryset):
        queryset.update(is_active=False)
    reject_user.short_description = "Reject selected users"
