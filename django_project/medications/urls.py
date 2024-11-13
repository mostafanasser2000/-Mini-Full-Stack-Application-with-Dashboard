from rest_framework.routers import SimpleRouter

from .views import CategoryViewSet, MedicationViewSet, RefillRequestViewSet

router = SimpleRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("medications", MedicationViewSet, basename="medication")
router.register("refill-requests", RefillRequestViewSet, basename="refillrequest")

urlpatterns = router.urls
