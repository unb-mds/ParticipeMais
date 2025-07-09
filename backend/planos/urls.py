"""URLs para o módulo de planos."""

from rest_framework.routers import DefaultRouter
from django.urls import path
from api.views import PlanosViewSet
from .views import ListaPlanos, AcessaPlano, AcessaPropostasPlanos, PropostaDiretaPlanos, TogglePlanosView, PlanosFavoritasView

router = DefaultRouter()
router.register(r'', PlanosViewSet, basename='planos')

urlpatterns = [
    path('', ListaPlanos.as_view(), name='Lista_Planos'),
    path('<int:pk>/', AcessaPlano.as_view(), name='Acessa_Planos'),
    path('<int:pk>/propostas/', AcessaPropostasPlanos.as_view(), name='Acessa_Propostas'),
    path('<int:pk>/propostas/<int:jk>/', PropostaDiretaPlanos.as_view(), name='essa_proposta'),
    path('toggle/<int:planos_id>/', TogglePlanosView.as_view(), name='toggle_plano'),
    path('favoritas/', PlanosFavoritasView.as_view(), name='planos_favoritas'),
]

