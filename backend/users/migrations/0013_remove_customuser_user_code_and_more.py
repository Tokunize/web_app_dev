# Generated by Django 4.2.16 on 2024-12-30 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0012_remove_customuser_rol'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='user_code',
        ),
        migrations.AddField(
            model_name='customuser',
            name='is_email_verified',
            field=models.BooleanField(default=False),
        ),
    ]