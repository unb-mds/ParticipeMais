"""
Views para autenticação do ParticipeMais.
"""

from django.http import JsonResponse
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions, generics
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Usuario, Notification

from .serializers import (
    UsuarioSerializer,
    LoginSerializer,
    RequestEmailforResetPassword,
    SetNewPasswordSerializer,
    NotificationSerializer,
    PerfilSerializer
)

class ListarUsuario(generics.ListAPIView):
    """
    Lista todos os usuários em ordem decrescente de ID.
    """
    queryset = Usuario.objects.all().order_by('-id')
    serializer_class = UsuarioSerializer

class CadastroView(APIView):
    """
    View para cadastro de usuário.
    """
    def post(self, request):
        """
        Cria um novo usuário e retorna tokens.
        """
        serializer_class = UsuarioSerializer(data=request.data)
        if serializer_class.is_valid():
            usuario = serializer_class.save()
            refresh = RefreshToken.for_user(usuario)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            return Response({
                'message': 'Usuário cadastrado com sucesso!',
                'data': serializer_class.data,
                'access': access_token,
                'refresh': refresh_token
            }, status=status.HTTP_200_OK)
        return Response({
            'errors': serializer_class.errors,
            'message': 'Erro ao cadastrar usuário.'
        }, status=status.HTTP_400_BAD_REQUEST)

class Login(APIView):
    """
    View para login de usuário.
    """
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        """
        Realiza login do usuário e retorna tokens.
        """
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            Notification.objects.filter(usuario=user, titulo="Bem vindo(a)!").delete()
            Notification.objects.create(
                usuario=user,
                titulo="Bem vindo(a)!",
                message=f"Olá {user.nome}, seja bem vindo(a) de volta!",
                is_read=False
            )
            response = Response({
                "message": "Login realizado com sucesso",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "id": user.id,
                    "nome": user.nome,
                    "email": user.email,
                }
            }, status=status.HTTP_200_OK)
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=3600
            )
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Logout(APIView):
    """
    View para logout do usuário.
    """
    def post(self, request):
        """
        Realiza logout e remove cookies de autenticação.
        """
        response = Response({"message": "Logout realizado com sucesso"}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response

class RequestEmail(APIView):
    """
    View para solicitar email de redefinição de senha.
    """
    def post(self, request):
        """
        Gera token de redefinição de senha e exibe no terminal.
        """
        serializer = RequestEmailforResetPassword(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data['email']
            user = Usuario.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            token = PasswordResetTokenGenerator().make_token(user)
            print(
                f"Olá este é o seu token de acesso para recuperar sua senha:\n\n"
                f"Link: http://127.0.0.1:8000/api/forgotpassword/confirmtoken/{uidb64}/{token}"
            )
            return Response({'message': 'Email confirmado. Veja o terminal para acessar o token!'}, status=status.HTTP_200_OK)
        return Response({'message': 'Email inválido.'}, status=status.HTTP_400_BAD_REQUEST)

class CheckToken(APIView):
    """
    View para checar validade do token de redefinição de senha.
    """
    def get(self, uidb64, token):
        """
        Verifica se o token de redefinição é válido.
        """
        try:
            user_id = urlsafe_base64_decode(uidb64).decode()
            user = Usuario.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            return Response({'message': 'Link inválido'}, status=status.HTTP_400_BAD_REQUEST)
        if PasswordResetTokenGenerator().check_token(user, token):
            return Response({'message': 'Token válido. Pode alterar sua senha agora (troque o confirmtoken por setnewpassword)'}, status=status.HTTP_200_OK)
        return Response({'message': 'Token inválido ou expirado'}, status=status.HTTP_400_BAD_REQUEST)

class SetNewPassword(APIView):
    """
    View para redefinir senha do usuário.
    """
    def post(self, request, uidb64, token):
        """
        Redefine a senha do usuário se o token for válido.
        """
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user_id = urlsafe_base64_decode(uidb64).decode()
                user = Usuario.objects.get(pk=user_id)
            except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
                return Response({'message': 'Link inválido'}, status=status.HTTP_400_BAD_REQUEST)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'message': 'Token inválido ou expirado'}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['password'])
            user.save()
            return Response({'message': 'Sua senha foi alterada com sucesso!'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NotificationsView(generics.ListAPIView):
    """
    Lista notificações do usuário autenticado.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retorna notificações do usuário autenticado.
        """
        return Notification.objects.filter(usuario=self.request.user).order_by('-created_at')


class PerfilView(APIView):
    
    """
    View para gerenciar o perfil do usuário autenticado.
    """
    
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """
        Retorna o perfil do usuário autenticado.
        """
        usuario = request.user
        
        perfil = UsuarioSerializer(usuario).data
        
        return Response({
            'perfil': perfil
        }, status=status.HTTP_200_OK)
        
        
    def patch(self, request):
        """
        Atualiza o perfil do usuário autenticado.
        """
        usuario = request.user
        
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Perfil atualizado com sucesso!',
                'perfil': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'errors': serializer.errors,
            'message': 'Erro ao atualizar perfil.'
        }, status=status.HTTP_400_BAD_REQUEST)
        
        
class AlterarSenhaView(APIView):
    """
    View para alterar a senha do usuário autenticado.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """
        Altera a senha do usuário autenticado.
        """
        usuario = request.user
        senha_atual = request.data.get('senha_atual')
        nova_senha = request.data.get('nova_senha')
        
        if not senha_atual or not nova_senha:
            return Response(
                {'message': 'É necessário fornecer a senha atual e a nova senha.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not usuario.check_password(senha_atual):
            return Response(
                {'message': 'Senha atual incorreta.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if senha_atual == nova_senha:
            return Response(
                {'message': 'A nova senha deve ser diferente da atual.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario.set_password(nova_senha)
        usuario.save()
        return Response({'message': 'Senha alterada com sucesso!'}, status=status.HTTP_200_OK)
    