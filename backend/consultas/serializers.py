from .models import Consultas
from api.serializers import DynamicFieldsModelSerializer

class ConsultasSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Consultas
        fields = '__all__'