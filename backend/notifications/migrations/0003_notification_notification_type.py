# Generated by Django 4.2.16 on 2024-10-08 11:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0002_alter_notification_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='notification_type',
            field=models.CharField(blank=True, choices=[('user_action', 'User Action'), ('admin_broadcast', 'Admin Broadcast')], max_length=20, null=True),
        ),
    ]