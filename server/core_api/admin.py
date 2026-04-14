from django.contrib import admin
from .models import UserProfile, Document
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

# Re-register UserAdmin slightly to make blocking easier if needed.
# By default, UserAdmin allows unchecking "Active" to block a user.
admin.site.unregister(User)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('is_active', 'is_staff')
    # Unchecking 'is_active' will block the user from logging in via Firebase 
    # to your Django API because the get_or_create logic won't give them a valid session.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'storage_used', 'storage_limit')
    search_fields = ('user__username', 'user__email')

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'file_type', 'size_bytes', 'uploaded_at')
    list_filter = ('file_type', 'uploaded_at')
    search_fields = ('title', 'user__username')
