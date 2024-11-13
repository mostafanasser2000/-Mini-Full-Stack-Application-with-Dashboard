from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, filters
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import (
    CategorySerializer,
    MedicationSerializer,
    RefillRequestSerializer,
)
from .permissions import IsAdminOrReadOnly, RefillRequestPermission
from .models import Category, Medication, RefillRequest


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = CategorySerializer
    lookup_field = "slug"
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]
    search_fields = ["name"]


class MedicationViewSet(ModelViewSet):
    queryset = Medication.objects.select_related("category")
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = MedicationSerializer
    parser_classes = (MultiPartParser, FormParser)
    lookup_field = "slug"

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["category", "available", "form"]
    search_fields = ["name"]
    ordering_fields = ["price", "quantity"]


class RefillRequestViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, RefillRequestPermission]
    serializer_class = RefillRequestSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["medication", "status"]
    search_fields = []
    ordering_fields = ["approved_at", "quantity"]

    def get_queryset(self):
        qs = RefillRequest.objects.select_related("user", "medication")
        if self.request.user.is_staff:
            return qs
        return qs.filter(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    @action(detail=True, methods=["post"], permission_classes=[IsAdminUser])
    def approve(self, request, pk=None):
        """ "Approve a pending request by admins"""
        refill_request = self.get_object()
        if refill_request.status != "pending":
            return Response(
                {"detail": "Only pending requests can be approved."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        refill_request.approve()

        return Response(
            {"detail": f"Refill request ({refill_request.id}) has been approved."},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"], permission_classes=[IsAdminUser])
    def reject(self, request, pk=None):
        """ "Reject a pending request by admins"""
        refill_request = self.get_object()
        if refill_request.status != "pending":
            return Response(
                {"detail": "Only pending requests can be rejected."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        refill_request.reject()
        return Response(
            {"detail": f"Refill request ({refill_request.id}) has been rejected."},
            status=status.HTTP_200_OK,
        )
