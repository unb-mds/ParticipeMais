from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import  viewsets, status, permissions, generics, filters
from .models import *

class ScoreView(APIView):
    """
    View para consultar a pontuação do usuário.
    """
    permission_classes = [permissions.IsAuthenticated]  
    
    def get(self, request):
        print("Usuário autenticado:", request.user)
        print("ID:", request.user.id)
        print("Nome:", request.user.nome)

        score_obj, created = UsuarioScore.objects.get_or_create(usuario=request.user)
        return Response({
            'usuario': request.user.nome,
            'pontos': score_obj.pontos
        })
