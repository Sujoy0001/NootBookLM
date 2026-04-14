import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.models import User
from .models import UserProfile, Document
from .serializers import UserSerializer, DocumentSerializer
from imagekitio import ImageKit
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials, firestore
from django.conf import settings

# Initialize Firebase Admin
if not firebase_admin._apps:
    cred_path = getattr(settings, 'FIREBASE_CREDENTIALS_PATH', 'firebase-account.json')
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

class FirebaseLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        id_token = request.data.get('token')
        if not id_token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if not firebase_admin._apps:
                user_email = "dev@example.com"
                username = "dev_user"
                uid = "dev_uid_123"
            else:
                decoded_token = firebase_auth.verify_id_token(id_token)
                uid = decoded_token['uid']
                user_email = decoded_token.get('email', '')
                username = user_email.split('@')[0] if user_email else uid

            user, created = User.objects.get_or_create(username=username, defaults={'email': user_email})
            if created:
                UserProfile.objects.create(user=user)
                user.set_unusable_password()
                user.save()
            
            # Sync new user to firestore
            if firebase_admin._apps:
                db = firestore.client()
                db.collection('users').document(username).set({
                    'email': user_email,
                    'storage_used': user.profile.storage_used,
                    'storage_limit': user.profile.storage_limit
                }, merge=True)

            from rest_framework.authtoken.models import Token
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DocumentListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        docs = request.user.documents.all().order_by('-uploaded_at')
        serializer = DocumentSerializer(docs, many=True)
        return Response(serializer.data)

    def post(self, request):
        if 'file' not in request.FILES:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = request.FILES['file']
        file_size = uploaded_file.size
        
        allowed_extensions = ['.pdf', '.docx', '.txt', '.md', '.py', '.js', '.ts', '.java', '.cpp', '.html', '.css', '.json']
        _, ext = os.path.splitext(uploaded_file.name)
        if ext.lower() not in allowed_extensions:
            return Response({'error': f'File type not allowed. Supported types: {", ".join(allowed_extensions)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        profile = request.user.profile
        if profile.storage_used + file_size > profile.storage_limit:
            return Response({'error': 'Storage limit exceeded. Maximum 5MB allowed.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            imagekit = ImageKit(
                public_key=settings.IMAGEKIT_PUBLIC_KEY,
                private_key=settings.IMAGEKIT_PRIVATE_KEY,
                url_endpoint=settings.IMAGEKIT_URL_ENDPOINT
            )
            upload_info = imagekit.upload_file(
                file=uploaded_file.read(),
                file_name=uploaded_file.name
            )
            
            doc = Document.objects.create(
                user=request.user,
                title=uploaded_file.name,
                file_type=uploaded_file.content_type,
                file_url=upload_info.response_metadata.raw.get('url', upload_info.url),
                file_id=upload_info.file_id,
                size_bytes=file_size
            )
            
            profile.storage_used += file_size
            profile.save()

            # Push to Firestore
            if firebase_admin._apps:
                db = firestore.client()
                # Store document
                db.collection('users').document(request.user.username).collection('documents').document(str(doc.id)).set({
                    'id': doc.id,
                    'title': doc.title,
                    'file_type': doc.file_type,
                    'file_url': doc.file_url,
                    'file_id': doc.file_id,
                    'size_bytes': doc.size_bytes,
                    'uploaded_at': doc.uploaded_at.isoformat()
                })
                # Update user storage
                db.collection('users').document(request.user.username).set({
                    'storage_used': profile.storage_used
                }, merge=True)

            return Response(DocumentSerializer(doc).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DocumentDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            doc = request.user.documents.get(pk=pk)
            imagekit = ImageKit(
                public_key=settings.IMAGEKIT_PUBLIC_KEY,
                private_key=settings.IMAGEKIT_PRIVATE_KEY,
                url_endpoint=settings.IMAGEKIT_URL_ENDPOINT
            )
            if doc.file_id:
                try:
                    imagekit.delete_file(doc.file_id)
                except Exception as e:
                    print("Error deleting from ImageKit:", e)
                    pass
            
            profile = request.user.profile
            profile.storage_used = max(0, profile.storage_used - doc.size_bytes)
            profile.save()
            
            # Delete from Firestore
            if firebase_admin._apps:
                db = firestore.client()
                db.collection('users').document(request.user.username).collection('documents').document(str(pk)).delete()
                db.collection('users').document(request.user.username).set({
                    'storage_used': profile.storage_used
                }, merge=True)

            doc.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Document.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
