from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response

from .models import Consultas
from .serializers import ConsultasSerializer

from propostas.models import Propostas
from propostas.serializers import PropostaSerializer

# Rota protegida para listar todas as consultas existentes
class ListaConsultas(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Apenas usuários autenticados podem acessar
    
    def get(self, request):
        consultas = Consultas.objects.all().order_by('id')  # Ordena todas as consultas por ID
        serializer = ConsultasSerializer(consultas, many=True)  # Serializa os dados em JSON
        
        return Response({
            'message': 'Rota protegida com sucesso!',
            'qtd_Consultas': consultas.count(),  # Total de consultas encontradas
            'Consultas': serializer.data  # Lista de consultas serializada
        })

# Rota protegida para acessar os dados de uma consulta específica
class AcessaConsulta(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Apenas usuários autenticados podem acessar

    def get(self, request, pk):
        try:
            consultas = Consultas.objects.get(pk=pk)  # Busca a consulta pelo ID
        except Consultas.DoesNotExist:
            return Response({'error': 'Não encontramos nenhuma consulta'}, status=status.HTTP_404_NOT_FOUND)

        consultasSerializer = ConsultasSerializer(consultas)  # Serializa a consulta encontrada

        propostas = Propostas.objects.filter(consulta_id=pk)  # Filtra as propostas relacionadas à consulta
        propostasSerializer = PropostaSerializer(propostas, many=True)  # Serializa as propostas encontradas

        data = {
            'consultas': consultasSerializer.data,  # Dados da consulta
            'propostas': propostasSerializer.data,  # Dados das propostas
        }

        return Response({
            'message': 'Consulta encontrada!',
            'data': data  # Dados da consulta
        })

# Rota pública para acessar todas as propostas associadas a uma consulta específica
class AcessaPropostasConsultas(APIView):
    permission_classes = [permissions.AllowAny]  # Acesso público

    def get(self, request, pk):
        consultas = Consultas.objects.get(pk=pk)  # Busca a consulta pelo ID
        propostas = Propostas.objects.filter(consulta=consultas)  # Filtra as propostas relacionadas à consulta
        serializer = PropostaSerializer(propostas, many=True)  # Serializa as propostas encontradas
        
        return Response({
            'Consultas': consultas.nome,  # Nome da consulta
            'total_propostas': propostas.count(),  # Quantidade de propostas
            'propostas': serializer.data  # Lista de propostas serializada
        })

# Rota pública para acessar uma proposta específica vinculada a uma consulta
class PropostaDiretaC(APIView):
    permission_classes = [permissions.AllowAny]  # Acesso público

    def get(self, request, pk, jk):
        consultas = Consultas.objects.get(pk=pk)  # Busca a consulta pelo ID
        propostas = Propostas.objects.filter(pk=jk, consulta=consultas)  # Busca a proposta específica dentro da consulta
        serializer = PropostaSerializer(propostas, many=True)  # Serializa a proposta (mesmo se única)
        
        return Response({
            'Consultas': consultas.nome,  # Nome da consulta
            'proposta': serializer.data  # Dados da proposta
        })
