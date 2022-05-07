from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),

    path('recognition/lists/<int:mn_id>', views.voice_recognition_list),
    path('recognition', views.voice_recognition),
]