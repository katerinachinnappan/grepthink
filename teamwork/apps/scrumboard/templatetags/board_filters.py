from django import template

from teamwork.apps.projects.models import Project

register = template.Library()


@register.filter(name='reverse')
def reverse(value):
    value = reversed(value)
    map = {}
    boards_by_projects = []
    for e in value:
        project = Project.objects.get(pk=e.project_id)
        if (e.project_id, project.title) in map:
            map[(e.project_id, project.title)].append(e)
        else:
            map[(e.project_id, project.title)] = [e]
    print(map)
    return map.items()
