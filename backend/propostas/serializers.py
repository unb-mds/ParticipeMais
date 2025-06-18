from rest_framework import serializers
from .models import Propostas
from api.serializers import DynamicFieldsModelSerializer

class PropostaSerializer(DynamicFieldsModelSerializer):
    palavras_chave = serializers.SerializerMethodField()
    autor_resumido = serializers.SerializerMethodField()
    titulo_resumido = serializers.SerializerMethodField()
    descricao_resumida = serializers.SerializerMethodField()
    favoritada = serializers.SerializerMethodField()

    class Meta:
        model = Propostas
        fields = '__all__'  # ou liste os campos + os resumidos manualmente

    def get_palavras_chave(self, obj):
        return list(obj.palavras_chave.values_list('palavras', flat=True)) if hasattr(obj, 'palavras_chave') else []

    def get_autor_resumido(self, obj):
        return obj.autor[:10] if obj.autor else ''  # por exemplo, primeiros 10 caracteres

    def get_titulo_resumido(self, obj):
        return obj.titulo_proposta[:50] + '...' if obj.titulo_proposta and len(obj.titulo_proposta) > 50 else obj.titulo_proposta

    def get_descricao_resumida(self, obj):
        return obj.descricao_proposta[:100] + '...' if obj.descricao_proposta and len(obj.descricao_proposta) > 100 else obj.descricao_proposta  
    
    def get_favoritada(self, obj):
        request = self.context.get('request')
        usuario = request.user
        return usuario.favoritos.filter(id=usuario.id).exists()
