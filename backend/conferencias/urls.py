from rest_framework.routers import DefaultRouter
from api.views import ConferenciaViewSet

router = DefaultRouter()
router.register(r'', ConferenciaViewSet, basename='conferencias')

urlpatterns = router.urls
