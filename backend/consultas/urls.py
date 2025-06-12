from rest_framework.routers import DefaultRouter
from django.urls import path
from api.views import ConsultasViewSet
from .views import *

router = DefaultRouter()
router.register(r'', ConsultasViewSet, basename='consultas')

urlpatterns = [
    path('', ListaConsultas.as_view(), name='Lista_consulta'),
    path('<int:pk>/', AcessaConsulta.as_view(), name='Acessa_consulta'),
    path('<int:pk>/propostas/', AcessaPropostasConsultas.as_view(), name='Acessa_propostas_consulta'),   
    path('<int:pk>/propostas/<int:jk>', PropostaDiretaC.as_view(), name='Proposta_Direta_C')    
]