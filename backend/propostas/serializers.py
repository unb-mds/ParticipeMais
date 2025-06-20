from rest_framework import serializers
from .models import Propostas
from api.serializers import DynamicFieldsModelSerializer

class PropostaSerializer(DynamicFieldsModelSerializer):
    palavras_chave = serializers.SerializerMethodField()
    autor_resumido = serializers.SerializerMethodField()
    titulo_resumido = serializers.SerializerMethodField()
    descricao_resumida = serializers.SerializerMethodField()
    favoritada = serializers.SerializerMethodField()
    total_palavras_chave = serializers.SerializerMethodField()

    class Meta:
        model = Propostas
        fields = "__all__"
        read_only_fields = ['data_criacao']

    def get_palavras_chave(self, obj):
        """Retorna lista de palavras-chave ou lista vazia se não existir"""
        if hasattr(obj, 'palavras_chave') and obj.palavras_chave.exists():
            return list(obj.palavras_chave.values_list('palavras', flat=True))
        return []

    def get_total_palavras_chave(self, obj):
        """Retorna contagem de palavras-chave"""
        return obj.palavras_chave.count() if hasattr(obj, 'palavras_chave') else 0

    def get_autor_resumido(self, obj):
        """Retorna versão resumida do nome do autor"""
        return (obj.autor[:15] + '...') if obj.autor and len(obj.autor) > 15 else obj.autor or ''

    def get_titulo_resumido(self, obj):
        """Retorna versão resumida do título"""
        if not obj.titulo_proposta:
            return ''
        return (obj.titulo_proposta[:50] + '...') if len(obj.titulo_proposta) > 50 else obj.titulo_proposta

    def get_descricao_resumida(self, obj):
        """Retorna versão resumida da descrição"""
        if not obj.descricao_proposta:
            return ''
        return (obj.descricao_proposta[:120] + '...') if len(obj.descricao_proposta) > 120 else obj.descricao_proposta
    
    def get_favoritada(self, obj):
        """Verifica se a proposta está favoritada pelo usuário atual"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.favoritos.filter(id=obj.id).exists()
        return False