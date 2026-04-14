from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    storage_used = models.BigIntegerField(default=0)  # in bytes
    storage_limit = models.BigIntegerField(default=5242880)  # 5MB in bytes by default

    def __str__(self):
        return f"{self.user.username}'s profile"

class Document(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50) # e.g. pdf, docx, txt, code
    file_url = models.URLField(max_length=1024)
    file_id = models.CharField(max_length=255, blank=True, null=True) # ID from ImageKit
    size_bytes = models.BigIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
