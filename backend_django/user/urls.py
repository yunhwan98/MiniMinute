from django.urls import path
from . import views

urlpatterns = [
    path('directorys/', views.directorys, name='directorys'),
]