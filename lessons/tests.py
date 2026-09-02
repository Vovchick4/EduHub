from django.test import TestCase
from django.urls import reverse

from courses.models import Course
from lessons.models import Comment, Lesson
from users.models import User


class CommentViewsTests(TestCase):
    def setUp(self):
        self.teacher = User.objects.create_user(
            email="teacher@example.com",
            password="strong-password",
            first_name="Teacher",
            last_name="User",
            role="teacher",
        )
        self.student = User.objects.create_user(
            email="student@example.com",
            password="strong-password",
            first_name="Student",
            last_name="User",
        )
        self.outsider = User.objects.create_user(
            email="outsider@example.com",
            password="strong-password",
            first_name="Outside",
            last_name="User",
        )
        self.course = Course.objects.create(name="Python", author=self.teacher)
        self.course.students.add(self.student)
        self.lesson = Lesson.objects.create(course=self.course, title="Django")

    def comment_url(self):
        return reverse(
            "comment_create",
            kwargs={"course_id": self.course.pk, "pk": self.lesson.pk},
        )

    def test_enrolled_student_can_create_comment(self):
        self.client.force_login(self.student)

        response = self.client.post(self.comment_url(), {"content": "Useful lesson"})

        self.assertRedirects(
            response,
            reverse("lesson_detail", kwargs={"course_id": self.course.pk, "pk": self.lesson.pk}),
        )
        comment = Comment.objects.get()
        self.assertEqual(comment.author, self.student)
        self.assertEqual(comment.lesson, self.lesson)

    def test_outsider_cannot_create_comment(self):
        self.client.force_login(self.outsider)

        response = self.client.post(self.comment_url(), {"content": "I should not post"})

        self.assertRedirects(
            response,
            reverse("lesson_detail", kwargs={"course_id": self.course.pk, "pk": self.lesson.pk}),
        )
        self.assertFalse(Comment.objects.exists())

    def test_comment_author_can_delete_own_comment(self):
        comment = Comment.objects.create(
            lesson=self.lesson,
            author=self.student,
            content="Delete me",
        )
        self.client.force_login(self.student)
        url = reverse(
            "comment_delete",
            kwargs={
                "course_id": self.course.pk,
                "lesson_pk": self.lesson.pk,
                "pk": comment.pk,
            },
        )

        response = self.client.post(url)

        self.assertRedirects(
            response,
            reverse("lesson_detail", kwargs={"course_id": self.course.pk, "pk": self.lesson.pk}),
        )
        self.assertFalse(Comment.objects.filter(pk=comment.pk).exists())
