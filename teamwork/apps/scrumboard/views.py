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
from teamwork.apps.courses.models import *
from teamwork.apps.projects.models import *

from teamwork.apps.core.models import *
from teamwork.apps.core.helpers import *



# TODO Send the right scrum board here
from teamwork.apps.scrumboard.models import Board, Task, Column
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
from django.shortcuts import get_object_or_404, redirect, render

def view_one_scrum(request, slug):
    # Populate with page name, title and description
    scrum = get_object_or_404(Board, slug=slug)
    page_name = "My Scrum Board - " +  scrum.title
    page_description = "Scrum Board created by " + request.user.username
    title = "ScrumBoard"
    description = "About: " + scrum.description

    board = Board.objects.all().filter(slug=slug)
    columns = Column.objects.all().filter(slug=slug)
    tasks = Task.objects.all().filter(slug=slug)
    initial_data = json.dumps({
        'board': serializers.serialize('json', board),
        'columns': serializers.serialize('json', columns),
        'tasks': serializers.serialize('json', tasks),
    }, cls=DjangoJSONEncoder)
    return render(request, 'scrumboard/scrumboard.html', {'description': description,'page_name': page_name,
             'page_description': page_description,  'title': title,
        'initial_data': initial_data
    })


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


def update(request):
    data = {
        'some_data': 'some data'
    }
    return JsonResponse(data)


def myscrum(request, scrumboard):
        """
        Private method that will be used for paginator once I figure out how to get it working.
        """
        page = request.GET.get('page')
        # Populate with page name and title
        page_name = "My Scrum Board" 
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
    my_scrums = Board.get_my_scrums(request.user)

    return myscrum(request, my_scrums)




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

@login_required
def view_one_project_scrum(request, slug):
    """
    Public method that takes a request and a slug, retrieves the Project object
    from the model with given project slug.  Renders projects/view_project.html

    Passing status check unit test in test_views.py.
    """

    project = get_object_or_404(Project, slug=slug)
    scrum_master = project.scrum_master
    updates = project.get_updates()
    resources = project.get_resources()
    # Get the project owner for color coding stuff
    project_owner = project.creator.profile
    members = project.members.all()

    # Populate with project name and tagline
    page_name = project.title or "Project"
    page_description = project.tagline or "Tagline"
    title = project.title or "Project"

    # Get the course given a project wow ethan great job keep it up.
    course = project.course.first()
    staff = course.get_staff()

    asgs = list(course.assignments.all())
    asg_completed = []

    for i in asgs:
        for j in i.subs.all():
            if j.evaluator == request.user:
                asg_completed.append(i)
                break

    user = request.user
    profile = Profile.objects.get(user=user)

    # to reduce querys in templates -kp
    pending_members = project.pending_members.all()
    pending_count = len(pending_members)
    project_members = project.members.all()

    requestButton = 1
    if request.user in pending_members:
        requestButton = 0

    project_chat = reversed(project.get_chat())
    if request.method == 'POST':
        form = ChatForm(request.user.id, slug, request.POST)
        if form.is_valid():
            # Create a chat object
            chat = ProjectChat(author=request.user, project=project)
            chat.content = form.cleaned_data.get('content')
            chat.save()
            return redirect(view_one_project, project.slug)
        else:
            messages.info(request, 'Errors in form')
    else:
        # Send form for initial project creation
        form = ChatForm(request.user.id, slug)

    find_meeting(slug)

    readable = ""
    if project.readable_meetings:
        jsonDec = json.decoder.JSONDecoder()
        readable = jsonDec.decode(project.readable_meetings)

    completed_tsrs = project.tsr.all()
    avg_dict = {}
    for i in completed_tsrs.all():
        if i.evaluatee in avg_dict.keys():
            avg_dict[i.evaluatee] = int(avg_dict[i.evaluatee]) + int(i.percent_contribution)
        else:
            avg_dict[i.evaluatee] = int(i.percent_contribution)

    avgs = []
    for key, item in avg_dict.items():
        con_avg = item / (len(completed_tsrs) / len(members))
        avgs.append((key, int(con_avg)))

    # ======================
    assigned_tsrs = course.assignments.filter(ass_type="tsr", closed=False)

    tsr_tuple = {}

    if not request.user.profile.isGT:
        user_role = Enrollment.objects.filter(user=request.user, course=course).first().role
    else:
        user_role = 'GT'

    fix = []
    new_tsr_tuple = []
    if request.user.profile.isGT or request.user.profile.isProf or user_role == "ta":
        temp_tup = sorted(project.tsr.all(), key=lambda x: (x.ass_number, x.evaluatee.id))
        temp = ""

        for j in temp_tup:
            if temp != j.evaluatee:
                temp = j.evaluatee
                fix.append([temp, j.ass.first(), j, 1])
            else:
                fix.append(["", j.ass.first(), j, 0])
    else:
        fix = None

    med = 100
    if len(members) > 0:
        med = int(100 / len(members))
    mid = {'low': int(med * 0.7), 'high': int(med * 1.4)}
    # ======================
    today = datetime.now().date()

    return render(request, 'scrumboard/myscrum.html', {'page_name': page_name,
                                                          'page_description': page_description, 'title': title,
                                                          'members': members, 'form': form, 'temp_tup': fix,
                                                          'project': project, 'project_members': project_members,
                                                          'pending_members': pending_members,
                                                          'requestButton': requestButton, 'avgs': avgs,
                                                          'assignments': asgs, 'asg_completed': asg_completed,
                                                          'today': today,
                                                          'pending_count': pending_count, 'profile': profile,
                                                          'scrum_master': scrum_master, 'staff': staff,
                                                          'updates': updates, 'project_chat': project_chat,
                                                          'course': course, 'project_owner': project_owner,
                                                          'meetings': readable, 'resources': resources,
                                                          'json_events': project.meetings, 'contribute_levels': mid,
                                                          'assigned_tsrs': assigned_tsrs})
