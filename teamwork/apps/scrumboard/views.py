import json

from django.core import serializers
from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
from django.shortcuts import get_object_or_404, redirect, render


# TODO Send the right scrum board here
from teamwork.apps.scrumboard.models import Board, Task, Column
from django.contrib.auth.decorators import login_required
from django.http import (HttpResponse, HttpResponseBadRequest,
                         HttpResponseRedirect)
from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render
from teamwork.apps.courses.models import *
from teamwork.apps.projects.models import Project
from teamwork.apps.projects.forms import CreateScrumBoardForm

from teamwork.apps.core.models import *
from teamwork.apps.courses.models import *
from teamwork.apps.core.helpers import *


# @login_required
# def index(request, slug):
#
#     project = get_object_or_404(Project, slug=slug)
#
#     print("hello\n")
#
#     if request.user.profile.isGT:
#         pass
#     elif not request.user == project.creator and request.user not in project.members.all(
#     ):
#         # redirect them with a message
#         messages.info(request, 'Only current members can create a scrum board!')
#         return HttpResponseRedirect('/project/all')
#
#     if request.method == 'POST':
#         print("hellos\n")
#         form = CreateScrumBoardForm(request.user.id, request.POST)
#         if form.is_valid():
#             print("helloss\n")
#             new_board = Board(project=project)
#             new_board.tittle = form.cleaned_data.get('tittle')
#             new_board.description = form.cleaned_data.get('description')
#             new_board.owner = request.user
#             new_board.save()
#             return redirect(myscrum)
#     else:
#         form = CreateScrumBoardForm(request.user.id, request.POST)
#         print("hellosss\n")
#         return render(request, 'scrumboard/create_board.html',
#                       {'form': form,
#                        'project': project})

    # board = Board.objects.all().filter(pk=1)
    # columns = Column.objects.all().filter(board_id=1)
    # tasks = []

    for column in columns:
        task = Task.objects.all().filter(column_id=column.id)
        if task:
            tasks.append([serializers.serialize('json', task)])

    board = serializers.serialize('json', board)
    columns = serializers.serialize('json', columns)
    initial_data = json.dumps({
        'board': board,
        'columns': columns,
        'tasks': tasks,
    }, cls=DjangoJSONEncoder)
    return render(request, 'scrumboard/scrumboard.html', {
        'initial_data': initial_data
    })


def update(request):
    data = {
        'some_data': 'some data'
    }
    return JsonResponse(data)


def myscrum(request):
    """
    Private method that will be used for paginator once I figure out how to get it working.
    """
    page = request.GET.get('page')

    # Populate with page name and title
    page_name = "My Scrum Boards"
    page_description = "Scrum Boards created by " + request.user.username
    title = "My Scrum Boards"

    return render(request, 'scrumboard/myscrum.html', {'page_name': page_name,
                                                           'page_description': page_description, 'title': title,
                                                            })


def view_projects_scrum(request):
    return render(request, 'scrumboard/view_projects_scrum.html', {})
# def myscrum(request):
#     """
#     Private method that will be used for paginator once I figure out how to get it working.
#     """
#     page = request.GET.get('page')
#
#     # Populate with page name and title
#     page_name = "My Projectsss"
#     page_description = "Projects created by " + request.user.username
#     title = "My Projectsd"
#
#     #print("hello\n\n")
#
#     return render(request, 'scrumboard/myscrum.html', {'page_name': page_name,
#                                                            'page_description': page_description, 'title': title
#                                                            })
def myscrumprojects(request, projects):
    """
    Private method that will be used for paginator once I figure out how to get it working.
    """
    page = request.GET.get('page')

    # Populate with page name and title
    page_name = "My Projects"
    page_description = "Projects created by " + request.user.username
    title = "My Projects"

    #print("hello\n\n")

    return render(request, 'scrumboard/myscrum.html', {'page_name': page_name,
                                                           'page_description': page_description, 'title': title,
                                                            'projects': projects})

#
# def projects_in_course(slug):
#     print("helloworldsss\n\n")
#     """
#     Public method that takes a coursename, retreives the course object, returns
#     a list of project objects
#     """
#     # Gets current course
#     cur_course = Course.objects.get(slug=slug)
#     projects = Project.objects.filter(course=cur_course).order_by('-tagline')
#     print("helloworldsss\n\n")
#     print(projects)
#
#     return projects

@login_required
def view_projects(request):
    """
    Public method that takes a request, retrieves all Project objects from the model,
    then calls _projects to render the request to template view_projects.html
    """
    my_projects = Project.get_my_projects(request.user)
    print("helloworldsss\n\n")
    print(my_projects)
    print("\n\n")

    return myscrumprojects(request, my_projects)

# def view_projects_scrum(request):
# 	return render(request, 'scrumboard/view_projects_scrum.html', {})
