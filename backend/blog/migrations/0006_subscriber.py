# Generated by Django 4.2.16 on 2024-09-17 17:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0005_dailyvisit_delete_blogstatistics'),
    ]

    operations = [
        migrations.CreateModel(
            name='Subscriber',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('subscribed_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-subscribed_at'],
                'indexes': [models.Index(fields=['email'], name='blog_subscr_email_5250c5_idx')],
            },
        ),
    ]