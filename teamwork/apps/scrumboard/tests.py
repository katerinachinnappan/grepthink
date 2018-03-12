from django.contrib.auth.models import User
from django.test import TestCase

from teamwork.apps.projects.models import Membership, Project
from teamwork.apps.scrumboard.models import Task, Column, Board


def create_project(title, creator, scrum_master, ta, tagline, content, slug, resource, avail_mem=True, sponsor=False):
    return Project.objects.create(title=title, creator=creator, scrum_master=scrum_master, ta=ta, tagline=tagline,
                                  content=content, avail_mem=avail_mem, sponsor=sponsor, slug=slug, resource=resource)


def create_board(project, title, description, sprint, slug, owner_id):
    return Board.objects.create(project=project, title=title, description=description, sprint=sprint, slug=slug,
                                owner_id=owner_id)


def create_column(title, index, slug, board):
    return Column.objects.create(title=title, index=index, slug=slug, board=board)


def create_task(board, title, description, column, index):
    return Task.objects.create(board=board, title=title, description=description, column=column, index=index)


class ViewScrumBoardTestCase(TestCase):

    def setUp(self):
        """
        Initialize project, user, and membership objects for use in test methods.
        """
        self.user1 = User.objects.create_user(
            'user_test1',
            'test1@test.com',
            'groupthink')

        self.user2 = User.objects.create_user(
            'user_test2',
            'test2@test.com',
            'groupthink2')

        self.project1 = create_project(title="Test Project 1", creator=self.user1, scrum_master=self.user2,
                                       ta=self.user2, tagline="Test Tagline 1", content="Test Content 1",
                                       avail_mem=True, sponsor=False, slug="test1-slug",
                                       resource="Test Resource 1")

        Membership.objects.create(user=self.user1, project=self.project1, invite_reason='')

        self.board1 = create_board(project=self.project1, title='test_board', description='description',
                                   sprint='sprint', slug='test1-slug', owner_id=self.user1.pk)

        self.board1.members.add(self.user1)

        self.column1 = create_column(title='test_column_1', index=0, slug=str(Board.objects.get(slug=self.board1.slug)),
                                     board=self.board1)

        self.column2 = create_column(title='test_column_2', index=1, slug=str(Board.objects.get(slug=self.board1.slug)),
                                     board=self.board1)

        self.column3 = create_column(title='test_column_3', index=2, slug=str(Board.objects.get(slug=self.board1.slug)),
                                     board=self.board1)

        self.task1 = create_task(board=self.board1, title='test_task_1', description='description_1',
                                 column=self.column1, index=0)
        self.task2 = create_task(board=self.board1, title='test_task_2', description='description_2',
                                 column=self.column1, index=1)
        self.task3 = create_task(board=self.board1, title='test_task_3', description='description_3',
                                 column=self.column1, index=2)

        self.task1.members.add(self.user1)

    def test_viewMyScrumAll(self):
        self.client.login(username='user_test1', password='groupthink')
        response = self.client.get('/myscrum/all/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'scrumboard/myscrum.html')

    def test_updateColumnIndex(self):
        """The column index is updated"""
        data = {
            'board_id': 1,
            'columns[]': ['test_column_2', 'test_column_3', 'test_column_1']
        }
        column1 = Column.objects.get(pk=1)
        column2 = Column.objects.get(pk=2)
        column3 = Column.objects.get(pk=3)
        self.assertEqual(column1.index, 0)
        self.assertEqual(column2.index, 1)
        self.assertEqual(column3.index, 2)
        response = self.client.post('/scrumboard/updateColumnIndex/', data=data)
        self.assertEqual(response.status_code, 204)
        column1 = Column.objects.get(pk=1)
        column2 = Column.objects.get(pk=2)
        column3 = Column.objects.get(pk=3)
        self.assertEqual(column1.index, 2)
        self.assertEqual(column2.index, 0)
        self.assertEqual(column3.index, 1)

    def test_TaskIndexSameColumn(self):
        """The task index is updated"""
        self.client.login(username='user_test1', password='groupthink')
        data = {
            'board_id': 1,
            'tasks[]': ['3', '1', '2']
        }
        task1 = Task.objects.get(pk=1)
        task2 = Task.objects.get(pk=2)
        task3 = Task.objects.get(pk=3)
        self.assertEqual(task1.index, 0)
        self.assertEqual(task2.index, 1)
        self.assertEqual(task3.index, 2)
        response = self.client.post('/scrumboard/updateTaskIndexSameColumn/', data=data)
        self.assertEqual(response.status_code, 204)
        task1 = Task.objects.get(pk=1)
        task2 = Task.objects.get(pk=2)
        task3 = Task.objects.get(pk=3)
        self.assertEqual(task1.index, 1)
        self.assertEqual(task2.index, 2)
        self.assertEqual(task3.index, 0)

    def test_TaskIndexDifferentColumn(self):
        """The task index is updated as is it's column id"""
        self.client.login(username='user_test1', password='groupthink')
        data = {
            'board_id': 1,
            'tasks[]': ['3', '1', '2'],
            'newColumnID': 2,
            'oldColTasksOrdered[]': ['1', '2'],
            'newColTasksOrdered[]': ['3'],
            'changedTaskID': 3
        }
        task1 = Task.objects.get(pk=1)
        task2 = Task.objects.get(pk=2)
        task3 = Task.objects.get(pk=3)
        self.assertEqual(task1.index, 0)
        self.assertEqual(task2.index, 1)
        self.assertEqual(task3.index, 2)

        self.assertEqual(task1.column, self.column1)
        self.assertEqual(task2.column, self.column1)
        self.assertEqual(task3.column, self.column1)

        response = self.client.post('/scrumboard/updateTaskIndexDifferentColumn/', data=data)
        self.assertEqual(response.status_code, 204)
        task1 = Task.objects.get(pk=1)
        task2 = Task.objects.get(pk=2)
        task3 = Task.objects.get(pk=3)

        self.assertEqual(task1.index, 0)
        self.assertEqual(task2.index, 1)
        self.assertEqual(task3.index, 0)

        self.assertEqual(task1.column, self.column1)
        self.assertEqual(task2.column, self.column1)
        self.assertEqual(task3.column, self.column2)

    def test_updateTaskTitle(self):
        """The task title is updated"""
        self.client.login(username='user_test1', password='groupthink')
        data = {
            'task_id': 1,
            'title': 'A new title',
        }
        task1 = Task.objects.get(pk=1)

        self.assertEqual(task1.title, 'test_task_1')
        response = self.client.post('/scrumboard/updateTask/', data=data)
        self.assertEqual(response.status_code, 200)
        task1 = Task.objects.get(pk=1)
        self.assertEqual(task1.title, 'A new title')

    def test_updateTaskColour(self):
        """The task colour is updated"""
        self.client.login(username='user_test1', password='groupthink')
        data = {
            'task_id': 1,
            'colour': '#f44336',
        }
        task1 = Task.objects.get(pk=1)
        self.assertEqual(task1.colour, '#fff')
        response = self.client.post('/scrumboard/updateTask/', data=data)
        self.assertEqual(response.status_code, 200)
        task1 = Task.objects.get(pk=1)
        self.assertEqual(task1.colour, '#f44336')

    def test_updateColumn(self):
        """The column title is updated"""
        self.client.login(username='user_test1', password='groupthink')
        data = {
            'col_id': 1,
            'title': 'A new title',
        }
        column1 = Column.objects.get(pk=1)
        self.assertEqual(column1.title, 'test_column_1')
        response = self.client.post('/scrumboard/updateColumn/', data=data)
        self.assertEqual(response.status_code, 204)
        column1 = Column.objects.get(pk=1)
        self.assertEqual(column1.title, 'A new title')

    def test_addTask(self):
        """Add a task"""
        self.client.login(username='user_test1', password='groupthink')
        data = {
            'board_id': 1,
            'col_id': 1,
            'title': 'A new title',
            'desc': 'A new description',
            'index': 3,
        }
        response = self.client.post('/scrumboard/addTask/', data=data)
        self.assertJSONEqual(
            response.content,
            {'task': '[{"model": "scrumboard.task", "pk": 4, "fields": {"board": 1, '
                     '"column": 1, "assigned": false, "title": "new task - click to edit", '
                     '"description": "", "user": 0, "slug": "", "Date": "2018-03-12", '
                     '"index": "3", "colour": "#fff", "members": []}}]'}
        )

        task = Task.objects.get(pk=4)
        self.assertIsNotNone(task)

    def test_addColumn(self):
        """Add a column"""
        self.client.login(username='user_test1', password='groupthink')
        data = {
            'board_id': 1,
            'title': 'A new title',
            'index': 3,
        }
        response = self.client.post('/scrumboard/addColumn/', data=data)
        self.assertJSONEqual(
            response.content,
            {'column': '[{"model": "scrumboard.column", "pk": 4, "fields": {"title": "A '
                       'new title", "board": 1, "index": "3", "slug": ""}}]'}
        )
        column = Column.objects.get(pk=4)
        self.assertIsNotNone(column)

    def test_deleteTask(self):
        """Del a task"""
        self.client.login(username='user_test1', password='groupthink')
        data = {
            'task_id': 1,
        }
        task = Task.objects.get(pk=1)
        self.assertIsNotNone(task)
        response = self.client.post('/scrumboard/deleteTask/', data=data)
        self.assertEqual(response.status_code, 204)

    def test_deleteColumn(self):
        """Del a column"""
        self.client.login(username='user_test1', password='groupthink')
        data = {
            'column_id': 1,
        }
        column = Column.objects.get(pk=1)
        self.assertIsNotNone(column)
        response = self.client.post('/scrumboard/deleteColumn/', data=data)
        self.assertEqual(response.status_code, 204)

    def test_deleteBoard(self):
        """Del a board_id"""
        self.client.login(username='user_test1', password='groupthink')
        data = {
            'board_id': 1,
        }
        board = Board.objects.get(pk=1)
        self.assertIsNotNone(board)
        response = self.client.post('/scrumboard/deleteBoard/', data=data)
        self.assertEqual(response.status_code, 204)
