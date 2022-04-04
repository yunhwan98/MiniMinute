from django.db import models


# Create your models here.
class Users(models.Model):
    user_id = models.AutoField(help_text="회원 식별자", primary_key=True)
    user_email = models.CharField(max_length=50, help_text="이메일")
    user_profile = models.CharField(max_length=512, null=True, blank=True, help_text="프로필 사진 경로")
    user_pw = models.CharField(max_length=100, help_text="비밀번호")
    user_name = models.CharField(max_length=20, help_text="회원 이름")
    user_sign_up_date = models.DateTimeField(help_text="회원 가입 일시")  # auto_now_add 버그 주의
    user_access_date = models.DateTimeField(help_text="최근 접속 일시")

    class Meta:
        ordering = ['user_id']
        db_table = 'user'
