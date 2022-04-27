from rest_framework import serializers
from .models import User, Directory
import base64
from django.core.files import File

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'user_profile', 'password', 'username', 'user_sign_up_date',
                  'user_access_date']
    def get_profile(self, obj):
        try:
            f = open(obj.image_path, 'rb')
            data = base64.b64encode(File(f).read())
            f.close()
            return data
        except IOError:
            f = open("repository/preprocessed_images/404.png", "rb")
            data = base64.b64encode(File(f).read())
            f.close()
            return data

class DirectorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Directory
        fields = ['dr_id', 'dr_name', 'dr_pid', 'user_id']
