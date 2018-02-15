from django.shortcuts import render


def index(request):
    return render(request, 'scrumboard/board.html', {})

def myscrum(request):
	return render(request, 'scrumboard/myscrum.html', {})