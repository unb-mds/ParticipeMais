from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response
from .models import PerguntasParticipativas
from propostas.models import Propostas
from .serializers import * 

class ListaConferencias(APIView):
    permission_classes = [permissions.IsAuthenticated] # somente pessoas logadas podem acessar
    
    def get(self, request):
        conferencias = Conferencia.objects.all().order_by('id') # exibe todas as conferencias de ordem crescente ao id
        serializer_class = ConferenciaSerializer(conferencias, many=True) #arruma do formato models para json por meio do serializer
        
        return Response({
                    'message': 'Rota protegida com sucesso!',
                    'data': serializer_class.data #informações passadas do serializer
                }, status=status.HTTP_200_OK)
        
class AcessaConferencia(APIView):
    permission_classes = [permissions.IsAuthenticated] # somente pessoas logadas podem acessar
    
    def get(self, request, pk):
        try:
            conferencia = Conferencia.objects.get(pk=pk) #vai tentar achar a conferencia por meio do id que é dado como primary key 
        except Conferencia.DoesNotExist:
            return Response({'error': 'Conferência não encontrada.'}, status=status.HTTP_404_NOT_FOUND) #se não achar fez o L
        
        # se achar continua aqui, serializa os dados e manda a resposta
        serializer = ConferenciaSerializer(conferencia) 
        return Response({
            'message': 'Conferência encontrada!',
            'data': serializer.data
        })
        
class AcessaPropostas(APIView):
    permission_classes = [permissions.IsAuthenticated] #somente pessoas logadas podem acessar
    
    def get(self, request, pk):
        conferencia = Conferencia.objects.get(pk=pk) #vai tentar achar a conferencia por meio do id que é dado como primary key 
        propostas = Propostas.objects.filter(conferencia=conferencia) # pega as propostas por meio da conferencia como pk
        serializer = PropostaSerializer(propostas, many=True) #serializa os dados das propostas e dale
        
        return Response({
            'conferencia': conferencia.titulo, #manda o título (nome) da conferencia
            'total_propostas': propostas.count(), #conta quantas tem
            'propostas': serializer.data #dados
        })
        
# mesma coisa de propostas so que para perguntas
class AcessaPerguntas(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, pk):
        conferencia = Conferencia.objects.get(pk=pk)
        perguntas = PerguntasParticipativas.objects.filter(conferencia=conferencia)
        serializer = PerguntasSerializer(perguntas, many=True)
        
        return Response({
            'conferencia':conferencia.titulo,
            'total_perguntas':perguntas.count(),
            'perguntas': serializer.data         
        })
        
# mesma coisa de propostas e perguntas so que para etapas (sub conferencias) 
class AcessaEtapas(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, pk):
        conferencia = Conferencia.objects.get(pk=pk)
        etapas = Etapas.objects.filter(conferencia=conferencia)
        serializer = EtapaSerializer(etapas, many=True)
        
        return Response({
            'conferencia':conferencia.titulo,
            'total_etapas':etapas.count(),
            'perguntas': serializer.data         
        })
        