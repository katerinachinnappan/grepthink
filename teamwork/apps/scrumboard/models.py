from django.contrib.auth.models import User
from django.db import models
from teamwork.apps.projects.models import Project


class Board(models.Model):
    project = models.ForeignKey(Project)

    tittle = models.CharField(max_length=100, default='')
    description = models.CharField(max_length=200, default='')
    owner = models.ForeignKey(
        User, related_name='owner', on_delete=models.CASCADE)
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
    category = models.CharField(max_length=200)
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    boardID = models.ForeignKey(Board, on_delete=models.CASCADE,
                                  related_name="boardID", default=0)


    # @staticmethod
    # def get_my_projects(user):
    #     """
    #     Gets a list of project objects. Used in views then passed to the template.
    #     """
    #     # #Gets membership object of current user
    #     # myProjects = Membership.objects.filter(user=user)
    #     # #Gets project queryset of only projects user is in OR the user created
    #     # proj = Project.objects.filter(membership__in=myProjects)
    #
    #     mem = list(user.membership.all())
    #
    #     claimed = list(user.ta.all())
    #
    #     created = list(user.project_creator.all())
    #
    #     projects = list(set(mem + created + claimed))
    #
    #     return projects
