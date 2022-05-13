from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from .models import VoiceRecognition
from minute.models import Minutes, File
from .serializers import VoiceRecognitionSerializer
from minute.serializers import SpeakerSerializer
from django.db.models import Q
from requests_toolbelt.multipart.encoder import MultipartEncoder

from urllib import request
from ast import literal_eval
from botocore.config import Config
import boto3

import argparse
import io
import requests
import json

def index(request):
    return HttpResponse("음성인식 테스트")

# AWS transcribe 호출
def transcribe_file(file_nm, user_id, speaker_cnt):
    bucket='miniminute-bucket'
    job_name='{}_{}'.format(user_id,file_nm)

    # Transcribe를 위한 Config 설정
    my_config = Config(
        region_name = 'ap-northeast-2',
        signature_version = 'v4',
        retries={
            'max_attempts':5,
            'mode':'standard'
        }
    )

    # Transcribe 실행
    transcribe = boto3.client('transcribe', config=my_config)

    # s3에 업로드한 파일 URL
    job_uri = 'https://s3.ap-northeast-2.amazonaws.com/{}/{}.wav'.format(bucket,job_name)
    transcribe.start_transcription_job(
        TranscriptionJobName=job_name,
        Media={'MediaFileUri': job_uri},
        MediaFormat='wav',
        LanguageCode='ko-KR',
        Settings={
            'ShowSpeakerLabels': True,  # 화자분리 기능 True or False
            'MaxSpeakerLabels': speaker_cnt  # 화자수
        }
    )

    # Transcribe job 작업이 끝나면 결과값 불러옴
    while True:
        status = transcribe.get_transcription_job(TranscriptionJobName=job_name)
        if status['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
            save_json_uri = status['TranscriptionJob']['Transcript']['TranscriptFileUri']
            break
    # Transcribe 결과가 저장된 웹주소
    save_json_uri = status['TranscriptionJob']['Transcript']['TranscriptFileUri']

    # 웹서버 결과 파이썬으로 불러오기
    load = request.urlopen(save_json_uri)
    confirm = load.status
    results = load.read().decode('utf-8')

    # 문자열을 딕셔너리로 변환 후 결과 가져오기
    transcribe_text = literal_eval(results)['results']['transcripts'][0]['transcript']
    # print(json.dumps(literal_eval(results), indent=2))
    return literal_eval(results)

# 음성 인식
@api_view(['GET', 'POST', 'DELETE'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def voice_recognition_list(request, mn_id):

    minute = Minutes.objects.get(mn_id=mn_id)
    file = File.objects.get(file_id=minute.file_id.file_id)


    if request.method == 'GET':
        voice_recognitions = VoiceRecognition.objects.filter(mn_id=mn_id)
        serializer = VoiceRecognitionSerializer(voice_recognitions, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':

        results = transcribe_file(file.file_name, request.user.id, request.data.get('speaker_cnt'))


        # 화자 생성
        speaker_dic={}
        for i in range(0,results['results']['speaker_labels']['speakers']):
            speaker_data={'speaker_name':'spk_'+str(i),'mn_id':mn_id}
            speaker_serializer=SpeakerSerializer(data=speaker_data)
            if speaker_serializer.is_valid():
                speaker_serializer.save()
                speaker_dic[i]=speaker_serializer.data['speaker_seq']

        # 음성 인식 생성
        seq=0
        item_seq=0
        max_item_len=len(results['results']['items'])
        for segment in results['results']['speaker_labels']['segments']:
            # vr_text 구하기
            item_len = len(segment['items'])
            vr_text=[]
            while (item_len>0):
                if(results['results']['items'][item_seq]['type']=='punctuation'):
                    item_len += 1
                vr_text.append(results['results']['items'][item_seq]['alternatives'][0]['content'])
                vr_text.append(' ')
                item_seq += 1
                item_len -=1
            if (item_seq < max_item_len and results['results']['items'][item_seq]['type'] == 'punctuation'):
                vr_text.append(results['results']['items'][item_seq]['alternatives'][0]['content'])
                item_seq += 1
            vr_text = ''.join(vr_text)

            vr_data = {'vr_seq':seq,'vr_start':segment['start_time'],'vr_end':segment['end_time'],'vr_text':vr_text,'mn_id':mn_id,'speaker_seq':speaker_dic[int(segment['speaker_label'][4:])]}
            vr_serializer=VoiceRecognitionSerializer(data=vr_data)
            if vr_serializer.is_valid():
                vr_serializer.save()
            else:
                return JsonResponse(vr_serializer.errors, status=400)
            seq+=1
        return JsonResponse(results)

    elif request.method == 'DELETE':
        voice_recognitions = VoiceRecognition.objects.filter(mn_id=mn_id).delete()
        # Job 삭제하기
        my_config = Config(
            region_name='ap-northeast-2',
            signature_version='v4',
            retries={
                'max_attempts': 5,
                'mode': 'standard'
            }
        )
        del_transcribe = boto3.client('transcribe', config=my_config)
        res = del_transcribe.delete_transcription_job(
            TranscriptionJobName='{}_{}'.format(request.user.id, file.file_name)
        )
        res['ResponseMetadata']['HTTPStatusCode'] == '200'
        return HttpResponse(status=204)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def voice_recognition(request, mn_id, vr_seq):
    obj = VoiceRecognition.objects.get(mn_id=mn_id, vr_seq=vr_seq)

    if request.method == 'GET':
        serializer = VoiceRecognitionSerializer(obj)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        vr_data = {'mn_id':mn_id,'vr_seq':vr_seq,'vr_start':data.get("vr_start"),'vr_end':data.get("vr_end"),'vr_text':data.get("vr_text"),'speaker_seq':data.get("speaker_seq")}
        serializer = VoiceRecognitionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        data['mn_id']=mn_id
        data['vr_seq']=vr_seq
        if data.get("vr_start") == None:
            data["vr_start"] = obj.vr_start
        if data.get("vr_end") == None:
            data["vr_end"] = obj.vr_end
        if data.get("vr_text") == None:
            data["vr_text"] = obj.vr_text
        if data.get("speaker_seq") == None:
            data["speaker_seq"] = obj.speaker_seq.speaker_seq
        serializer = VoiceRecognitionSerializer(obj, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        obj.delete()
        return HttpResponse(status=204)

# 음성인식 결과 검색
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def voice_recognition_search(request, mn_id):
    #TO DO mn_id에 해당하는 minutes의 user_id가 로그인된 사용자가 아니면 에러
    keyword = request.GET.get('keyword', None)
    voice_recognition_list = VoiceRecognition.objects.filter(mn_id=mn_id).order_by('vr_seq')
    if keyword :
        voice_recognition_list = voice_recognition_list.filter(
            Q(vr_text__icontains=keyword)
        ).distinct().values()
        context = {'voice_recognition_list':list(voice_recognition_list), 'keyword':keyword}
        return JsonResponse(context)

