"""Serializers for the Planos model."""

from api.serializers import DynamicFieldsModelSerializer  # Ordem corrigida
from .models import Planos, Oficinas
# Removido: from rest_framework import serializers (não estava sendo usado)

class PlanosSerializer(DynamicFieldsModelSerializer):
    """Serializer for Planos model using dynamic fields."""

    class Meta:
        """Meta definition for PlanosSerializer."""

        model = Planos
        fields = '__all__'

class Oficinas_serializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Oficinas
        fields = '__all__'