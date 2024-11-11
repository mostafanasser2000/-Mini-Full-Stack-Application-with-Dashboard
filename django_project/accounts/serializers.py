from allauth.account.adapter import get_adapter

from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomRegisterSerializer(RegisterSerializer):
    def validate_email(self, email):
        # Clean email using the adapter's method
        email = get_adapter().clean_email(email)

        # Check if the email already exists in the user model
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "A user is already registered with this e-mail address."
            )

        return email
