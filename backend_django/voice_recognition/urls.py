from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),

    path('recognition/lists/<int:mn_id>', views.voice_recognition_list),
    path('recognition/<int:mn_id>/<int:vr_seq>', views.voice_recognition),
    path('recognition/<int:mn_id>/search', views.voice_recognition_search),

]