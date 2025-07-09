from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from .models import Conferencia, Etapas, PerguntasParticipativas
from propostas.models import Propostas


User = get_user_model()
class ConferenciaAPITests(APITestCase):
    
    def setUp(self):
        # Cria um usuário para autenticação
        self.user = User.objects.create_user(
            email='katia@example.com',
            password='1234',
            nome='katia',
            data_nascimento='2000-01-01'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Cria uma conferência
        self.conferencia = Conferencia.objects.create(titulo='Conferencia Teste')

        # Cria etapas associadas
        self.etapa1 = Etapas.objects.create(titulo_etapa='Etapa 1', conferencia=self.conferencia)
        self.etapa2 = Etapas.objects.create(titulo_etapa='Etapa 2', conferencia=self.conferencia)

        # Cria propostas associadas
        self.proposta1 = Propostas.objects.create(titulo_proposta='Proposta 1', conferencia=self.conferencia)
        self.proposta2 = Propostas.objects.create(titulo_proposta='Proposta 2', conferencia=self.conferencia)

        # Cria perguntas associadas
        self.pergunta1 = PerguntasParticipativas.objects.create(perguntas='Pergunta 1', conferencia=self.conferencia)
        self.pergunta2 = PerguntasParticipativas.objects.create(perguntas='Pergunta 2', conferencia=self.conferencia)

    def test_lista_conferencias_autenticado(self):
        url = reverse('listar_conferencias')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        self.assertGreaterEqual(len(response.data['data']), 1)

    def test_lista_conferencias_nao_autenticado(self):
        self.client.logout()
        url = reverse('listar_conferencias')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_acessa_conferencia_valida(self):
        url = reverse('conferencia', args=[self.conferencia.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['id'], self.conferencia.id)

    def test_acessa_conferencia_invalida(self):
        url = reverse('conferencia', args=[9999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_acessa_propostas(self):
        url = reverse('propostas', args=[self.conferencia.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['conferencia'], self.conferencia.titulo)
        self.assertEqual(response.data['total_propostas'], 2)
        self.assertEqual(len(response.data['propostas']), 2)

    def test_acessa_perguntas(self):
        url = reverse('perguntas', args=[self.conferencia.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['conferencia'], self.conferencia.titulo)
        self.assertEqual(response.data['total_perguntas'], 2)
        self.assertEqual(len(response.data['perguntas']), 2)

    def test_acessa_etapas(self):
        url = reverse('etapas', args=[self.conferencia.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['conferencia'], self.conferencia.titulo)
        self.assertEqual(response.data['total_etapas'], 2)
        # Aqui no seu código a chave está como 'perguntas' para os dados das etapas, é isso mesmo?
        self.assertEqual(len(response.data['perguntas']), 2)
