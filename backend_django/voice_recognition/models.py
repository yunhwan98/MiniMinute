from django.db import models

class VoiceRecognition(models.Model):
    vr_id=models.AutoField(
        verbose_name="voice recognition id",
        primary_key=True,
    )
    vr_seq=models.IntegerField()
    mn_id=models.ForeignKey(
        "minute.Minutes",
        related_name="voice_recognition",
        on_delete=models.CASCADE,
        db_column="mn_id"
    )
    vr_start=models.CharField(max_length=14)
    vr_end=models.CharField(max_length=14)
    vr_text=models.CharField(max_length=1000)
    emotion_type=models.IntegerField(default=4)
    speech_type=models.IntegerField(default=4)
    speaker_seq=models.ForeignKey(
        "minute.Speaker",
        related_name="voice_recognition",
        on_delete=models.SET_NULL,
        db_column="speaker_seq",
        null=True,
    )
    class Meta:
        db_table = 'voice_recognition'

