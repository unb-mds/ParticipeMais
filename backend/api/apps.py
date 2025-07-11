"""
Configuração do aplicativo API do ParticipeMais.
"""

from django.apps import AppConfig

class UsuariosConfig(AppConfig):
    """
    Configuração da aplicação 'api'.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.api'
