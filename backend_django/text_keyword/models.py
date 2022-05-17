from django.db import models

from minute.models import Minutes


class Keyword(models.Model):
    kw_id = models.AutoField(primary_key=True)
    mn_id = models.ForeignKey(
        "minute.Minutes",
        related_name="keywords",
        on_delete=models.CASCADE,
        db_column="mn_id",
        unique=True,
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
