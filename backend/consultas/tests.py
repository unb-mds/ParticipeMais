from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from django.contrib.auth.models import User
from .models import Consultas
from propostas.models import Propostas

User = get_user_model()
class ConsultasAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email='lena@example.com',
            password='lena123',
            nome='Lena',
            data_nascimento='2000-01-01'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.consulta1 = Consultas.objects.create(nome='Consulta 1')
        self.consulta2 = Consultas.objects.create(nome='Consulta 2')

        self.proposta1 = Propostas.objects.create(titulo_proposta='Proposta 1', consulta=self.consulta1)
        self.proposta2 = Propostas.objects.create(titulo_proposta='Proposta 2', consulta=self.consulta1)

    def test_lista_consultas_autenticado(self):
        url = reverse('Lista_consulta')  # nome da URL para listar consultas
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['qtd_Consultas'], 2)
        self.assertEqual(len(response.data['Consultas']), 2)

    def test_acessa_consulta_existente(self):
        url = reverse('Acessa_consulta', args=[self.consulta1.pk])
        self.client.force_authenticate(user=self.user)  # autenticando o usuário
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['consultas']['nome'], self.consulta1.nome)



    def test_acessa_consulta_inexistente(self):
        url = reverse('Acessa_consulta', args=[999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_acessa_propostas_consulta(self):
        # Essa view tem AllowAny, não precisa autenticar
        self.client.logout()
        url = reverse('Acessa_propostas_consulta', args=[self.consulta1.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_propostas'], 2)
        self.assertEqual(len(response.data['propostas']), 2)

    def test_acessa_propostas_consulta_sem_propostas(self):
        self.client.logout()
        url = reverse('Acessa_propostas_consulta', args=[self.consulta2.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_propostas'], 0)
        self.assertEqual(len(response.data['propostas']), 0)

    def test_lista_consultas_sem_autenticacao(self):
        self.client.logout()
        url = reverse('Lista_consulta')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)