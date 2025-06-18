from rest_framework import serializers
from .models import Conferencia, Etapas, PerguntasParticipativas
from api.serializers import DynamicFieldsModelSerializer
from propostas.serializers import PropostaSerializer

class EtapaSerializer(serializers.ModelSerializer):
    propostas = PropostaSerializer(many=True, read_only=True)
    descricao_etapa = serializers.SerializerMethodField()  # <--- nome do campo customizado

    class Meta:
        model = Etapas
        fields = '__all__'  # ou liste os campos, inclusive 'descricao_resumida'

    def get_descricao_etapa(self, obj):  # <--- mesmo nome do campo acima
        if obj.descricao_etapa:
            return obj.descricao_etapa[:100] + '...' if len(obj.descricao_etapa) > 100 else obj.descricao_etapa
        return ''

class PerguntasSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerguntasParticipativas
        fields = '__all__'
        
class ConferenciaSerializer(DynamicFieldsModelSerializer):
    propostas = PropostaSerializer(many=True, read_only=True)
    etapas = EtapaSerializer(many=True, read_only=True)
    perguntas = PerguntasSerializer(many=True, read_only=True)
    class Meta:
        model = Conferencia
        fields = '__all__'
        