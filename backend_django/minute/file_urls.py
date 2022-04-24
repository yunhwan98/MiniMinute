from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),

    # 파일
    path('lists', views.file_list),
    path('<int:file_id>', views.file),

]