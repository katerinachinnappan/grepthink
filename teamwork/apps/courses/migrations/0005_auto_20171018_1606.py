# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-10-18 23:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0004_auto_20171017_2144'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assignment',
            name='ass_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='assignment',
            name='due_date',
            field=models.DateField(),
        ),
    ]
