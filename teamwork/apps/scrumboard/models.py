from django.contrib.auth.models import User
from django.db import models
from teamwork.apps.projects.models import Project


class Board(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        default=0)

    tittle = models.CharField(max_length=100, default='')
    description = models.CharField(max_length=200, default='')
    owner = models.ForeignKey(
        User, related_name='owner',
        on_delete=models.CASCADE, default=0)
    members = models.ManyToManyField(
        User, related_name='users')


class Column(models.Model):
    tittle = models.CharField(max_length=100, default='')
    description = models.CharField(max_length=200, default='')
    board = models.ForeignKey(Board, on_delete=models.CASCADE,
                              related_name="board", default=0)


class Task(models.Model):
    assigned = models.BooleanField(default=False)
    title = models.CharField(max_length=100, default='')
    description = models.CharField(max_length=400, default='')
    column = models.ForeignKey(Column, on_delete=models.CASCADE,
                               related_name="column", default=0)
    userID = models.ForeignKey(User, on_delete=models.CASCADE,
                               related_name="user", default=0)
    tittle = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    userID = models.ForeignKey(User, on_delete=models.CASCADE,
                                  related_name="userID", default=0)
    # taskID = models.ForeignKey(Task, on_delete=models.CASCADE,
    #                               related_name="taskID", default=0)

class Task(models.Model):
    assigned = models.BooleanField(default=False)

    title = models.CharField(max_length=100, default='')
    description = models.CharField(max_length=400, default='')
    column = models.ForeignKey(Column, on_delete=models.CASCADE,
                               related_name="column", default=0)
    board = models.ForeignKey(Board, on_delete=models.CASCADE,
    	                      related_name="%(class)s_board", default=0)
    userID = models.ForeignKey(User, on_delete=models.CASCADE,
                               related_name="user", default=0)
