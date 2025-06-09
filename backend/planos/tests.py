from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from django.contrib.auth.models import User
from .models import Planos
from propostas.models import Propostas


User = get_user_model()

class PlanosAPITestCase(APITestCase):

    def setUp(self):
        # Cria usuário e autentica
        self.user = User.objects.create_user(
            email='nikolasferreira@example.com',
            password='1234',
            nome='nikolas chupetinha',
            data_nascimento='2000-01-01'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Cria alguns planos
        self.plano1 = Planos.objects.create(nome='Plano 1')
        self.plano2 = Planos.objects.create(nome='Plano 2')

        # Cria propostas ligadas ao plano1
        self.proposta1 = Propostas.objects.create(titulo_proposta='Proposta 1', plano=self.plano1)
        self.proposta2 = Propostas.objects.create(titulo_proposta='Proposta 2', plano=self.plano1)

    def test_lista_planos_autenticado(self):
        url = reverse('Lista_Planos')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['qtd_planos'], 2)
        self.assertEqual(len(response.data['planos']), 2)

    def test_acessa_plano_existente(self):
        url = reverse('Acessa_Planos', args=[self.plano1.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['nome'], self.plano1.nome)

    def test_acessa_plano_inexistente(self):
        url = reverse('Acessa_Planos', args=[999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_acessa_propostas_plano(self):
        # Essa view permite acesso aberto (AllowAny)
        self.client.logout()
        url = reverse('Acessa_Propostas', args=[self.plano1.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_propostas'], 2)
        self.assertEqual(len(response.data['propostas']), 2)

    def test_acessa_propostas_plano_sem_propostas(self):
        self.client.logout()
        url = reverse('Acessa_Propostas', args=[self.plano2.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_propostas'], 0)
        self.assertEqual(len(response.data['propostas']), 0)

    def test_lista_planos_sem_autenticacao(self):
        self.client.logout()
        url = reverse('Lista_Planos')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
