"""
Testes para autenticação do ParticipeMais.
"""

from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Usuario

class UsuarioTests(APITestCase):
    """
    Testes para o endpoint de listagem de usuários.
    """

    def setUp(self):
        """
        Configura a URL para os testes.
        """
        self.url = reverse('listar_usuarios')  # usa o nome da URL

    def test_listar_usuarios(self):
        """
        Testa se a listagem de usuários retorna status 200.
        """
        # Cria um usuário no banco de teste
        Usuario.objects.create_user(
            nome='João', email='joao@email.com', password='senha123', data_nascimento='2000-01-01'
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        print("Resposta JSON:", response.json())  # imprime no terminal
