from django.contrib.auth.models import User
from django.db import models


class Board(models.Model):
    title = models.CharField(max_length=100, default='')
    description = models.CharField(max_length=200, default='')
    owner = models.ForeignKey(
        User, related_name='owner', on_delete=models.CASCADE)
    members = models.ManyToManyField(
        User, related_name='users')


class Column(models.Model):
    title = models.CharField(max_length=100, default='')
    colour = models.CharField(default="blue", max_length=64)
    board = models.ForeignKey(Board, on_delete=models.CASCADE,
                              related_name="%(class)s_board", default=0)
    index = models.IntegerField(default=-1)


class Task(models.Model):
    assigned = models.BooleanField(default=False)
    colour = models.CharField(default="blue", max_length=64)
    title = models.CharField(max_length=100, default='')
    comment = models.CharField(max_length=400, default='')
    column = models.ForeignKey(Column, on_delete=models.CASCADE,
                               related_name="column", default=0)
    board = models.ForeignKey(Board, on_delete=models.CASCADE,
                              related_name="%(class)s_board", default=0)
    userID = models.ForeignKey(User, on_delete=models.CASCADE,
                               related_name="user", default=0)

