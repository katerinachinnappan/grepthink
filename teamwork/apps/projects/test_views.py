"""
Teamwork: test_views.py

Unit tests for views.py in app projects.

Usuage: Run as a part of all test with `python manage.py test`
"""

from django.contrib.auth.models import UserManager
from django.contrib.auth import authenticate, login
# Django Modules
from django.test import TestCase, override_settings
from django.urls import reverse

from teamwork.apps.profiles.models import *
from teamwork.apps.projects.models import *
from teamwork.apps.courses.models import *


def create_project(title, creator, scrum_master, tagline, content, slug, resource, avail_mem=True, sponsor=False):
    # Create a dummy project (with no M2M relationships) that will be associated with user1
    return Project.objects.create(title=title, creator=creator,
                                  scrum_master=scrum_master,
                                  tagline=tagline, content=content,
                                  avail_mem=avail_mem, sponsor=sponsor, slug=slug, resource=resource)


def create_user(username, email, password):
    # Create a test user as an attribute of ProjectTestCase, for future use
    #   (we're not testing user or profile methods here)
    return User.objects.create_user(username, email, password)


def create_course(name, slug, info):
    return Course.objects.create(name=name, info=info, slug=slug)


class ViewProjectTestCase(TestCase):
    """
    Tests the view_one_project method in projects/views.py

    References:
    https://docs.djangoproject.com/en/1.11/topics/testing/overview/
    https://docs.djangoproject.com/en/1.11/intro/tutorial05/#testing-our-new-view
    https://docs.djangoproject.com/en/1.11/topics/testing/tools/#django.test.override_settings
    https://docs.djangoproject.com/en/1.11/ref/urlresolvers/#django.core.urlresolvers.reverse
    """

    def setUp(self):
        """
        Initialize project, user, and membership objects for use in test methods.

        # Actually not need in this simple test. But will be useful in other tests.
        # user1 = create_user('user_test1', 'test1@test.com', 'groupthink')
        # Membership.objects.create(user=user1, project=project1, invite_reason='')
        """

    @override_settings(STATICFILES_STORAGE=None)
    def test_view_one_project(self):
        """
        Confirms that view_one_project sucesfully returns a 200 response when given the
        slug of an existing project.

        Decorator override_settings to avoid errors with whitenoise when using client().
        """
        # Create a test user as an attribute of ProjectTestCase, for future use
        #   (we're not testing user or profile methods here)
        self.user1 = User.objects.create_user('user_test1', 'test1@test.com', 'groupthink')

        test = authenticate(username='user_test1', password='groupthink')
        # login(username='user_test1', password='groupthink')
        # The course is now looked up in view_one_project because it is needed for breadcrumbs.
        # course1 = create_course("Test Course 1", "test-course1", "Test Info")
        course1 = Course.objects.create(name="Test Course 1", info="Test Course", slug="test-course1",
                                        creator=self.user1)

