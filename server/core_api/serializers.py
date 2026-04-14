from rest_framework import serializers
from .models import UserProfile, Document
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    storage_used = serializers.IntegerField(source='profile.storage_used', read_only=True)
    storage_limit = serializers.IntegerField(source='profile.storage_limit', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'storage_used', 'storage_limit']

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'file_type', 'file_url', 'file_id', 'size_bytes', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']
