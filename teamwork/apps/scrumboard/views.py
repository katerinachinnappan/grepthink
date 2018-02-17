from django.shortcuts import render

from django.contrib.auth.models import User
from django.http import JsonResponse


def index(request):
    return render(request, 'scrumboard/scrumboard.html', {})


def update(request):
    data = {
        'some_data': 'some data'
    }
    return JsonResponse(data)


def myscrum(request):
    return render(request, 'scrumboard/myscrum.html', {})


def view_projects_scrum(request):
    return render(request, 'scrumboard/view_projects_scrum.html', {})
