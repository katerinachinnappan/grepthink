# Built-in modules
from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models
import datetime
import random
import string
from math import floor
from decimal import Decimal

# Third-party Modules
import markdown
# Django modules
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
# Not used currently
from django.db.models import Q
from django.template.defaultfilters import slugify

from django.core.validators import URLValidator

from teamwork.apps.core.models import *
from teamwork.apps.profiles.models import *
from teamwork.apps.projects.models import Project

import datetime

today = datetime.date.today()


class Board(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        default=0, related_name='project')
    sprint = models.CharField(max_length=100, default='')

    title = models.CharField(max_length=100, default='')
    description = models.CharField(max_length=200, default='')
    members = models.ManyToManyField(User)
    owner = models.ForeignKey(
        User, related_name='owner', on_delete=models.CASCADE)
    # Unique URL slug for assignment
    slug = models.CharField(
        max_length=20,
        unique=True, null=True)

    # The Meta class provides some extra information about the ScrumBoard model.
    class Meta:
        # Verbose name is the same as class name in this case.
        verbose_name = "Scrum Boards"
        # Multiple Project objects are referred to as Projects.
        verbose_name_plural = "Scrum Boards"

    @staticmethod
    def get_my_scrums(user):
        """
        Gets a list of ScrumBoard objects. Used in views then passed to the template.
        """
        # #Gets membership and ownership object of current user
        mem = list(user.users.all())

        owner = list(user.owner.all())

        scrums = list(set(mem + owner))

        return scrums

    def __str__(self):
        return (("%s" % (self.slug)))

    def save(self, *args, **kwargs):

        if self.slug is None or len(self.slug) == 0:
            # Basing the slug off of project title. Possibly change in the future.
            newslug = self.title
            newslug = slugify(newslug)[0:20]
            while Board.objects.filter(slug=newslug).exists():
                # print(Project.objects.filter(slug=newslug).exists())
                newslug = self.title
                newslug = slugify(newslug[0:16] + "-" + rand_code(3))
            self.slug = newslug

            self.slug = slugify(self.slug)

        super(Board, self).save(*args, **kwargs)


class Column(models.Model):
    title = models.CharField(max_length=100, default='')
    board = models.ForeignKey(Board, on_delete=models.CASCADE,
                              related_name="%(class)s_board", default=0)
    index = models.IntegerField(default=-1)
    # Unique URL slug for assignment
    slug = models.CharField(
        default="",
        max_length=20,
        unique=False,
        null=True)

    # The Meta class provides some extra information about the Column model.
    class Meta:
        # Verbose name is the same as class name in this case.
        verbose_name = "Column"
        # Multiple Project objects are referred to as Projects.
        verbose_name_plural = "Column"


class Task(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE,
                              related_name="%(class)s_board", default=0)
    column = models.ForeignKey(Column, on_delete=models.CASCADE,
                               related_name="column", default=0)

    assigned = models.BooleanField(default=False)
    title = models.CharField(max_length=100, default='new task - click to edit')

    description = models.CharField(max_length=400, default='')

    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name="user", default=0)
    # Unique URL slug for assignment
    slug = models.CharField(
        default="",
        max_length=20,
        unique=False,
        null=True)
    date = models.DateField(name="Date", default=today)
    members = models.ManyToManyField(User)
    index = models.IntegerField(default=-1)
    colour = models.CharField(default="#fff", max_length=64)

    # The Meta class provides some extra information about the Column model.
    class Meta:
        # Verbose name is the same as class name in this case.
        verbose_name = "Task"
        # Multiple Project objects are referred to as Projects.
        verbose_name_plural = "Task"
