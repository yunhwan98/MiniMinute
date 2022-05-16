from django.db import models

# Create your models here.
class Minutes(models.Model):
    mn_id = models.AutoField(
        verbose_name="minute ID",
        primary_key=True,
    )
    user_id = models.ForeignKey(
        "user.User",
        related_name="minutes",
        on_delete=models.CASCADE,
        db_column="user_id",
    )
    dr_id = models.ForeignKey(
        "user.Directory",
        related_name="minutes",
        on_delete=models.CASCADE,
        db_column="dr_id",
    )
    mn_make_date = models.DateTimeField(auto_now_add=True, editable=False)
    mn_title = models.CharField(max_length=50)
    mn_date = models.DateField(
        null=True,
    )
    mn_place = models.CharField(
        max_length=20,
        null=True,
    )
    mn_explanation = models.CharField(
        max_length=50,
        null=True,
    )
    mn_memo = models.CharField(
        max_length=500,
        null=True,
    )
    mn_share_link = models.CharField(
        max_length=512,
        null=True,
    )
    speaker_seq = models.ForeignKey(
        "Speaker",
        related_name="minutes",
        on_delete=models.SET_NULL,
        db_column="speaker_seq",
        null=True,
    )
    file_id=models.ForeignKey(
        "File",
        related_name="minutes",
        on_delete=models.SET_NULL,
        db_column="file_id",
        null=True,
    )

    class Meta:
        db_table = 'minutes'


class File(models.Model):
    file_id = models.AutoField(
        verbose_name="file ID",
        primary_key=True,
    )
    file_name = models.CharField(max_length=20)
    file_extension = models.CharField(max_length=5)
    file_path = models.CharField(max_length=512)

    class Meta:
        db_table = 'file'


class Speaker(models.Model):
    speaker_seq = models.AutoField(
        verbose_name="speaker's ID",
        primary_key=True,
    )
    mn_id = models.ForeignKey(
        "Minutes",
        related_name="speaker",
        on_delete=models.CASCADE,
        db_column="mn_id",
    )
    speaker_name = models.CharField(
        max_length=20,
        null=True
    )
    class Meta:
        db_table = 'speaker'

class Bookmark(models.Model):
    bm_seq = models.AutoField(
        verbose_name="bookmark ID",
        primary_key=True,
    )
    mn_id = models.ForeignKey(
        "Minutes",
        related_name="bookmark",
        on_delete=models.CASCADE,
        db_column="mn_id",
    )
    bm_start = models.CharField(max_length=10)
    bm_end = models.CharField(max_length=10)
    bm_name = models.CharField(max_length=20)
    class Meta:
        db_table = 'bookmark'

