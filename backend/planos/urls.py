from rest_framework.routers import DefaultRouter
from api.views import PlanosViewSet

router = DefaultRouter()
router.register(r'', PlanosViewSet, basename='planos')

urlpatterns = router.urls
