from django.urls import path
from . import views

urlpatterns = [
    # 회의록 키워드 조회, 갱신
    path('<int:mn_id>', views.get_keyword),
]