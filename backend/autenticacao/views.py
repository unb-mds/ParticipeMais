from django.shortcuts import render
from django.utils.http import urlsafe_base64_decode
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Usuario, UsuarioManager, Perfil, Notification
from .serializers import * 


class ListarUsuario(generics.ListAPIView):
    queryset = Usuario.objects.all().order_by('-id') #pega todos os objetos do models em ordem decrescente
    serializer_class = UsuarioSerializer #serializa esses dados em formato JSON
    
class CadastroView(APIView):
    
    def post(self,request):
        serializer_class = UsuarioSerializer(data=request.data)
        # Acessou a data pelo Serializer
        
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
    permission_classes = []  # sem autenticação aqui
    authentication_classes = []
    
    
    def post(self,request):        
        
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            #apaga a notificação de boas vindas antiga
            Notification.objects.filter(usuario=user, titulo="Bem vindo(a)!").delete()
            
            #gera nova notificação de boas vindas
            Notification.objects.create(
                usuario = user,
                titulo = "Bem vindo(a)!",
                message = f"Olá {user.nome}, seja bem vindo(a) de volta!",
                is_read = False
            )
            
            # resposta padrão
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
            
            # gerar o cookie
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,          # True para produção com HTTPS
                samesite='Lax',        # ou 'Strict' ou 'None'
                max_age=3600)          # duração do cookie 1h
            
            return response

        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)         
            
            
class Logout(APIView):
    def post(self, request):
        
            response = Response({"message":"Logout realizado com sucesso"}, status=status.HTTP_200_OK)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response
            
            
            
class RequestEmail(APIView):

    def post(self,request):
        serializer = RequestEmailforResetPassword(data=request.data)
        
        if serializer.is_valid(raise_exception=True): #faz verificação dnv
            email = serializer.validated_data['email']
            user = Usuario.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk)) # converte user.pk e deixa seguro para url
            token = PasswordResetTokenGenerator().make_token(user) #gera o token
                
            print(f"Olá este é o seu token de acesso para recuperar sua senha:\n\nLink: http://127.0.0.1:8000/api/forgotpassword/confirmtoken/{uidb64}/{token}") 
            #como nn tem como mandar pro email vai no terminal 

            return Response({'message':'Email confirmado. Veja o terminal para acessar o token!'}, status=status.HTTP_200_OK)
        return Response({'message':'Email inválido.'}, status=status.HTTP_400_BAD_REQUEST)
    
class CheckToken(APIView):
    def get(self,request, uidb64, token):
        try:
            user_id = urlsafe_base64_decode(uidb64).decode()
            user = Usuario.objects.get(pk=user_id)

        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            return Response({'message': 'Link inválido'}, status=status.HTTP_400_BAD_REQUEST)

        if PasswordResetTokenGenerator().check_token(user, token): #vai verificar se o token é atual e se o uidb64 é o correspondente do homi (usuário)
            return Response({'message': f'Token válido. Pode alterar sua senha agora (troque o confirmtoken por setnewpassword)'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Token inválido ou expirado'}, status=status.HTTP_400_BAD_REQUEST)

class SetNewPassword(APIView):

    def post(self,request, uidb64, token):
        serializer = SetNewPasswordSerializer(data = request.data)
        if serializer.is_valid():

            try:
                user_id = urlsafe_base64_decode(uidb64).decode()
                user = Usuario.objects.get(pk=user_id)

            except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
                    return Response({'message': 'Link inválido'}, status=status.HTTP_400_BAD_REQUEST)
            
            if not PasswordResetTokenGenerator().check_token(user,token):
                return Response({'message': 'Token inválido ou expirado'}, status=status.HTTP_400_BAD_REQUEST) 
            
            user.set_password(serializer.validated_data['password'])
            user.save()

            return Response({'message':'Sua senha foi alterada com sucesso!'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NotificationsView(generics.ListAPIView):
    
    serializer_class = NotificationSerializer #pega do serializador os trem de notificacoes
    permission_classes = [permissions.AllowAny] #so acessa se estiver logado
    
    def get_queryset(self):
        return Notification.objects.filter(usuario=self.request.user).order_by('-created_at')
