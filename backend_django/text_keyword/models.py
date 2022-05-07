from django.db import models

class Keyword(models.Model):
    mn_id = models.OneToOneField(
        "minute.Minutes",
        related_name="keywords",
        on_delete=models.CASCADE,
        db_column="mn_id",
        primary_key=True,
        default=""
    )
    keyword1 = models.CharField(
        verbose_name="minute's keyword1",
        max_length=20,
        blank=True,
        default=""
    )
    keyword2 = models.CharField(
        verbose_name="minute's keyword2",
        max_length=20,
        blank=True,
        default=""
    )
    keyword3 = models.CharField(
        verbose_name="minute's keyword3",
        max_length=20,
        blank=True,
        default=""
    )
    class Meta:
        db_table = 'keyword'
