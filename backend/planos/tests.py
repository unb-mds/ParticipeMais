"""Testes automatizados para o módulo de Planos."""

from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from propostas.models import Propostas
from .models import Planos

User = get_user_model()


class PlanosAPITestCase(APITestCase):
    """Testa as funcionalidades da API relacionada aos Planos."""

    def setUp(self):
        """Configura os dados de teste antes de cada execução."""
        self.user = User.objects.create_user(
            email='nikolasferreira@example.com',
            password='1234',
            nome='nikolas chupetinha',
            data_nascimento='2000-01-01'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.plano1 = Planos.objects.create(nome='Plano 1')
        self.plano2 = Planos.objects.create(nome='Plano 2')

        self.proposta1 = Propostas.objects.create(titulo_proposta='Proposta 1', plano=self.plano1)
        self.proposta2 = Propostas.objects.create(titulo_proposta='Proposta 2', plano=self.plano1)

    def test_lista_planos_autenticado(self):
        """Testa a listagem de planos com autenticação."""
        url = reverse('Lista_Planos')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['qtd_planos'], 2)
        self.assertEqual(len(response.data['planos']), 2)

    def test_acessa_plano_existente(self):
        """Testa o acesso a um plano existente."""
        url = reverse('Acessa_Planos', args=[self.plano1.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['planos']['nome'], self.plano1.nome)


    def test_acessa_plano_inexistente(self):
        """Testa o acesso a um plano inexistente."""
        url = reverse('Acessa_Planos', args=[999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_acessa_propostas_plano(self):
        """Testa o acesso às propostas de um plano com propostas."""
        self.client.logout()
        url = reverse('Acessa_Propostas', args=[self.plano1.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_propostas'], 2)
        self.assertEqual(len(response.data['propostas']), 2)

    def test_acessa_propostas_plano_sem_propostas(self):
        """Testa o acesso às propostas de um plano sem propostas."""
        self.client.logout()
        url = reverse('Acessa_Propostas', args=[self.plano2.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_propostas'], 0)
        self.assertEqual(len(response.data['propostas']), 0)

    def test_lista_planos_sem_autenticacao(self):
        """Testa a listagem de planos sem autenticação."""
        self.client.logout()
        url = reverse('Lista_Planos')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
