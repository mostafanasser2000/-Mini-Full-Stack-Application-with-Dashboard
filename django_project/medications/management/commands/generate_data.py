from typing import Any
from django.core.management.base import BaseCommand
from medications.models import Category
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Populate database with some categories, and an admin use for testing only"

    def handle(self, *args, **options):
        self.create_initial_data()

    def create_initial_data(self):
        CATEGORIES = [
            "Medications",
            "Skin Care",
            "Medical Devices",
            "Medical Supplies",
            "Drugs",
            "Hair Care",
        ]
        ADMIN_USERNAME = "admin"
        ADMIN_EMAIL = "admin@gmail.com"
        ADMIN_PASSWORD = "admin"
        for category in CATEGORIES:
            Category.objects.get_or_create(name=category)

        if not get_user_model().objects.filter(email=ADMIN_EMAIL).exists():
            get_user_model().objects.create_superuser(
                username=ADMIN_USERNAME, email=ADMIN_EMAIL, password=ADMIN_PASSWORD
            )

        self.stdout.write(
            self.style.SUCCESS("Successfully create some categories and an admin")
        )
