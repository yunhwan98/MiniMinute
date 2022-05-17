from django.urls import path
from . import views

urlpatterns = [
    # 회의록 요약문 조회, 갱신
    path('<int:mn_id>', views.get_summary),
]