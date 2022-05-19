from django.db import models

# 유저의 회의록별 맞춤 피드백 정보 저장
class Feedback(models.Model):
    fb_id = models.AutoField(primary_key=True)
    mn_id = models.ForeignKey(
        "minute.Minutes",
        related_name="feedbacks",
        on_delete=models.CASCADE,
        db_column="mn_id",
        unique=True,
    )
    user_id = models.ForeignKey(
        "user.User",
        related_name="feedbacks",
        on_delete=models.CASCADE,
        db_column="user_id",
    )
    angry = models.IntegerField(default=0)
    sadness = models.IntegerField(default=0)
    neutral = models.IntegerField(default=0)
    happiness = models.IntegerField(default=0)
    hate_rate = models.FloatField(default=0.0)
    offensive_rate = models.FloatField(default=0.0)
    general_rate = models.FloatField(default=0.0)
    speech_rate = models.FloatField(default=0.0)

    class Meta:
        db_table = 'feedback'
