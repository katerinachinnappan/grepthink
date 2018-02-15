from django.contrib.auth.models import User
from django.db import models


class Task(models.Model):
    assigned = models.BooleanField(default=False)
    category = models.CharField(max_length=200)
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200)

class Board(models.Model):
    tittle = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    userID = models.ForeignKey(User, on_delete=models.CASCADE,
                                  related_name="userID", default=0)
    taskID = models.ForeignKey(Task, on_delete=models.CASCADE,
                                  related_name="taskID", default=0)

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
