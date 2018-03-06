import json

from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

# TODO Send the right scrum board here
from teamwork.apps.scrumboard.models import Board, Task, Column


def index(request):
    board = Board.objects.all().filter(pk=1)
    columns = Column.objects.all().filter(board_id=1).order_by('index')
    tasks = Task.objects.all().filter(board_id=1).order_by('index')
    initial_data = json.dumps({
        'board_id': 1,
        # 'board': serializers.serialize('json', board),
        'columns': serializers.serialize('json', columns),
        'tasks': serializers.serialize('json', tasks),
    }, cls=DjangoJSONEncoder)
    return render(request, 'scrumboard/scrumboard.html', {
        'initial_data': initial_data
    })


def updateColumnIndex(request):
    newIndexes = request.POST.getlist('columns[]')
    boardID = request.POST.get('board_id')
    for x in range(0, len(newIndexes)):
        Column.objects.filter(board=boardID, title=newIndexes[x]).update(index=x)
    return HttpResponse(status=204)


def updateTaskIndexSameColumn(request):
    newIndexes = request.POST.getlist('tasks[]')
    boardID = request.POST.get('board_id')
    print(newIndexes)
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
    assigned = request.POST.get('assigned')
    colour = request.POST.get('colour')
    if title is not None:
        Task.objects.filter(id=taskID).update(title=title)
    if desc is not None:
        Task.objects.filter(id=taskID).update(decription=desc)
    if assigned is not None:
        if assigned is 'on':
            Task.objects.filter(id=taskID).update(assigned=True)
        else:
            Task.objects.filter(id=taskID).update(assigned=False)
    if colour is not None:
        Task.objects.filter(id=taskID).update(colour=colour)
    # if taskUpdate.members: TODO
    #    taskUpdate.task.fields.members = taskUpdate.members;

    return HttpResponse(status=204)


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

    # if title is None:
    #     title = ''
    # if desc is None:
    #     desc = ''
    # if assigned is None:
    #     assigned = False
    # if colour is None:
    #     colour = "#fff"
    # if taskUpdate.members: TODO
    #    taskUpdate.task.fields.members = taskUpdate.members;
    # title = title, description = desc,
    # assigned = assigned, colour = colour,

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


def myscrum(request):
    return render(request, 'scrumboard/myscrum.html', {})


def view_projects_scrum(request):
    return render(request, 'scrumboard/view_projects_scrum.html', {})
