from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),

    # 회의록 조회
    path('lists', views.minute_list),
    path('<int:mn_id>', views.minute),

    # 북마크 조회
    path('<int:mn_id>/bookmark/lists', views.bookmark_list),
    path('<int:mn_id>/bookmark/<int:bm_seq>', views.bookmark),

    # 화자 조회
    path('<int:mn_id>/speaker/lists', views.speaker_list),
    path('<int:mn_id>/speaker/<int:speaker_seq>', views.speaker),

    # 파일 업로드
    path('<int:mn_id>/file/upload', views.file_upload),

    # 회의록 검색
    path('search', views.minute_search),

    # 공유 링크 생성
    path('share/link', views.minute_share_link),
    path('create/with/share/link/<str:mn_share_link>', views.create_minute_with_share_link),

    # 음성인식 후 화자 선택
    path('<int:mn_id>/choice/speaker', views.choice_speaker),

    # 회의 결과 모아서 조회
    path('result/<int:mn_id>', views.result),
    path('result/recent', views.get_recent_result),

    # 즐겨찾기 회의록 조회
    path('lists/like', views.get_like_minute)
]
