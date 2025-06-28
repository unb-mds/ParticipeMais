from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Conferencia, PerguntasParticipativas, Etapas
from propostas.models import Propostas
from autenticacao.models import Usuario

class ConferenciaAPITests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.usuario = Usuario.objects.create_user(
            nome='Usuario Teste',
            email='usuario@teste.com',
            password='senha123',
            data_nascimento='1990-01-01'
        )
        cls.conferencia = Conferencia.objects.create(
            titulo="Conferencia Teste",
            descricao="Descricao da conferencia teste"
        )
        cls.etapa = Etapas.objects.create(
            titulo_etapa="Etapa Teste",
            descricao_etapa="Descricao da etapa",
            status="Ativa",
            conferencia=cls.conferencia
        )
        cls.proposta = Propostas.objects.create(
            conferencia=cls.conferencia,
            titulo_proposta="Proposta Teste eixo 1",
            # preencha demais campos necessários no modelo Propostas
        )
        cls.pergunta = PerguntasParticipativas.objects.create(
            conferencia=cls.conferencia,
            perguntas="Pergunta teste?",
            respostas="Resposta teste."
        )

    def test_listar_conferencias_requer_autenticacao(self):
        url = reverse('conferencias:listar_conferencias')
        # sem autenticação
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # com autenticação
        self.client.force_authenticate(user=self.usuario)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        self.assertIsInstance(response.data['data'], list)

    def test_acessar_conferencia_existe(self):
        url = reverse('conferencias:conferencia', kwargs={'pk': self.conferencia.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Conferência encontrada!')
        self.assertEqual(response.data['data']['conferencias']['titulo'], self.conferencia.titulo)

    def test_acessar_conferencia_nao_existe(self):
        url = reverse('conferencias:conferencia', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_acessar_propostas_e_eixos(self):
        url = reverse('conferencias:propostas', kwargs={'pk': self.conferencia.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['conferencia'], self.conferencia.titulo)
        self.assertIn('eixos', response.data)
        self.assertIn('propostas', response.data)
        self.assertEqual(response.data['total_propostas'], 1)

    def test_acessar_perguntas(self):
        url = reverse('conferencias:perguntas', kwargs={'pk': self.conferencia.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['conferencia'], self.conferencia.titulo)
        self.assertEqual(response.data['total_perguntas'], 1)
        self.assertIsInstance(response.data['perguntas'], list)

    def test_acessar_etapas(self):
        url = reverse('conferencias:etapas', kwargs={'pk': self.conferencia.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['conferencia'], self.conferencia.titulo)
        self.assertEqual(response.data['total_etapas'], 1)
        self.assertIsInstance(response.data['sub-conferencias'], list)

    def test_proposta_direta(self):
        url = reverse('conferencias:essa_proposta', kwargs={'pk': self.conferencia.pk, 'jk': self.proposta.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['conferencia'], self.conferencia.titulo)
        self.assertIsInstance(response.data['proposta'], list)
        self.assertEqual(len(response.data['proposta']), 1)

    def test_etapa_direta(self):
        url = reverse('conferencias:essa_etapa', kwargs={'pk': self.conferencia.pk, 'jk': self.etapa.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['conferencia'], self.conferencia.titulo)
        self.assertIsInstance(response.data['sub-conferencias'], list)
        self.assertEqual(len(response.data['sub-conferencias']), 1)
