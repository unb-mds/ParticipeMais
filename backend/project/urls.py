from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('autenticacao.urls')),
    path('conferencias/', include('conferencias.urls')),
    path('planos/', include('planos.urls')),
    path('consultas/', include('consultas.urls')),
    path('comunidade/', include('comunidade.urls')),
    path('api/', include('api.urls')),
]