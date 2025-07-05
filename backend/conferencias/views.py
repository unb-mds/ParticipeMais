from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response
from .models import PerguntasParticipativas
from propostas.models import Propostas
from .serializers import *
from collections import Counter     
import re
from autenticacao.models import Usuario  
from .models import Conferencia      

# Lista todas as conferências cadastradas
class ListaConferencias(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Permite acesso público

    def get(self, request):
        conferencias = Conferencia.objects.all().order_by('id')  # Busca todas as conferências ordenadas por ID
        serializer_class = ConferenciaSerializer(conferencias, many=True)  # Serializa os dados

        return Response({
            'message': 'Rota protegida com sucesso!',
            'data': serializer_class.data  # Retorna as conferências em formato JSON
        }, status=status.HTTP_200_OK)

# Acessa os detalhes de uma conferência específica por ID
class AcessaConferencia(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            conferencia = Conferencia.objects.get(pk=pk)
        except Conferencia.DoesNotExist:
            return Response({'error': 'Conferência não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        conferencia_serializer = ConferenciaSerializer(conferencia, context={'request': request})

        # Supondo que você tem relacionamentos ou filtros para propostas e etapas
        propostas = Propostas.objects.filter(conferencia_id=pk)
        print(propostas.count())
        propostas_serializer = PropostaSerializer(propostas, many=True, context={'request': request} )

        etapas = Etapas.objects.filter(conferencia=conferencia)
        etapas_serializer = EtapaSerializer(etapas, many=True, context={'request': request})
        favoritado = conferencia in request.user.conferencias.all()

        return Response({
            'message': 'Conferência encontrada!',
            'data': {
                'conferencias': conferencia_serializer.data,
                'propostas': propostas_serializer.data,
                'etapas': etapas_serializer.data,
            }
        })


# Lista propostas de uma conferência específica + percentual por eixo (extraído do título)
class AcessaPropostas(APIView):
    permission_classes = [permissions.AllowAny]  # Permite acesso público

    def get(self, request, pk):
        conferencia = Conferencia.objects.get(pk=pk)  # Busca conferência pelo ID
        propostas = Propostas.objects.filter(conferencia=conferencia) # Limita a 1000 propostas para testes
        serializer = PropostaSerializer(propostas, many=True)  # Serializa as propostas

        total = propostas.count()
        eixo_counter = Counter()  # Contador para eixos encontrados

        # Conta a ocorrência de eixos com base no título das propostas
        for proposta in propostas:
            texto = proposta.titulo_proposta.lower()  # Transforma em minúsculas para evitar erros de maiúsculas
            match = re.search(r"eixo\s*([1-6])", texto)  # Procura por "eixo 1" até "eixo 6"
            if match:
                eixo = match.group(1)
                eixo_counter[eixo] += 1
            else:
                eixo_counter["Não informado"] += 1  # Propostas sem eixo explícito

        # Calcula os percentuais por eixo
        percentuais_eixos = {
            f"Eixo {eixo}": round((qtd / total) * 100, 2) if total else 0
            for eixo, qtd in eixo_counter.items()
        }

        return Response({
            'conferencia': conferencia.titulo,
            'total_propostas': total,
            'eixos': percentuais_eixos,  # Mostra o percentual por eixo
            'propostas': serializer.data  # Lista as propostas
        })
            
# Acessa uma proposta específica dentro de uma conferência
class PropostaDireta(APIView):
    permission_classes = [permissions.AllowAny]  # Permite acesso público

    def get(self, request, pk, jk):
        conferencia = Conferencia.objects.get(pk=pk)  # Conferência do contexto
        proposta = Propostas.objects.filter(pk=jk, conferencia=conferencia)  # Busca proposta específica dentro da conferência
        serializer = PropostaSerializer(proposta, many=True)  # Serializa a proposta

        return Response({
            'conferencia': conferencia.titulo,
            'proposta': serializer.data
        })

# Lista todas as perguntas participativas de uma conferência
class AcessaPerguntas(APIView):
    permission_classes = [permissions.AllowAny]  # Permite acesso público

    def get(self, request, pk):
        conferencia = Conferencia.objects.get(pk=pk)
        perguntas = PerguntasParticipativas.objects.filter(conferencia=conferencia)  # Busca perguntas ligadas à conferência
        serializer = PerguntasSerializer(perguntas, many=True)  # Serializa as perguntas

        return Response({
            'conferencia': conferencia.titulo,
            'total_perguntas': perguntas.count(),
            'perguntas': serializer.data
        })

# Lista todas as etapas (subconferências) de uma conferência
class AcessaEtapas(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Permite acesso público

    def get(self, request, pk):
        conferencia = Conferencia.objects.get(pk=pk)
        etapas = Etapas.objects.filter(conferencia=conferencia)  # Busca etapas da conferência
        serializer = EtapaSerializer(etapas, many=True)

        return Response({
            'conferencia': conferencia.titulo,
            'total_etapas': etapas.count(),
            'sub-conferencias': serializer.data
        })

# Acessa uma etapa (subconferência) específica dentro de uma conferência
class EtapaDireta(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Permite acesso público

    def get(self, request, pk, jk):
        conferencia = Conferencia.objects.get(pk=pk)
        etapas = Etapas.objects.filter(pk=jk, conferencia=conferencia)  # Busca etapa específica pela pk
        
        propostas = Propostas.objects.filter(url_proposta__in=etapas.propostas_relacionadas)
        propostasSerializer = PropostaSerializer(propostas, many=True)
        serializer = EtapaSerializer(etapas, many=True)

        return Response({
            'conferencia': conferencia.titulo,
            'sub-conferencias': serializer.data,
            'propostas_relacionadas': propostasSerializer.data
        })


class ToggleConferenciaView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, conferencia_id):
        try:
            conferencia = Conferencia.objects.get(id=conferencia_id)
        except Conferencia.DoesNotExist:
            return Response({'message': 'Conferência não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user

        if conferencia in user.conferencias.all():
            user.conferencias.remove(conferencia)
            return Response({'message': 'Conferência removida dos favoritos.'})
        else:
            user.conferencias.add(conferencia)
            return Response({'message': 'Conferência adicionada aos favoritos.'})