from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from .models import *


def index(request):
    return render(request, 'scrumboard/board.html', {})

def myscrum(request):
    """
    Private method that will be used for paginator once I figure out how to get it working.
    """
    page = request.GET.get('page')

    # Populate with page name and title
    page_name = "My Projects"
    page_description = "Projects created by " + request.user.username
    title = "My Projects"

    return render(request, 'scrumboard/myscrum.html', {'page_name': page_name,
                                                           'page_description': page_description, 'title': title,
                                                           'projects': myscrum})

# @login_required
# def view_projects(request):
#     """
#     Public method that takes a request, retrieves all Project objects from the model,
#     then calls _projects to render the request to template view_projects.html
#     """
#     my_projects = Project.get_my_projects(request.user)
#     return myscrum(request, my_projects)

def view_projects_scrum(request):
	return render(request, 'scrumboard/view_projects_scrum.html', {})
