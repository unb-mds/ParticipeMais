from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Usuario
from rest_framework.test import APIClient


class AutenticacaoTests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.cadastro_url = reverse('cadastro')
        self.login_url = reverse('login')
        self.perfil_url = reverse('perfil')
        self.alterar_senha_url = reverse('alterar_senha')

        # Cria um usuário para testes de login e perfil
        self.usuario = Usuario.objects.create_user(
            nome='Teste User',
            email='teste@email.com',
            password='senha1234',
            data_nascimento='1990-01-01'
        )

    def test_cadastro_usuario_sucesso(self):
        dados = {
            "nome": "Novo Usuario",
            "email": "novo@email.com",
            "password": "senhaSegura123",
            "data_nascimento": "2000-02-02"
        }
        response = self.client.post(self.cadastro_url, dados)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['data']['email'], dados['email'])

    def test_login_usuario_sucesso(self):
        dados = {
            "email": self.usuario.email,
            "password": "senha1234"
        }
        response = self.client.post(self.login_url, dados)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['email'], self.usuario.email)

    def test_login_usuario_senha_incorreta(self):
        dados = {
            "email": self.usuario.email,
            "password": "senhaErrada"
        }
        response = self.client.post(self.login_url, dados)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Senha incorreta', str(response.data))

    def test_perfil_requer_autenticacao(self):
        response = self.client.get(self.perfil_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_perfil_retorna_dados_usuario(self):
        self.client.force_authenticate(user=self.usuario)
        response = self.client.get(self.perfil_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['perfil']['email'], self.usuario.email)

    def test_atualiza_perfil_sucesso(self):
        self.client.force_authenticate(user=self.usuario)
        novos_dados = {
            "nome": "Nome Atualizado"
        }
        response = self.client.patch(self.perfil_url, novos_dados)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['perfil']['nome'], novos_dados['nome'])

    def test_alterar_senha_sucesso(self):
        self.client.force_authenticate(user=self.usuario)
        dados = {
            "senha_atual": "senha1234",
            "nova_senha": "novaSenha123"
        }
        response = self.client.post(self.alterar_senha_url, dados)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Senha alterada com sucesso', response.data['message'])

    def test_alterar_senha_senha_atual_errada(self):
        self.client.force_authenticate(user=self.usuario)
        dados = {
            "senha_atual": "senhaErrada",
            "nova_senha": "novaSenha123"
        }
        response = self.client.post(self.alterar_senha_url, dados)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Senha atual incorreta', response.data['message'])

    def test_alterar_senha_nova_igual_atual(self):
        self.client.force_authenticate(user=self.usuario)
        dados = {
            "senha_atual": "senha1234",
            "nova_senha": "senha1234"
        }
        response = self.client.post(self.alterar_senha_url, dados)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('A nova senha deve ser diferente da atual', response.data['message'])
