
from django.contrib import admin
from .models import User

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'role', 'created_at')
    list_filter = ('role', 'created_at')
    search_fields = ('full_name', 'email')
    ordering = ('full_name',)
    actions = ['approve_user', 'reject_user']

    def approve_user(self, request, queryset):
        queryset.update(is_active=True)
    approve_user.short_description = "Approve selected users"
    
    def reject_user(self, request, queryset):
        queryset.update(is_active=False)
    reject_user.short_description = "Reject selected users"
