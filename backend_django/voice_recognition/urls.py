from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),

    path('recognition/lists', views.voice_recognition_list),
    path('recognition', views.voice_recognition),
]