"""backend_django URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_auth.registration.views import RegisterView
from rest_auth.views import LoginView, LogoutView, PasswordChangeView
from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token, refresh_jwt_token

from django.conf.urls.static import static
from django.conf import settings

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [

    path('admin/', admin.site.urls),

    # 사용자별 정보 처리(user.user_urls 참고)
    path('users/', include('user.user_urls')),

    # 사용자별 디렉토리 정보 처리(user.directory_urls 참고)
    path('directorys/', include('user.directory_urls')),
  
    # 회의록 관련
    path('minutes/', include('minute.minutes_urls')),

    # 파일 관련
    path('files/', include('minute.file_urls')),

    # 음성 인식 관련
    path('voice/', include('voice_recognition.urls')),

    # 토큰(발급, 인증, 갱신)
    path('api/token', obtain_jwt_token),
    path('api/token/verify', verify_jwt_token),
    path('api/token/refresh', refresh_jwt_token),

    # rest-auth(로그인, 로그아웃, 회원가입, 패스워드 변경(구현 미정))
    path('home/', include('allauth.urls')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/login', LoginView.as_view(), name='rest_login'),
    path('rest-auth/logout', LogoutView.as_view(), name='rest_logout'),
    path('rest-auth/signup', RegisterView.as_view(), name='rest_register'),
    path('rest-auth/password/change', PasswordChangeView.as_view(), name='rest_password_change'),
  
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
