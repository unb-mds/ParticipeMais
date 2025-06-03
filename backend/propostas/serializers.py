from rest_framework import serializers
from .models import Propostas
from api.serializers import DynamicFieldsModelSerializer

class PropostaSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Propostas
        fields = '__all__'