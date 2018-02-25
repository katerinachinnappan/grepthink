import json
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.core import serializers
from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
from django.shortcuts import get_object_or_404, redirect, render
from teamwork.apps.courses.models import *
from teamwork.apps.projects.models import *

from teamwork.apps.core.models import *
from teamwork.apps.courses.models import *
from teamwork.apps.core.helpers import *


# TODO Send the right scrum board here
from teamwork.apps.scrumboard.models import Board, Task, Column


def index(request):
    board = Board.objects.all().filter(pk=1)
    columns = Column.objects.all().filter(board_id=1)
    tasks = Task.objects.all().filter(board_id=1)
    initial_data = json.dumps({
        'board': serializers.serialize('json', board),
        'columns': serializers.serialize('json', columns),
        'tasks': serializers.serialize('json', tasks),
    }, cls=DjangoJSONEncoder)
    return render(request, 'scrumboard/scrumboard.html', {
        'initial_data': initial_data
    })

def view_one_scrum(request, slug):

    board = get_object_or_404(Board, slug=slug)
    columns = get_object_or_404(Column, slug=slug)
    tasks = get_object_or_404(Task, slug=slug)
    #page_name = scrum.tittle or "Scrum Board"
    #page_description = scrum.description or "Tagline"
    #title = project.title or "Project"
    #board = Board.objects.all().filter(pk=1)
    #columns = Column.objects.all().filter(board_id=1)
    #tasks = Task.objects.all().filter(board_id=1)
    initial_data = json.dumps({
        'board': serializers.serialize('json', board),
        'columns': serializers.serialize('json', columns),
        'tasks': serializers.serialize('json', tasks),
    }, cls=DjangoJSONEncoder)
    return render(request, 'scrumboard/scrumboard.html', {
        'initial_data': initial_data
    })

def myscrum(request, scrumboard):
        """
        Private method that will be used for paginator once I figure out how to get it working.
        """
        page = request.GET.get('page')

        # Populate with page name and title
        page_name = "My Scrum Boards"
        page_description = "Scrum Boards created by " + request.user.username
        title = "Scrum Boards"

        #print("hello\n\n")

        return render(request, 'scrumboard/myscrum.html', {'page_name': page_name,
             'page_description': page_description, 'title': title, 'scrumboard': scrumboard})

@login_required
def view_scrums(request):
    """
    Public method that takes a request, retrieves all Scrum objects from the model,
    then calls myscrum to render the request to template myscrum.html
    """
    #my_scrums = Board.get_my_scrums(request.user)

    return myscrum(request)


def update(request):
    data = {
        'some_data': 'some data'
    }
    return JsonResponse(data)


def myscrum(request):
    return render(request, 'scrumboard/myscrum.html', {})
