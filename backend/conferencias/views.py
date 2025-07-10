from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination

from .models import PerguntasParticipativas
from propostas.models import Propostas
from .serializers import *
from collections import Counter     
import random
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

        etapas = Etapas.objects.filter(conferencia=conferencia)
        etapas_serializer = EtapaSerializer(etapas, many=True, context={'request': request})

        favoritado = conferencia in request.user.conferencias.all()

        estatisticasEtapas = etapas.count()

        return Response({
            'message': 'Conferência encontrada!',
            'data': {
                'conferencias': conferencia_serializer.data,
                'etapas': etapas_serializer.data,
                'favoritado': favoritado,
                'estatisticasEtapas': estatisticasEtapas  # renomeei para manter igual ao frontend
            }
        })



# Lista propostas de uma conferência específica + percentual por eixo (extraído do título)
class AcessaPropostas(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Permite acesso público
    pagination_class = LimitOffsetPagination

    def get(self, request, pk):
        conferencia = Conferencia.objects.get(pk=pk)  # Busca conferência pelo ID
        propostas = list(Propostas.objects.filter(conferencia_id=pk))  # Converte para lista para embaralhar
        total = len(propostas)

        # Conta a ocorrência de eixos com base no título das propostas
        eixo_counter = Counter()
        for proposta in propostas:
            texto = proposta.titulo_proposta.lower()
            match = re.search(r"eixo\s*([1-6])", texto)
            if match:
                eixo = match.group(1)
                eixo_counter[eixo] += 1
            else:
                eixo_counter["Não informado"] += 1

        percentuais_eixos = {
            f"Eixo {eixo}": round((qtd / total) * 100, 2) if total else 0
            for eixo, qtd in eixo_counter.items()
        }

        CORES_EIXOS = {
            "Eixo 1": "#2670E8",
            "Eixo 2": "#4CAF50",
            "Eixo 3": "#FFC107",
            "Eixo 4": "#000000",
            "Eixo 5": "#9C27B0",
            "Eixo 6": "#00BCD4",
            "Não informado": "#9E9E9E",
        }

        estatisticas = [
            {
                "eixo": eixo,
                "percentual": percentual,
                "cor": CORES_EIXOS.get(eixo, "#000000"),
            }
            for eixo, percentual in percentuais_eixos.items()
        ]

        # Embaralha e seleciona até 200 propostas
        random.shuffle(propostas)
        propostas_sample = propostas[:200]
        propostas_serializer = PropostaSerializer(propostas_sample, many=True, context={'request': request})

        # ratagem do caralho, vamo pegar o total e enviar, depois vamo pegar 200 propostas e mandar pro frontend
        # que o cara vai pensar q é tudo, mas é só a amostra, e quando ele acessar por etapa a gnt manda so as q tem a ver

        return Response({
            'conferencia': conferencia.titulo,
            'total_propostas': total,
            'estatisticas': estatisticas,
            'propostas': propostas_serializer.data
        })
            
# Acessa uma proposta específica dentro de uma conferência
class PropostaDireta(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Permite acesso público

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
    permission_classes = [permissions.IsAuthenticated]  # Permite acesso público

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


class ConferenciasFavoritasView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        favoritos = user.conferencias.values_list('id', flat=True)
        print(favoritos)
        return Response({'favoritos': list(favoritos)})