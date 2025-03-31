from django.contrib import admin
from .models import User

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'role', 'created_at')
    list_filter = ('role', 'created_at')
    search_fields = ('full_name', 'email')
    ordering = ('full_name',)
