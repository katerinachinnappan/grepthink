# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2018-02-06 21:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0008_auto_20180206_2125'),
    ]

    operations = [
        migrations.AddField(
            model_name='reasons',
            name='reason2',
            field=models.TextField(default='', max_length=38),
        ),
        migrations.AddField(
            model_name='reasons',
            name='reason3',
            field=models.TextField(default='', max_length=38),
        ),
        migrations.AddField(
            model_name='reasons',
            name='reason4',
            field=models.TextField(default='', max_length=38),
        ),
        migrations.AddField(
            model_name='reasons',
            name='reason5',
            field=models.TextField(default='', max_length=38),
        ),
    ]
