from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),

    #회의록 조회
    path('lists/', views.minute_list),
    path('<int:mn_id>', views.minute),

    #북마크 조회
    path('<int:mn_id>/bookmark/lists', views.bookmark_list),
    path('<int:mn_id>/bookmark/<int:bm_seq>', views.bookmark),

    #화자 조회
    path('<int:mn_id>/speaker/lists', views.speaker_list),
    path('<int:mn_id>/speaker/<int:speaker_seq>', views.speaker),
]