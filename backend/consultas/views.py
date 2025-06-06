
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response
from .models import Consultas
from .serializers import ConsultasSerializer

from propostas.models import Propostas
from propostas.serializers import PropostaSerializer

class ListaConsultas(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        consultas = Consultas.objects.all().order_by('id')
        serializer = ConsultasSerializer(consultas, many=True)
        
        return Response({
            'message':'Rota protegida com sucesso!',
            'qtd_Consultas': consultas.count(),
            'Consultas':serializer.data
        })
        
class AcessaConsulta(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, pk):
        try:
            consultas = Consultas.objects.get(pk=pk)
        except Consultas.DoesNotExist:
            return Response({'error':'Não encontramos nenhuma consulta'},status=status.HTTP_404_NOT_FOUND)

        serializer = ConsultasSerializer(consultas)
        return Response({
            'message': 'Consultas encontrados!',
            'data': serializer.data
        })
        
class AcessaPropostasConsultas(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, pk):
        consultas = Consultas.objects.get(pk=pk)
        propostas = Propostas.objects.filter(consulta=consultas)
        serializer = PropostaSerializer(propostas, many=True)
        
        return Response({
            'Consultas': consultas.nome, # manda o título (nome) do plano
            'total_propostas': propostas.count(), #conta quantos tem
            'propostas': serializer.data #dados
        })
