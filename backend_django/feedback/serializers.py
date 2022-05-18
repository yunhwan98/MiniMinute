from rest_framework import serializers
from feedback.models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['fb_id', 'mn_id', 'angry', 'sadness', 'neutral', 'happiness', 'hate_rate', 'offensive_rate', 'general_rate', 'speech_rate']