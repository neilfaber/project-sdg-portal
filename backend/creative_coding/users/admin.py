
from django.contrib import admin
from django.utils.html import format_html
from django.urls import path
from django.http import HttpResponseRedirect
from django.urls import reverse
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
            approve_url = reverse('admin:approve_user', args=[obj.id])
            return format_html(
                '<button type="button" onclick="window.location.href=\'{}\'">Approve</button>',
                approve_url
            )
        else:
            reject_url = reverse('admin:reject_user', args=[obj.id])
            return format_html(
                '<button type="button" onclick="window.location.href=\'{}\'">Deactivate</button>',
                reject_url
            )
    approval_actions.short_description = 'Actions'
    
    def approve_user(self, request, queryset):
        queryset.update(is_active=True)
    approve_user.short_description = "Approve selected users"
    
    def reject_user(self, request, queryset):
        queryset.update(is_active=False)
    reject_user.short_description = "Reject selected users"
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'user/<int:user_id>/approve/',
                self.admin_site.admin_view(self.approve_user_view),
                name='approve_user',
            ),
            path(
                'user/<int:user_id>/reject/',
                self.admin_site.admin_view(self.reject_user_view),
                name='reject_user',
            ),
        ]
        return custom_urls + urls
    
    def approve_user_view(self, request, user_id):
        user = User.objects.get(pk=user_id)
        user.is_active = True
        user.save()
        self.message_user(request, f"User '{user.full_name}' has been approved.")
        return HttpResponseRedirect(reverse('admin:users_user_changelist'))
    
    def reject_user_view(self, request, user_id):
        user = User.objects.get(pk=user_id)
        user.is_active = False
        user.save()
        self.message_user(request, f"User '{user.full_name}' has been deactivated.")
        return HttpResponseRedirect(reverse('admin:users_user_changelist'))
