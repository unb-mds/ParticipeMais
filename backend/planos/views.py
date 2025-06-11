from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response

from .models import Planos
from .serializers import PlanosSerializer

from propostas.models import Propostas
from propostas.serializers import PropostaSerializer

# Rota para listar todos os planos existentes
class ListaPlanos(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Somente usuários autenticados podem acessar

    def get(self, request):
        planos = Planos.objects.all().order_by('id')  # Ordena os planos por ID (do menor para o maior)
        serializer = PlanosSerializer(planos, many=True)  # Serializa os dados (converte para JSON)
        
        return Response({
            'message': 'Rota protegida com sucesso!',
            'qtd_planos': planos.count(),  # Total de planos encontrados
            'planos': serializer.data  # Lista de planos serializada
        })

# Rota para acessar os dados de um plano específico
class AcessaPlano(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Somente usuários autenticados podem acessar

    def get(self, request, pk):
        try:
            planos = Planos.objects.get(pk=pk)  # Tenta buscar o plano pelo ID
        except Planos.DoesNotExist:
            return Response({'error': 'Não existem planos para você ;-;'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PlanosSerializer(planos)  # Serializa o plano encontrado
        return Response({
            'message': 'Planos encontrados!',
            'data': serializer.data  # Dados serializados do plano
        })

# Rota para acessar as propostas associadas a um plano específico
class AcessaPropostasPlanos(APIView):
    permission_classes = [permissions.AllowAny]  # Acesso público permitido

    def get(self, request, pk):
        planos = Planos.objects.get(pk=pk)  # Busca o plano pelo ID
        propostas = Propostas.objects.filter(plano=planos)  # Filtra as propostas associadas ao plano
        serializer = PropostaSerializer(propostas, many=True)  # Serializa a lista de propostas
        
        return Response({
            'planos': planos.nome,  # Nome do plano
            'total_propostas': propostas.count(),  # Quantidade de propostas encontradas
            'propostas': serializer.data  # Lista de propostas serializada
        })

# Rota para acessar uma proposta específica dentro de um plano
class PropostaDiretaP(APIView):
    permission_classes = [permissions.AllowAny]  # Acesso público permitido

    def get(self, request, pk, jk):
        planos = Planos.objects.get(pk=pk)  # Busca o plano pelo ID
        propostas = Propostas.objects.filter(pk=jk, plano=planos)  # Filtra a proposta pelo ID e plano correspondente
        serializer = PropostaSerializer(propostas, many=True)  # Serializa a proposta encontrada (mesmo sendo só uma, mantém many=True)

        return Response({
            'planos': planos.nome,  # Nome do plano
            'proposta': serializer.data  # Dados da proposta serializada
        })
