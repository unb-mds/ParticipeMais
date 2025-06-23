from rest_framework import serializers
from .models import Alternativa, PerguntaSimNao, PerguntaMultipla, Pergunta, Resposta
from conferencias.models import Agenda


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    Um ModelSerializer que aceita um argumento 'fields' para limitar os campos.
    """
    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)  # Pega os campos desejados
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Remove os campos que não estão na lista
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)
                
class AlternativaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Alternativa
        fields = ['conteudo']
        
        
class PerguntaSimplesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PerguntaSimNao
        fields = []
        
        
class PerguntaMultiplaSerializer(serializers.ModelSerializer):
    
    
    alternativas = AlternativaSerializer(many =True, read_only=True)
    
    class Meta:
        model = PerguntaMultipla
        field = ['alternativas']
        
        
class PerguntaSerializer(serializers.ModelSerializer):
    
    simples = PerguntaSimplesSerializer(read_only=True)
    multipla = PerguntaMultiplaSerializer(read_only = True)
    
    class Meta:
        model = Pergunta
        fields = ['id', 'pergunta', 'categoria', 'tipo', 'simples', 'multipla' ]


class RespostaSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Resposta
        fields = ['pergunta', 'resposta_simples', 'resposta_multipla']

    def create(self, validated_data):
        usuario = self.context['usuario']
        return Resposta.objects.create(usuario=usuario, **validated_data)
        
class AgendaSerializer(serializers.ModelSerializer):
    conferencia_nome = serializers.CharField(source='conferencia.titulo', read_only=True)
    conferencia_data = serializers.CharField(source='conferencia.data_subconferencia', read_only=True)
    
    etapa_nome = serializers.CharField(source='etapas.titulo', read_only=True)
    etapa_data = serializers.CharField(source='etapas.duracao_etapa', read_only=True)
    class Meta:
        model = Agenda
        fields = [
            'id',
            'usuario',
            'agendado',
            'conferencia_nome',
            'conferencia_data',
            'etapa_nome',
            'etapa_data',
        ]