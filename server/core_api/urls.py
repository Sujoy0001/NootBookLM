from django.urls import path
from .views import FirebaseLoginView, DocumentListCreateView, DocumentDeleteView

urlpatterns = [
    path('auth/firebase/', FirebaseLoginView.as_view(), name='firebase_login'),
    path('documents/', DocumentListCreateView.as_view(), name='document_list_create'),
    path('documents/<int:pk>/', DocumentDeleteView.as_view(), name='document_delete'),
]
