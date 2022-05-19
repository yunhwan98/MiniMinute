import json
import random
import string
import os
from collections import OrderedDict

import boto3
import numpy as np
from django.db.models import Q
from django.forms.models import model_to_dict
from django.http import HttpResponse, JsonResponse
from pydub import AudioSegment
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from summary.models import Summary
from summary.serializers import SummarySerializer
from text_keyword.models import Keyword
from text_keyword.serializers import KeywordSerializer
from user.models import Directory
from voice_recognition.models import VoiceRecognition
from voice_recognition.serializers import VoiceRecognitionSerializer
from .models import Minutes, Speaker, Bookmark, File
from .serializers import MinutesSerializer, SpeakerSerializer, BookmarkSerializer, FileSerializer


def index(request):
    return HttpResponse("회의록 테스트")


# 사용자별 회의록 전체 조회 (조회, 생성)
@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def minute_list(request):
    if request.method == 'GET':
        minutes = Minutes.objects.filter(user_id=request.user.id)
        serializer = MinutesSerializer(minutes, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        data["user_id"] = str(request.user.id)
        serializer = MinutesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


# 사용자별 특정 회의록 정보(조회, 수정, 삭제)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def minute(request, mn_id):
    obj = Minutes.objects.get(mn_id=mn_id)

    if request.method == 'GET':
        serializer = MinutesSerializer(obj)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        data["user_id"] = str(request.user.id)
        if data.get("mn_title") == None:
            data["mn_title"] = obj.mn_title
        if data.get("dr_id") == None:
            data["dr_id"] = obj.dr_id.dr_id
        serializer = MinutesSerializer(obj, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        obj.delete()
        return HttpResponse(status=204)


# 북마크 목록(조회, 생성)
@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def bookmark_list(request, mn_id):
    if request.method == 'GET':
        bookmark = Bookmark.objects.filter(mn_id=mn_id)
        serializer = BookmarkSerializer(bookmark, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        data["user_id"] = str(request.user.id)
        data["mn_id"] = mn_id
        serializer = BookmarkSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


# 북마크 (수정, 삭제)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def bookmark(request, mn_id, bm_seq):
    obj = Bookmark.objects.get(mn_id=mn_id, bm_seq=bm_seq)

    if request.method == 'GET':
        serializer = BookmarkSerializer(obj)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        data["user_id"] = str(request.user.id)
        data["mn_id"] = mn_id
        data["bm_seq"] = bm_seq
        if data.get("bm_name") == None:
            data["bm_name"] = obj.bm_name
        if data.get("bm_start") == None:
            data["bm_start"] = obj.bm_start
        if data.get("bm_end") == None:
            data["bm_end"] = obj.bm_end
        serializer = BookmarkSerializer(obj, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        obj.delete()
        return HttpResponse(status=204)


# 화자 목록 조회, 추가
@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def speaker_list(request, mn_id):
    if request.method == 'GET':
        speaker = Speaker.objects.filter(mn_id=mn_id)
        serializer = SpeakerSerializer(speaker, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        data["mn_id"] = mn_id
        serializer = SpeakerSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


# 화자 (조회, 수정, 삭제)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def speaker(request, mn_id, speaker_seq):
    obj = Speaker.objects.get(mn_id=mn_id, speaker_seq=speaker_seq)

    if request.method == 'GET':
        serializer = SpeakerSerializer(obj)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        data["mn_id"] = mn_id
        # data["speaker_seq"] = speaker_seq
        serializer = SpeakerSerializer(obj, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        obj.delete()
        return HttpResponse(status=204)


# 파일 전체 목록 조회
# 관리자 계정만 가능
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def file_list(request):
    if request.user.is_admin:
        query_set = File.objects.all()
        serializer = FileSerializer(query_set, many=True)
        return JsonResponse(serializer.data, safe=False)
    return HttpResponse("관리자가 아닙니다.", status=400)


# 파일 (조회, 수정, 삭제)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def file(request, file_id):
    obj = File.objects.get(file_id=file_id)

    if request.method == 'GET':
        serializer = FileSerializer(obj)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        data["file_id"] = file_id
        if data.get("file_name") == None:
            data["file_name"] = obj.file_name
        if data.get("file_extension") == None:
            data["file_extension"] = obj.file_extension
        if data.get("file_path") == None:
            data["file_path"] = obj.file_path
        serializer = FileSerializer(obj, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        obj.delete()
        return HttpResponse(status=204)


# 파일 업로드
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def file_upload(request, mn_id):
    minutes = Minutes.objects.get(mn_id=mn_id)
    if request.method == 'POST':
        # 파일 정보 저장
        print(os.path.splitext(request.FILES['file'].name))
        file_data = {'file_name':os.path.splitext(request.FILES['file'].name)[0], 'file_extension':os.path.splitext(request.FILES['file'].name)[1][1:]}
        file_data['file_path'] = 'test'
        file_serializer = FileSerializer(data=file_data)
        if file_serializer.is_valid():
            file_serializer.save()
            # 회의록 정보 수정
            minutes.file_id = File.objects.get(file_id=file_serializer.data.get("file_id"))
            minutes.save()
            file = File.objects.get(file_id=minutes.file_id.file_id)
            # 버킷에 업로드
            s3 = boto3.resource('s3')
            s3.Bucket('miniminute-bucket').put_object(Key='{}_{}.{}'.format(file.file_id, file.file_name, file.file_extension), Body=request.FILES['file'])
            data = {'file': file_serializer.data, 'minutes': model_to_dict(minutes)}
            return JsonResponse(data, status=201)
        return JsonResponse(file_serializer.errors, status=400)


# 회의록 검색
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def minute_search(request):
    keyword = request.GET.get('keyword', None)
    minute_list = Minutes.objects.filter(user_id=request.user.id).order_by('-mn_make_date')
    if keyword:
        minute_list = minute_list.filter(
            Q(mn_title__icontains=keyword) |
            Q(mn_date__icontains=keyword) |
            Q(mn_place__icontains=keyword) |
            Q(mn_memo__icontains=keyword)
        ).distinct().values()
        context = {'minute_list': list(minute_list), 'keyword': keyword}
        return JsonResponse(context)


# 회의록 공유 코드 생성
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def minute_share_link(request):
    minutes = Minutes.objects.get(mn_id=request.data['mn_id'])
    if request.method == 'POST':
        share_str = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(8))
        minutes.mn_share_link = share_str
        minutes.save()
        return JsonResponse(model_to_dict(minutes), status=201)


# 공유 코드로 회의록 생성
@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def create_minute_with_share_link(request, mn_share_link):
    # 회의록 정보 불러오기 > 화자 선택하기 > 회의록 생성
    minutes = Minutes.objects.get(mn_share_link=mn_share_link)
    speaker = Speaker.objects.filter(mn_id=minutes.mn_id)
    file = File.objects.get(file_id=minutes.file_id.file_id)

    if request.method == 'GET':
        serializer = SpeakerSerializer(speaker, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        # file 업로드
        file_key = '{}_{}.{}'.format(file.file_id, file.file_name, file.file_extension)
        file.file_id = None
        file.save()
        minutes.mn_id = None
        minutes.user_id = request.user
        minutes.dr_id = Directory.objects.get(dr_id=request.data['dr_id'])
        minutes.mn_make_date = None
        minutes.mn_share_link = None
        minutes.speaker_seq = None
        minutes.file_id = file
        minutes.save()

        # 화자 생성
        speaker_dic = {}
        for obj in speaker:
            old_speaker_seq = obj.speaker_seq
            obj.speaker_seq = None
            obj.mn_id = minutes
            obj.save()
            speaker_dic[old_speaker_seq] = obj
        minutes.speaker_seq = speaker_dic[request.data['speaker_seq']]
        minutes.save()

        # vr 복사
        voice_recognition = VoiceRecognition.objects.filter(
            mn_id=Minutes.objects.get(mn_share_link=mn_share_link).mn_id)
        for vr in voice_recognition:
            vr.vr_id = None
            vr.mn_id = minutes
            vr.speaker_seq = speaker_dic[vr.speaker_seq.speaker_seq]
            vr.save()

        # s3 작업
        s3 = boto3.resource('s3')
        bucket = 'miniminute-bucket'
        copy_source = {
            'Bucket': bucket,
            'Key': file_key
        }
        s3.meta.client.copy(copy_source, bucket, '{}_{}.{}'.format(file.file_id, file.file_name, file.file_extension))

        minutes_serializer = MinutesSerializer(minutes)
        file_serializer = FileSerializer(file)
        speaker_serializer = SpeakerSerializer(speaker,many=True)
        vr_serializer = VoiceRecognitionSerializer(voice_recognition,many=True)
        response = {'minutes': minutes_serializer.data, 'file': file_serializer.data, 'speaker': speaker_serializer.data, 'voice_recognition': vr_serializer.data}
        return JsonResponse(response, status=201)


# 음성인식 후 화자 선택
@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def choice_speaker(request, mn_id):
    minutes = Minutes.objects.get(mn_id=mn_id)
    if request.method == 'GET':
        speakers = Speaker.objects.filter(mn_id=mn_id)
        serializer = SpeakerSerializer(speakers, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        speaker = Speaker.objects.get(mn_id=mn_id, speaker_seq=request.data['speaker_seq'])
        minutes.speaker_seq = speaker
        minutes.save()
        return JsonResponse({'minutes': model_to_dict(minutes)}, status=201)


# 회의 결과 모아서 조회
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def result(request, mn_id):
    obj = Keyword.objects.get(mn_id=mn_id)
    kw = KeywordSerializer(obj).data
    obj = Summary.objects.get(mn_id=mn_id)
    sm = SummarySerializer(obj).data

    # 키워드, 요약문
    fb = OrderedDict()
    fb['keyword'] = {'keyword1': kw['keyword1'], 'keyword2': kw['keyword2'], 'keyword3': kw['keyword3']}
    fb['summary'] = sm['summary']

    total_emotion_count = [0.0, 0.0, 0.0, 0.0]
    obj = VoiceRecognition.objects.filter(mn_id=mn_id)
    serializer = VoiceRecognitionSerializer(obj, many=True)
    data = serializer.data

    fb['one_line_review'] = "OO님의 이번 회의 스타일은 #행복형 #일반적 대화 #매우 빠름 입니다"

    # 감정분포(수정중)
    for i in range(0, len(data)):
        total_emotion_count[data[i]['emotion_type']] += 1.0

    fb['emotion'] = [{'total':
                          {'angry': total_emotion_count[0] / len(data), 'sadness': total_emotion_count[1] / len(data),
                           'neutral': total_emotion_count[2] / len(data),
                           'happiness': total_emotion_count[3] / len(data)}},
                     {'user':
                          {'angry': total_emotion_count[0] / len(data), 'sadness': total_emotion_count[1] / len(data),
                           'neutral': total_emotion_count[2] / len(data),
                           'happiness': total_emotion_count[3] / len(data)}}]

    # 공격발언(수정중)
    hate_rate = 30
    offensive_rate = 30
    total_hate_speech_rate = hate_rate + offensive_rate
    text = "분노 감정에서의 공격&차별 발언 비율이 " + str(total_hate_speech_rate)
    if total_hate_speech_rate >= 50:
        text = text + "%로 매우 높은 편이에요."\
                      "\n화난 감정을 적절하게 다루기 위한 노력이 필요해보입니다!" \
                      "\n회의중 감정이 격해졌다면 잠시 쉬어가는 것은 어떨까요?" \
                      "\n최근 화가 자주 난다면, 회의가 끝난 후 스스로 왜 화가 났는지에 대해 생각해보는 것도 좋은 방법입니다."
    elif total_hate_speech_rate >= 20:
        text = text + "%로 높은 편이에요."
    else:
        text = text + "%예요."

    fb['hate_speech_rate'] = {'hate_rate': 0.0, 'offensive_rate': 0.0, 'general_rate': 0.0, 'text': text}

    # 말 빠르기(수정중)
    speech_rate = 350
    rate = 1.32
    text = "OO님의 분당 음절 수는 약 "+str(speech_rate)+"음절/분 으로 정상 성인 평균 265음절/분 대비 약 " + str(rate) + "배입니다." \
                                                                                              "전반적으로 "
    if(rate >= 1.3):
        text = text + "빠른 편이에요." \
                      "\n다음에는 조금만 천천히 말해보는 건 어떨까요?"
    elif(rate >0.7):
        text = text + "평균 속도예요."
    else:
        text = text + "느린 편이에요." \
                      "\n원활한 대화를 위해 좀 더 빠르게 말하는 연습을 해보는 건 어떨까요?"
    fb['speech'] = {'text': text}

    return JsonResponse({'result': fb}, status=200)
