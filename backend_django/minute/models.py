from django.db import models

# Create your models here.
class Minutes(models.Model):
    mn_id = models.AutoField(
        verbose_name="minute ID",
        primary_key=True,
    )
    user_id = models.ForeignKey(
        "User",
        related_name="user",
        on_delete=models.CASCADE,
        db_column="user_id",
    )
    dr_id = models.ForeignKey(
        "Directory",
        related_name="directory",
        on_delete=models.CASCADE,
        db_column="dr_id",
    )
    mn_make_date = models.DateTimeField()
    mn_title = models.CharField(max_length=50)
    mn_date = models.DateField()
    mn_place = models.CharField(max_length=20)
    mn_explanation = models.CharField(max_length=50)
    mn_memo = models.CharField(max_length=500)
    mn_share_link = models.CharField(max_length=512)
    speaker_seq = models.ForeignKey(
        "Speaker",
        related_name="speaker",
        on_delete=models.CASCADE,
        db_column="speaker_seq",
    )

class Speaker(models.Model):
    speaker_seq = models.AutoField(
        verbose_name="speaker's ID",
        primary_key=True,
    )
    mn_id = models.ForeignKey(
        "Minutes",
        related_name="minutes",
        on_delete=models.CASCADE,
        db_column="minutes_id",
    )
    speaker_name : models.CharField(max_length=10)

class Bookmark(models.Model):
    bm_seq = models.AutoField(
        verbose_name="bookmark ID",
        primary_key=True,
    )
    mn_id = models.ForeignKey(
        "Minutes",
        related_name="minutes",
        on_delete=models.CASCADE,
        db_column="minutes_id",
    )
    bm_start = models.CharField(max_length=10)
    bm_end = models.CharField(max_length=10)
    bm_name = models.CharField(max_length=20)

class File(models.Model):
    mn_id = models.ForeignKey(
        "Minutes",
        related_name="minutes",
        on_delete=models.CASCADE,
        db_column="minutes_id",
    )
    file_name = models.CharField(max_length=20)
    file_extension = models.CharField(max_length=5)
    file_path=models.CharField(
        max_length=512,
        primary_key=True,
    )
