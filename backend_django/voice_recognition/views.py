from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from .models import VoiceRecognition
from minute.models import Minutes, File
from .serializers import VoiceRecognitionSerializer

import argparse
import io

def index(request):
    return HttpResponse("음성인식 테스트")

# 구글 클라우드 STT 호출
def transcribe_file(gcs_uri, mn_id):
    from google.cloud import speech_v1p1beta1 as speech
    client = speech.SpeechClient()
    audio = speech.RecognitionAudio(uri=gcs_uri)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code='ko-KR',
        enable_word_time_offsets=True,
        enable_speaker_diarization=True,
    )
    operation  = client.long_running_recognize(config=config, audio=audio)
    response = operation.result(timeout=90)

    data = []
    seq = 0
    for result in response.results:
        if (result.alternatives[0].transcript != "") :
            data.append({
                "mn_id": mn_id,
                "vr_seq": seq,
                "vr_start": str(result.alternatives[0].words[0].start_time),
                "vr_end": str(result.alternatives[0].words[len(result.alternatives[0].words) - 1].end_time),
                "vr_text": result.alternatives[0].transcript
            })
            seq = seq + 1
    return data

# 음성 인식
@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def voice_recognition_list(request):
    if request.method == 'GET':
        voice_recognitions = VoiceRecognition.objects.filter(mn_id=request.data["mn_id"])
        serializer = VoiceRecognitionSerializer(voice_recognitions, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        minute = Minutes.objects.get(mn_id=request.data["mn_id"])
        file = File.objects.get(file_id=minute.file_id.file_id)
        response = transcribe_file("gs://miniminute_voice_file/" + file.file_name + "." + file.file_extension, minute.mn_id)
        failed = 0
        for data in response:
            serializer = VoiceRecognitionSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            else:
                failed = 1
        if failed == 0:
            return JsonResponse(serializer.data, status=201)
        else:
            return JsonResponse(serializer.errors, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def voice_recognition(request):
    obj = VoiceRecognition.objects.get(mn_id=request.data["mn_id"], vr_seq=request.data["vr_seq"])

    if request.method == 'GET':
        serializer = VoiceRecognitionSerializer(obj)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'PUT':
        # data = JSONParser().parse(request)
        # data["vr_seq"] = obj.vr_seq
        # data["mn_id"] = obj.mn_id.mn_id
        data = request.data
        if data.get("vr_start") == None:
            data["vr_start"] = obj.vr_start
        if data.get("vr_end") == None:
            data["vr_end"] = obj.vr_end
        if data.get("vr_text") == None:
            data["vr_text"] = obj.vr_text
        print(4)
        # if data.get("speaker_seq") == None:
        #     data["speaker_seq"] = obj.speaker_seq
        serializer = VoiceRecognitionSerializer(obj, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        obj.delete()
        return HttpResponse(status=204)