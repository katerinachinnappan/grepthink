from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from teamwork.apps.courses.models import *
from teamwork.apps.projects.models import *

from teamwork.apps.core.models import *
from teamwork.apps.courses.models import *
from teamwork.apps.core.helpers import *


def index(request):
    return render(request, 'scrumboard/board.html', {})

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
    page_name = "My Projectsss"
    page_description = "Projects created by " + request.user.username
    title = "My Projectsd"

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
