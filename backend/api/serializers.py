from rest_framework import serializers
from django.contrib.auth.tokens import PasswordResetTokenGenerator # gera tokens seguross
from django.utils.encoding import force_bytes 
from django.utils.http import urlsafe_base64_encode # converter o user.pk em uma string segura para URL.
from django.contrib.auth.password_validation import validate_password
    
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

        
