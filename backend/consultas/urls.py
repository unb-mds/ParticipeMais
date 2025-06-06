from rest_framework.routers import DefaultRouter
from django.urls import path
from api.views import ConsultasViewSet
from .views import ListaConsultas, AcessaConsulta, AcessaPropostasConsultas

router = DefaultRouter()
router.register(r'', ConsultasViewSet, basename='consultas')

urlpatterns = [
    path('', ListaConsultas.as_view(), name='Lista_consulta'),
    path('<int:pk>', AcessaConsulta.as_view(), name='Lista_consulta'),
    path('<int:pk>/propostas', AcessaPropostasConsultas.as_view(), name='Lista_consulta')    
]