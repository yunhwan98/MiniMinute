from django.db import models
"""
# Create your models here.
class Directory(models.Model):

    dr_id = models.AutoField(
        verbose_name="directory's ID",
        max_length=11,
        primary_key=True,
    )
    user_id = models.IntegerField(
        verbose_name="user's ID",
        max_length=11,
        primary_key=True,

    )
    dr_name = models.CharField(
        verbose_name="directory's name",
        max_length=10,
    )
    dr_pid = models.IntegerField(
        verbose_name="directory's parent ID",
        max_length=11,
    )


    class Meta:
        ordering = ['mn_id']
        db_table = 'directory'
"""