from django.shortcuts import render
from rest_framework import permissions, generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from .models import Usuario
from .serializers import UsuarioSerializer
# Create your views here.


class ListarUsuario(generics.ListAPIView):
    queryset = Usuario.objects.all().order_by('-id')
    serializer_class = UsuarioSerializer
    
class CadastroView(APIView):
    
    def post(self,request):
        serializer_class = UsuarioSerializer(data=request.data)
        
        if serializer_class.is_valid(): 
            usuario = serializer_class.save()
            refresh = RefreshToken.for_user(usuario)
            
            return Response({
                'message': 'Usuário cadastrado com sucesso!',
                'data': serializer_class.data,
            }, status=status.HTTP_200_OK)
        
        return Response({
            'errors': serializer_class.errors,
            'message': 'Erro ao cadastrar usuário.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
class HomeView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response({
                'message': 'Rota protegida com sucesso!',
                'data': serializer.data
            })



    
    
    
    
    



