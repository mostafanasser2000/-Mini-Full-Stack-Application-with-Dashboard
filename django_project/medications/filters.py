from django_filters import rest_framework as filters

from .models import Medication, RefillRequest


class MedicationFilter(filters.FilterSet):
    category = filters.CharFilter(field_name="category__slug")

    class Meta:
        model = Medication
        fields = ["category", "available", "form"]


class RefillRequestFilter(filters.FilterSet):
    medication = filters.CharFilter(field_name="medication__slug")

    class Meta:
        model = RefillRequest
        fields = ["medication", "status"]
