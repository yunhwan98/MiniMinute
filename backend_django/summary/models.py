from django.db import models


class Summary(models.Model):
    mn_id = models.OneToOneField(
        "minute.Minutes",
        related_name="summarys",
        on_delete=models.CASCADE,
        db_column="mn_id",
        default="",
        primary_key=True,
    )
    summary = models.TextField(
        verbose_name="minute's summary",
        blank=True,
        default=""
    )

    class Meta:
        db_table = 'summary'
