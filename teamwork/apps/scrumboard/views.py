from django.shortcuts import render


def index(request):
    return render(request, 'scrumboard/board.html', {})

def myscrum(request):
	return render(request, 'scrumboard/myscrum.html', {})

def view_projects_scrum(request):
	return render(request, 'scrumboard/view_projects_scrum.html', {})