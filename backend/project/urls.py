from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('autenticacao.urls')),
    path('conferencias/', include('conferencias.urls')),
    path('planos/', include('planos.urls')),
    path('consultas/', include('consultas.urls')),
    path('comunidade/', include('comunidade.urls')),
    path('', include('api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)