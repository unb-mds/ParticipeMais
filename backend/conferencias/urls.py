from rest_framework.routers import DefaultRouter
from django.urls import path
from api.views import ConferenciaViewSet
from .views import ListaConferencias, AcessaConferencia, AcessaPropostas, AcessaPerguntas, AcessaEtapas

router = DefaultRouter()
router.register(r'', ConferenciaViewSet, basename='conferencias')

urlpatterns = [
    path('', ListaConferencias.as_view(), name='listar_conferencias'),
    path('<int:pk>/', AcessaConferencia.as_view(), name='conferencia'),
    path('<int:pk>/propostas', AcessaPropostas.as_view(), name='propostas'),
    path('<int:pk>/perguntas', AcessaPerguntas.as_view(), name='perguntas'),
    path('<int:pk>/etapas', AcessaEtapas.as_view(), name='etapas'),
]
