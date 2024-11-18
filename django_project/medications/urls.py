from rest_framework.routers import SimpleRouter
from django.urls import path

from . import views

router = SimpleRouter()
router.register("categories", views.CategoryViewSet, basename="category")
router.register("medications", views.MedicationViewSet, basename="medication")
router.register("refill-requests", views.RefillRequestViewSet, basename="refillrequest")

urlpatterns = router.urls

urlpatterns += [
    path("medication-forms/", views.medication_forms, name="medication-forms")
]
