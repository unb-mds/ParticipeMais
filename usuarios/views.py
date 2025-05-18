from django.shortcuts import render
from rest_framework import viewsets, permissions, generics    
from .models import Usuario
from .serializers import UsuarioSerializer

# Create your views here.


class ListarUsuario(generics.ListAPIView):
    
    queryset = Usuario.objects.all().order_by('-id')
    serializer_class = UsuarioSerializer
    
   
class CadastroUsuario(generics.CreateAPIView):
    
    queryset = Usuario.objects.all().order_by('-id')
    serializer_class = UsuarioSerializer
    
    
    
    
    



