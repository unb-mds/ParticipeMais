from rest_framework import serializers
from .models import Planos
from api.serializers import DynamicFieldsModelSerializer

class PlanosSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Planos
        fields = '__all__'
        