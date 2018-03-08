# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2018-03-08 13:42
from __future__ import unicode_literals

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import teamwork.apps.profiles.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('projects', '0006_auto_20180206_2119'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Board',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sprint', models.CharField(default='', max_length=100)),
                ('title', models.CharField(default='', max_length=100)),
                ('description', models.CharField(default='', max_length=200)),
                ('slug', models.CharField(max_length=20, null=True, unique=True)),
                ('backGround', models.ImageField(blank=True, default='', null=True, upload_to='background/', validators=[teamwork.apps.profiles.models.validate_image])),
                ('members', models.ManyToManyField(related_name='members', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owner', to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='project', to='projects.Project')),
            ],
            options={
                'verbose_name': 'Scrum Boards',
                'verbose_name_plural': 'Scrum Boards',
            },
        ),
        migrations.CreateModel(
            name='Column',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='', max_length=100)),
                ('index', models.IntegerField(default=-1)),
                ('slug', models.CharField(default='', max_length=20, null=True)),
                ('board', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='column_board', to='scrumboard.Board')),
            ],
            options={
                'verbose_name': 'Column',
                'verbose_name_plural': 'Column',
            },
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assigned', models.BooleanField(default=False)),
                ('title', models.CharField(default='new task - click to edit', max_length=100)),
                ('description', models.CharField(default='', max_length=400)),
                ('slug', models.CharField(default='', max_length=20, null=True)),
                ('Date', models.DateField(default=datetime.date.today)),
                ('index', models.IntegerField(default=-1)),
                ('colour', models.CharField(default='#fff', max_length=64)),
                ('board', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='task_board', to='scrumboard.Board')),
                ('column', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='column', to='scrumboard.Column')),
                ('members', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Task',
                'verbose_name_plural': 'Task',
            },
        ),
    ]
