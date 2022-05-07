# Generated by Django 3.2.12 on 2022-05-07 08:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('minute', '0001_initial'),
        ('text_keyword', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='keyword',
            name='mn_id',
            field=models.ForeignKey(db_column='mn_id', default='', on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='keywords', serialize=False, to='minute.minutes'),
        ),
    ]