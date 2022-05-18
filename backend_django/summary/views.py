from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from tests.tokenizers import OktTokenizer

from voice_recognition.models import VoiceRecognition
from voice_recognition.serializers import VoiceRecognitionSerializer
from .models import Summary
from .serializers import SummarySerializer
from textrankr import TextRank
from typing import List
from konlpy.tag import Okt


# 회의록 요약문 조회, 갱신
@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def get_summary(request, mn_id):
    if request.method == 'GET':
        obj = Summary.objects.get(mn_id=mn_id)
        serializer = SummarySerializer(obj)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        return set_summary(mn_id)


class MyTokenizer:
    def __call__(self, text: str) -> List[str]:
        tokens: List[str] = text.split()
        return tokens


class OktTokenizer:
    okt: Okt = Okt()

    def __call__(self, text: str) -> List[str]:
        tokens: List[str] = self.okt.phrases(text)
        return tokens


def set_summary(mn_id):
    obj = VoiceRecognition.objects.filter(mn_id=mn_id).order_by('vr_seq')
    serializer = VoiceRecognitionSerializer(obj, many=True)
    data = serializer.data

    text = ""
    num = len(data)
    for idx in range(0, num):
        text = text + " " + data[idx]['vr_text'] + "."
    text.strip()
    print(text)

    mytokenizer: OktTokenizer = OktTokenizer()
    textrank: TextRank = TextRank(mytokenizer)

    k: int = int(num/2)  # num sentences in the resulting summary

    summarized: str = textrank.summarize(text, k)

    summaries: List[str] = textrank.summarize(text, k, verbose=False)
    for summary in summaries:
        print(summary)

    text=""
    for t in summaries:
        text = text + " " + t + "."
    text.strip()

    sm_data = {'mn_id':mn_id, 'summary':text}
    try:
        obj = Summary.objects.get(mn_id=mn_id)
        obj.delete()
    except:
        print("")
    serializer = SummarySerializer(data=sm_data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=201)
    return JsonResponse(serializer.errors, status=400)