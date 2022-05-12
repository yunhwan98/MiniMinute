from rest_framework import serializers
from .models import Keyword


class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ['mn_id', 'keyword1', 'keyword2', 'keyword3']
