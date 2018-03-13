import json

from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
from django.http import HttpResponseRedirect

from teamwork.apps.core.helpers import *
# TODO Send the right scrum board here
from teamwork.apps.scrumboard.models import Board, Task, Column
from teamwork.apps.projects.models import Project
from teamwork.apps.projects.models import Course
from django.contrib.auth.models import User


def view_one_scrum(request, slug):
    # Populate with page name, title and description
    scrum = get_object_or_404(Board, slug=slug)

    page_name = "My Scrum Board - " + scrum.title
    page_description = "Scrum Board created by " + request.user.username
    title = "ScrumBoard"
    description = "About: " + scrum.description

    board = Board.objects.all().filter(slug=slug)
    results = Board.objects.filter(slug=slug)
    members = []
    for board in results:
        members = serializers.serialize('json', board.members.only('id', 'username'))
    columns = Column.objects.all().filter(board_id=board.pk).order_by('index')
    tasks = Task.objects.all().filter(board_id=board.pk).order_by('index')
    initial_data = json.dumps({
        'board_id': board.pk,
        'columns': serializers.serialize('json', columns),
        'tasks': serializers.serialize('json', tasks),
        'members': members
    }, cls=DjangoJSONEncoder)
    return render(request, 'scrumboard/scrumboard.html', {'description': description, 'page_name': page_name,
                                                          'page_description': page_description, 'title': title,
                                                          'initial_data': initial_data
                                                          })


def myscrum(request, scrumboard):
    """
        Private method that will be used for paginator once I figure out how to get it working.
        """
    page = request.GET.get('page')
    # Populate with page name and title
    page_name = "My Scrum Board"
    page_description = "Scrum Boards created by " + request.user.username
    return render(request, 'scrumboard/myscrum.html', {'page_name': page_name,
                                                       'page_description': page_description,
                                                       'scrumboard': scrumboard
                                                       })

def prof_view_myscrum(request, scrumboard, slug):
        """
        Private method that will be used for paginator once I figure out how to get it working.
        """
        get_project_title = str(Project.objects.get(slug=slug))
        page = request.GET.get('page')
        # Populate with page name and title
        page_name = "View Scrum Boards"
        page_description = "Scrum Boards created by " + get_project_title

        return render(request, 'scrumboard/myscrum.html', {'page_name': page_name,
             'page_description': page_description, 'scrumboard': scrumboard})


@login_required
def view_scrums(request):
    """
    Public method that takes a request, retrieves all Scrum objects from the model,
    then calls myscrum to render the request to template myscrum.html
    """

    my_scrums = Board.get_my_scrums(request.user)  # This is broken
    return myscrum(request, my_scrums)

@login_required
def prof_view_scrums(request, slug):
    """
    Public method that takes a request, retrieves all Scrum objects from the model,
    then calls myscrum to render the request to template myscrum.html
    """
    project = get_object_or_404(Project, slug=slug)
    board = Board.get_my_scrums(request.user)
    course = Course.get_my_courses(request.user)
    members = project.members.all()
    flag  = 2
    
    for member in members:
        user = User.objects.get(username=member)
        flag = 1
        break
    #if project.members.all() is not None and board is  None:
    if flag == 1:
        my_scrums = Board.get_my_scrums(user)
        return prof_view_myscrum(request, my_scrums, slug)
    else:
        messages.info(request, 'Project ' + project.title + ' does not have members/scrum board')
        return HttpResponseRedirect('/course')

def updateColumnIndex(request):
    newIndexes = request.POST.getlist('columns[]')
    boardID = request.POST.get('board_id')
    for x in range(0, len(newIndexes)):
        Column.objects.filter(board=boardID, title=newIndexes[x]).update(index=x)
    return HttpResponse(status=204)


def updateTaskIndexSameColumn(request):
    newIndexes = request.POST.getlist('tasks[]')
    boardID = request.POST.get('board_id')
    for x in range(0, len(newIndexes)):
        Task.objects.filter(board=boardID, id=newIndexes[x]).update(index=x)
    return HttpResponse(status=204)

def updateTaskIndexDifferentColumn(request):
    boardID = request.POST.get('board_id')
    newColumnID = request.POST.get('newColumnID')
    oldColTasksOrdered = request.POST.getlist('oldColTasksOrdered[]')
    newColTasksOrdered = request.POST.getlist('newColTasksOrdered[]')
    changedTaskID = request.POST.get('changedTaskID')
    Task.objects.filter(board=boardID, id=changedTaskID).update(column_id=newColumnID)
    for x in range(0, len(oldColTasksOrdered)):
        Task.objects.filter(board=boardID, id=oldColTasksOrdered[x]).update(index=x)
    for x in range(0, len(newColTasksOrdered)):
        Task.objects.filter(board=boardID, id=newColTasksOrdered[x]).update(index=x)
    return HttpResponse(status=204)


def updateTask(request):
    taskID = request.POST.get('task_id')
    title = request.POST.get('title')
    desc = request.POST.get('desc')
    colour = request.POST.get('colour')
    members = request.POST.getlist('members[]')
    Task.objects.filter(id=taskID).update(assigned=not (members is None))
    if title is not None:
        Task.objects.filter(id=taskID).update(title=title)
    if desc is not None:
        Task.objects.filter(id=taskID).update(description=desc)
    if colour is not None:
        Task.objects.filter(id=taskID).update(colour=colour)
    if members is not None:
        Task.objects.get(pk=taskID).members.clear()
        for member in members:
            user = User.objects.get(pk=member)
            Task.objects.get(pk=taskID).members.add(user)
    task = Task.objects.get(pk=taskID)
    return JsonResponse({'task': serializers.serialize('json', [task])})

def updateColumn(request):
    colID = request.POST.get('col_id')
    title = request.POST.get('title')
    Column.objects.filter(id=colID).update(title=title)
    return HttpResponse(status=204)

def addTask(request):
    boardID = request.POST.get('board_id')
    board = Board.objects.get(id=boardID)
    colID = request.POST.get('col_id')
    column = Column.objects.get(id=colID)
    title = request.POST.get('title')
    desc = request.POST.get('desc')
    assigned = request.POST.get('assigned')
    colour = request.POST.get('colour')
    taskIndex = request.POST.get('index')
    newTask = Task.objects.create(board=board, column=column, index=taskIndex)
    return JsonResponse({'task': serializers.serialize('json', [newTask])})

def addColumn(request):
    boardID = request.POST.get('board_id')
    board = Board.objects.get(id=boardID)
    title = request.POST.get('title')
    columnIndex = request.POST.get('index')
    newColumn = Column.objects.create(board=board, title=title, index=columnIndex)
    return JsonResponse({'column': serializers.serialize('json', [newColumn])})

def deleteTask(request):
    taskID = request.POST.get('task_id')
    Task.objects.get(pk=taskID).delete()
    return HttpResponse(status=204)

def deleteColumn(request):
    columnID = request.POST.get('column_id')
    Column.objects.get(pk=columnID).delete()
    return HttpResponse(status=204)

def deleteBoard(request):
    boardID = request.POST.get('board_id')
    Board.objects.get(pk=boardID).delete()
    return HttpResponse(status=204)

def home(request):
    return HttpResponseRedirect('myscrum/all/')

def view_projects_scrum(request):
    return render(request, 'scrumboard/view_projects_scrum.html', {})
