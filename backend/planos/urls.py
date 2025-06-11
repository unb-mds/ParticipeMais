from rest_framework.routers import DefaultRouter
from django.urls import path
from api.views import PlanosViewSet
from .views import ListaPlanos, AcessaPlano, AcessaPropostasPlanos, PropostaDiretaP

router = DefaultRouter()
router.register(r'', PlanosViewSet, basename='planos')

urlpatterns = [
    
    path('', ListaPlanos.as_view(), name='Lista_Planos'),
    path('<int:pk>/', AcessaPlano.as_view(), name='Acessa_Planos'),
    path('<int:pk>/propostas/', AcessaPropostasPlanos.as_view(), name='Acessa_Propostas'),
    path('<int:pk>/propostas/<int:jk>/', PropostaDiretaP.as_view(), name='essa_proposta'),
]