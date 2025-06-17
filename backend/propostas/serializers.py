from rest_framework import serializers
from .models import Propostas, Palavras_chave
from api.serializers import DynamicFieldsModelSerializer

class PropostaSerializer(DynamicFieldsModelSerializer):
    palavras_chave = serializers.SerializerMethodField()
    favoritada = serializers.SerializerMethodField()

    class Meta:
        model = Propostas
        fields = '__all__'  # ou defina campos específicos com 'fields = [...]'

    def get_palavras_chave(self, obj):
        return list(obj.palavras_chave.values_list('palavras', flat=True))
    
    
    def get_favoritada(self, obj):
        request = self.context.get('request')
        usuario = request.user
        return usuario.favoritos.filter(id=usuario.id).exists()
        
