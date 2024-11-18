from django.db import models
from django.core.validators import MinValueValidator
from django.utils.text import slugify
from django.utils import timezone
from django.contrib.auth import get_user_model


MEDICATION_FORMS_CHOICES = [
    ("tablet", "Tablet"),
    ("capsules", "Capsules"),
    ("liquid", "Liquid"),
    ("topical", "Topical"),
    ("drops", "Drops"),
    ("suppositories", "Suppositories"),
    ("inhalers", "Inhalers"),
    ("injections", "Injections"),
    ("others", "Others"),
]


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=300, unique=True, blank=True)

    class Meta:
        ordering = ["name"]
        indexes = [models.Index(fields=["name"])]
        verbose_name = "category"
        verbose_name_plural = "categories"

    def save(self, *args, **kwargs):
        if not self.slug or self.slug != slugify(self.name):
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Medication(models.Model):

    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="medications"
    )
    image = models.ImageField(
        upload_to="medications/",
        blank=True,
        null=True,
        default="static/imgs/default.png",
    )
    price = models.DecimalField(
        max_digits=6, decimal_places=2, validators=[MinValueValidator(1)]
    )
    description = models.CharField(max_length=500, blank=True, null=True)
    form = models.CharField(choices=MEDICATION_FORMS_CHOICES, max_length=100)
    manufacturer = models.CharField(max_length=255, null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    available = models.BooleanField(default=True)
    quantity = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Medication"
        verbose_name_plural = "Medications"
        ordering = ("name",)
        indexes = [
            models.Index(fields=["id", "slug"]),
            models.Index(fields=["name"]),
            models.Index(fields=["-created_at"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug or self.slug != slugify(self.name):
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def make_available(self):
        self.available = True
        self.save()

    def make_unavailable(self):
        self.available = False
        self.save()

    def __str__(self) -> str:
        return self.name

    @property
    def is_expired(self):
        return self.expiry_date < timezone.now().date()

    @property
    def requests_count(self):
        return self.refill_requests.count()


class RefillRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        blank=True,
        related_name="refill_requests",
    )
    medication = models.ForeignKey(
        Medication, on_delete=models.CASCADE, related_name="refill_requests"
    )
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    status = models.CharField(
        choices=STATUS_CHOICES, max_length=20, default="pending", blank=True
    )
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    street = models.CharField(max_length=200, blank=True, null=True)
    approved_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Refill Request"
        verbose_name_plural = "Refill Requests"

    def approve(self):
        self.status = "approved"
        self.approved_at = timezone.now()
        self.save()

    def reject(self):
        self.status = "rejected"
        self.save()

    def __str__(self):
        return f"{self.user} Request ({self.medication}: units) "
