from rest_framework import serializers
from .models import Minutes, Speaker, Bookmark, File

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        #fields = ['file_id','file_name','file_extension','file_path']
        fields = '__all__'

class SpeakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speaker
        fields = ['speaker_seq', 'mn_id', 'speaker_name']

class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ['bm_seq', 'mn_id', 'bm_start', 'bm_end', 'bm_name']

class MinutesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Minutes
        # fields = ['mn_id', 'user_id', 'dr_id', 'mn_make_date', 'mn_title', 'mn_date', 'mn_place', 'mn_explanation', 'mn_memo', 'mn_share_link', 'speaker_seq']
        fields = '__all__'