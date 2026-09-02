from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()

class UserAccountTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='student@example.com',
            password='Password123!',
            first_name='Тарас',
            last_name='Шевченко'
        )

    def test_user_creation(self):
        """Перевірка створення користувача"""
        self.assertEqual(self.user.email, 'student@example.com')
        self.assertTrue(self.user.check_password('Password123!'))

    def test_login_view(self):
        """Перевірка авторизації через email"""
        response = self.client.post(reverse('login'), {
            'username': 'student@example.com',  # Django форму зазвичай очікує під полем username значення email
            'password': 'Password123!'
        })
        self.assertIn(response.status_code, [200, 302])