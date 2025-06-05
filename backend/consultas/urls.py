from rest_framework.routers import DefaultRouter
from api.views import ConsultasViewSet

router = DefaultRouter()
router.register(r'', ConsultasViewSet, basename='consultas')

urlpatterns = router.urls
