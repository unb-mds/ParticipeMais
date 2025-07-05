from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from propostas.models import Propostas
from .models import Planos

User = get_user_model()


class PlanosAPITestCase(APITestCase):
    """Testa as funcionalidades da API relacionadas a Planos."""

    def setUp(self):
        """Prepara os dados necessários para os testes."""
        self.user = User.objects.create_user(
            email='nikolasferreira@example.com',
            password='1234',
            nome='Nikolas Chupetinha',
            data_nascimento='2000-01-01'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.plano1 = Planos.objects.create(
            nome='Plano 1',
            descricao='Descrição do Plano 1',
            qtd_propostas=2
        )
        self.plano2 = Planos.objects.create(
            nome='Plano 2',
            descricao='Descrição do Plano 2',
            qtd_propostas=0
        )

        self.proposta1 = Propostas.objects.create(
            titulo_proposta='Proposta 1',
            plano=self.plano1
        )
        self.proposta2 = Propostas.objects.create(
            titulo_proposta='Proposta 2',
            plano=self.plano1
        )

    def test_lista_planos_autenticado(self):
        """Deve listar todos os planos para usuário autenticado."""
        url = reverse('Lista_Planos')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, "Status code deve ser 200 OK")
        self.assertEqual(response.data['qtd_planos'], 2, "Deve retornar 2 planos")
        self.assertEqual(len(response.data['planos']), 2, "Lista de planos deve conter 2 itens")

    def test_lista_planos_sem_autenticacao(self):
        """Deve retornar 401 para listagem sem autenticação."""
        self.client.logout()
        url = reverse('Lista_Planos')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED, "Deve exigir autenticação")

    def test_acessa_plano_existente(self):
        """Deve acessar um plano existente com sucesso."""
        url = reverse('Acessa_Planos', args=[self.plano1.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, "Status code deve ser 200 OK")
        self.assertEqual(response.data['data']['nome'], self.plano1.nome, "Nome do plano deve corresponder")

    def test_acessa_plano_inexistente(self):
        """Deve retornar 404 ao acessar plano inexistente."""
        url = reverse('Acessa_Planos', args=[9999])  # ID que não existe
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, "Deve retornar 404 para plano não existente")
        self.assertIn('error', response.data, "Deve conter mensagem de erro")

    def test_acessa_propostas_plano_com_propostas(self):
        """Deve listar propostas do plano que possui propostas, acesso sem autenticação."""
        self.client.logout()
        url = reverse('Acessa_Propostas', args=[self.plano1.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, "Status code deve ser 200 OK")
        self.assertEqual(response.data['total_propostas'], 2, "Deve retornar 2 propostas")
        self.assertEqual(len(response.data['propostas']), 2, "Lista de propostas deve conter 2 itens")

    def test_acessa_propostas_plano_sem_propostas(self):
        """Deve listar zero propostas para plano sem propostas, acesso sem autenticação."""
        self.client.logout()
        url = reverse('Acessa_Propostas', args=[self.plano2.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, "Status code deve ser 200 OK")
        self.assertEqual(response.data['total_propostas'], 0, "Deve retornar zero propostas")
        self.assertEqual(len(response.data['propostas']), 0, "Lista de propostas deve estar vazia")
