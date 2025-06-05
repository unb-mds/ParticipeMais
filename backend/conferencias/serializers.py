from rest_framework import serializers
from .models import Conferencia, Etapas, PerguntasParticipativas
from api.serializers import DynamicFieldsModelSerializer
from propostas.serializers import PropostaSerializer

class EtapaSerializer(serializers.ModelSerializer):
    
    propostas = PropostaSerializer(many=True, read_only=True)
    class Meta:
        model = Etapas
        fields = '__all__'

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
        