from django.urls import path
from . import views

urlpatterns = [

    # 사용자별 디렉토리 전체 조회 및 생성
    path('lists/', views.directory_list),

    # 사용자별 디렉토리 개별 조회 및 수정, 삭제
    path('<int:n>/', views.directory),
]