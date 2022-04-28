from django.urls import path
from . import views

urlpatterns = [
    # 사용자 목록 전체 조회(관리자 계정만 이용 가능)
    path('lists', views.user_list),
    path('profile', views.user),

    # 사용자 정보 수정
    path('profile/upload', views.user_profile),
    path('profile/load', views.user_profile),
    path('name/change', views.user_name_modify),
    path('email/change', views.user_email_modify),

    # 회원 탈퇴
    path('withdraw', views.user),
]