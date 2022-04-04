from rest_framework import serializers
from .models import Users


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['user_id', 'user_email', 'user_profile', 'user_pw', 'user_name', 'user_sign_up_date',
                  'user_access_date']
