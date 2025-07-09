"""
Configuração do aplicativo de autenticação do ParticipeMais.
"""

from django.apps import AppConfig


class AutenticacaoConfig(AppConfig):
    """
    Configuração da aplicação 'autenticacao'.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'autenticacao'
