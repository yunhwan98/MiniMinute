from rest_framework import serializers
from .models import User, Directory


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'user_profile', 'password', 'username', 'user_sign_up_date',
                  'user_access_date']


class DirectorySerializer(serializers.ModelSerializer):
    def createDirectory(self):
        dr.id = ()
    class Meta:
        model = Directory
        fields = ['dr_id', 'dr_name', 'dr_pid', 'user_id']
