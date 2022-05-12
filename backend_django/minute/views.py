from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from .models import Minutes, Speaker, Bookmark, File
from user.models import Directory
from voice_recognition.models import VoiceRecognition
from .serializers import MinutesSerializer, SpeakerSerializer, BookmarkSerializer, FileSerializer
from voice_recognition.serializers import VoiceRecognitionSerializer
from django.db.models import Q

from botocore.config import Config
import boto3

import string
import random

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
@api_view(['GET','PUT','DELETE'])
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
        bookmark = Bookmark.objects.filter(mn_id = mn_id)
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
        speaker = Speaker.objects.filter(mn_id = mn_id)
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
        file_data = JSONParser().parse(request)
        file_serializer = FileSerializer(data=file_data)
        if file_serializer.is_valid():
            file_serializer.save()
            # 회의록 정보 수정
            minutes.file_id = file_serializer.data.get("file_id")
            minutes.save()
            # 버킷에 업로드
            try :
                audio = open('{}{}.{}'.format(file_data.get('file_path'), file_data.get('file_name'), file_data.get('file_extension')),'rb')
            except FileNotFoundError:
                return JsonResponse(status=400)
            else :
                s3 = boto3.resource('s3')
                s3.Bucket('miniminute-bucket').put_object(Key='{}_{}.{}'.format(request.user.id,file_data.get('file_name'),file_data.get('file_extension')), Body=audio)
                data = {'file':file_serializer.data,'minutes':minutes_serializer.data}
                return JsonResponse(data, status=201)
        return JsonResponse(file_serializer.errors, status=400)

# 회의록 검색
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def minute_search(request):
    keyword = request.GET.get('keyword', None)
    minute_list = Minutes.objects.filter(user_id=request.user.id).order_by('-mn_make_date')
    if keyword :
        minute_list = minute_list.filter(
            Q(mn_title__icontains=keyword) |
            Q(mn_date__icontains=keyword) |
            Q(mn_place__icontains=keyword) |
            Q(mn_memo__icontains=keyword)
        ).distinct().values()
        context = {'minute_list':list(minute_list), 'keyword':keyword}
        return JsonResponse(context)

# 회의록 공유 코드 생성
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def minute_share_link(request):
    minutes = Minutes.objects.get(mn_id=request.data['mn_id'])
    if request.method == 'POST':
        share_str = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(8))
        print(share_str)

        data = {
            'mn_id':minutes.mn_id,
            'user_id':request.user.id,
            'dr_id':minutes.dr_id.dr_id,
            'mn_title':minutes.mn_title,
            'mn_date':minutes.mn_date,
            'mn_place':minutes.mn_place,
            'mn_explanation':minutes.mn_explanation,
            'mn_memo':minutes.mn_memo,
            'mn_share_link':share_str,
            'speaker_seq':minutes.speaker_seq
        }

        serializer = MinutesSerializer(minutes, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(data, status=201)
        return JsonResponse(serializer.errors, status=400)

# 공유 코드로 회의록 생성
@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def create_minute_with_share_link(request, mn_share_link):
    #회의록 정보 불러오기 > 화자 선택하기 > 회의록 생성
    minutes = Minutes.objects.get(mn_share_link=mn_share_link)
    speaker = Speaker.objects.filter(mn_id=minutes.mn_id)
    file = File.objects.get(file_id=minutes.file_id.file_id)

    if request.method == 'GET':
        serializer = SpeakerSerializer(speaker, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        # file 업로드
        file_key = '{}_{}.{}'.format(minutes.user_id.id, minutes.file_id.file_name, minutes.file_id.file_extension)
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
        speaker_dic={}
        old_speaker_seq = 0
        for obj in speaker:
            old_speaker_seq = obj.speaker_seq
            obj.speaker_seq=None
            obj.mn_id=minutes
            obj.save()
            speaker_dic[old_speaker_seq]=obj
        minutes.speaker_seq = speaker_dic[request.data['speaker_seq']]
        minutes.save()

        # vr 복사
        voice_recognition = VoiceRecognition.objects.filter(mn_id=Minutes.objects.get(mn_share_link=mn_share_link).mn_id)
        for vr in voice_recognition:
            vr.vr_id=None
            vr.mn_id=minutes
            vr.speaker_seq=speaker_dic[vr.speaker_seq.speaker_seq]
            vr.save()

        # s3 작업
        s3 = boto3.resource('s3')
        bucket = 'miniminute-bucket'
        copy_source = {
            'Bucket': bucket,
            'Key': file_key
        }
        s3.meta.client.copy(copy_source, bucket, '{}_{}.{}'.format(request.user.id, file.file_name, file.file_extension))

        minutes_serializer = MinutesSerializer(minutes)
        file_serializer=FileSerializer(file)
        speaker_serializer = SpeakerSerializer(speaker,many=True)
        vr_serializer=VoiceRecognitionSerializer(voice_recognition,many=True)
        response={'minutes':minutes_serializer.data,'file':file_serializer.data,'speaker':speaker_serializer.data,'voice_recognition':vr_serializer.data}
        return JsonResponse(response, status=201)


