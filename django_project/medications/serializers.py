from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from dj_rest_auth.serializers import UserDetailsSerializer

from .models import Medication, Category, RefillRequest


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ["url", "id", "name", "slug"]
        lookup_field = "slug"
        extra_kwargs = {"slug": {"read_only": True}, "url": {"lookup_field": "slug"}}


class MedicationSerializer(serializers.HyperlinkedModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )
    image = serializers.ImageField(required=False)

    class Meta:
        model = Medication
        fields = [
            "url",
            "id",
            "name",
            "slug",
            "description",
            "form",
            "category_id",
            "category",
            "image",
            "price",
            "quantity",
            "available",
            "manufacturer",
            "expiry_date",
        ]
        lookup_field = "slug"

        extra_kwargs = {
            "slug": {"read_only": True},
            "url": {"lookup_field": "slug"},
        }

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(_("Price must be greater than 0"))

        return value

    def validate_quantity(self, value):
        if value and value <= 0:
            raise serializers.ValidationError(_("Quantity must be greater than 1"))
        return value

    def validate_expiry_date(self, value):
        if value and value < timezone.now().date():
            raise serializers.ValidationError(_("Expiry date must be in the future"))
        return value

    def validate_image(self, image):
        if image and image.size > 10 * 1024 * 1024:
            raise serializers.ValidationError(_("Image size should be 10MB or less"))
        return image


class RefillRequestSerializer(serializers.HyperlinkedModelSerializer):
    medication = MedicationSerializer(read_only=True)
    medication_id = serializers.PrimaryKeyRelatedField(
        queryset=Medication.objects.all(), source="medication", write_only=True
    )
    user = UserDetailsSerializer(read_only=True)

    class Meta:
        model = RefillRequest
        fields = [
            "url",
            "id",
            "medication_id",
            "medication",
            "user",
            "quantity",
            "status",
            "first_name",
            "last_name",
            "email",
            "country",
            "city",
            "street",
            "approved_at",
            "created_at",
        ]

        extra_kwargs = {
            "created_at": {"read_only": True},
            "approved_at": {"read_only": True},
            "status": {"read_only": True},
        }

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(_("Quantity must be greater than 0"))
        return value

    def create(self, validated_data):
        validated_data.pop("user", None)
        try:
            refill_request = RefillRequest.objects.create(
                user=self.context["request"].user, status="pending", **validated_data
            )
            return refill_request
        except KeyError:
            raise serializers.ValidationError(
                {"error": "Request context is missing. Unable to get current user."}
            )
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})

    def update(self, instance, validated_data):
        if "status" in validated_data and not self.context["request"].user.is_staff:
            raise serializers.ValidationError(
                _("Only administrators can update the status")
            )
        if "status" in validated_data and instance.status in ["approved", "rejected"]:
            raise serializers.ValidationError(
                _("Can not update Refill Request that already approved or rejected")
            )
        if "medication" in validated_data:
            medication = validated_data["medication"]
            if not medication.available:

                raise serializers.ValidationError(
                    _(
                        "Selected medication is out of stock right now, please come back soon when it's available "
                    )
                )
        return super().update(instance, validated_data)
