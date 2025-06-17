"""
Serializers para a API do ParticipeMais.
"""

from rest_framework import serializers

class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    Um ModelSerializer que aceita 'fields' para limitar os campos.
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
