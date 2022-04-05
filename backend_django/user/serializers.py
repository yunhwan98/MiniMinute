from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'user_profile', 'password', 'username', 'user_sign_up_date',
                  'user_access_date']
