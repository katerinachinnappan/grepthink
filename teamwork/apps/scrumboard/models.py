from django.contrib.auth.models import User
from django.db import models


class Board(models.Model):
    tittle = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    userID = models.ForeignKey(User, on_delete=models.CASCADE,
                                  related_name="userID", default=0)
    #taskID = models.ForeignKey(Task, on_delete=models.CASCADE,
                                  #related_name="taskID", default=0)


class Task(models.Model):
    assigned = models.BooleanField(default=False)
    category = models.CharField(max_length=200)
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    boardID = models.ForeignKey(Board, on_delete=models.CASCADE,
    	                      related_name="boardID", default=0)
