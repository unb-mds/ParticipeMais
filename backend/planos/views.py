from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response
from .models import Planos
from .serializers import PlanosSerializer

from propostas.models import Propostas
from propostas.serializers import PropostaSerializer

class ListaPlanos(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        planos = Planos.objects.all().order_by('id')
        serializer = PlanosSerializer(planos, many=True)
        
        return Response({
            'message':'Rota protegida com sucesso!',
            'qtd_planos': planos.count(),
            'planos':serializer.data,
        })
        
class AcessaPlano(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, pk):
        try:
            planos = Planos.objects.get(pk=pk)
        except Planos.DoesNotExist:
            return Response({'error':'Não existem planos para vc ;-;'},status=status.HTTP_404_NOT_FOUND)

        serializer = PlanosSerializer(planos)
        return Response({
            'message': 'Planos encontrados!',
            'data': serializer.data
        })
        
class AcessaPropostasPlanos(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, pk):
        planos = Planos.objects.get(pk=pk)
        propostas = Propostas.objects.filter(plano=planos)
        serializer = PropostaSerializer(propostas, many=True)
        
        return Response({
            'planos': planos.nome, # manda o título (nome) do plano
            'total_propostas': propostas.count(), #conta quantos tem
            'propostas': serializer.data #dados
        })
