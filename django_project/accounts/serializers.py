from allauth.account.adapter import get_adapter
from dj_rest_auth.serializers import UserDetailsSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomRegisterSerializer(RegisterSerializer):
    is_staff = serializers.BooleanField(source="user.is_staff", read_only=True)

    def validate_email(self, email):
        # Clean email using the adapter's method
        email = get_adapter().clean_email(email)

        # Check if the email already exists in the user model
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "A user is already registered with this e-mail address."
            )

        return email

    class Meta:
        fields = [
            "username",
            "email",
        ]


class UserDetailsSerializer(UserDetailsSerializer):
    is_staff = serializers.BooleanField()

    class Meta:
        model = User
        fields = UserDetailsSerializer.Meta.fields + ("is_staff",)
        read_only_fields = ("email", "is_staff")
