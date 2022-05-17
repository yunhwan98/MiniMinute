from django.http import JsonResponse, HttpResponse
from konlpy.tag import Okt
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from minute.models import Minutes
from voice_recognition.models import VoiceRecognition
from voice_recognition.serializers import VoiceRecognitionSerializer
from .models import Keyword
from .serializers import KeywordSerializer
from collections import Counter


# 회의록 키워드 불러오기, 회의록 키워드 갱신
@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def get_keyword(request, mn_id):
    if request.method == 'GET':
        obj = Keyword.objects.get(mn_id=mn_id)
        serializer = KeywordSerializer(obj)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        return set_keyword(mn_id)


def set_keyword(mn_id):
    obj = VoiceRecognition.objects.filter(mn_id=mn_id).order_by('vr_seq')
    serializer = VoiceRecognitionSerializer(obj, many=True)
    data = serializer.data
    count = len(data)
    text = ""
    for idx in range(0, count):
        text = text + " " + data[idx]['vr_text']
    text.strip()

    # okt 객체 생성
    okt = Okt()
    noun = okt.nouns(text)
    for i, v in enumerate(noun):
        if len(v) < 2:
            noun.pop(i)
    count = Counter(noun)
    # 명사 빈도 카운트
    noun_list = count.most_common(100)

    kw_data = {'mn_id':mn_id, 'keyword1':noun_list[0][0], 'keyword2':noun_list[1][0], 'keyword3':noun_list[2][0]}
    try:
        obj = Keyword.objects.get(mn_id=mn_id)
        obj.delete()
    except:
        print("")
    serializer = KeywordSerializer(data=kw_data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=201)
    return JsonResponse(serializer.errors, status=400)
