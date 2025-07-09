from rest_framework.routers import DefaultRouter
from django.urls import path
from api.views import ConferenciaViewSet
from .views import *

app_name = 'conferencias'  

router = DefaultRouter()
router.register(r'', ConferenciaViewSet, basename='conferencias')

urlpatterns = [
    path('', ListaConferencias.as_view(), name='listar_conferencias'),
    path('<int:pk>/', AcessaConferencia.as_view(), name='conferencia'),
    path('<int:pk>/propostas/', AcessaPropostas.as_view(), name='propostas'),
    path('<int:pk>/propostas/<int:jk>/', PropostaDireta.as_view(), name='essa_proposta'),
    path('<int:pk>/perguntas', AcessaPerguntas.as_view(), name='perguntas'),
    path('<int:pk>/etapas', AcessaEtapas.as_view(), name='etapas'),
    path('<int:pk>/etapas/<int:jk>/', EtapaDireta.as_view(), name='essa_etapa'),
    path('toggle/<int:conferencia_id>/', ToggleConferenciaView.as_view(), name='toggle_conferencia'),
    path('favoritas/', ConferenciasFavoritasView.as_view(), name='conferencias_favoritas'),
]
