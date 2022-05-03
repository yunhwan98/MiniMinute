from rest_framework import serializers
from .models import VoiceRecognition

class VoiceRecognitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoiceRecognition
        fields = '__all__'