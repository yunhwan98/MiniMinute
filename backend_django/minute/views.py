import json
import random
import string
import os
import shutil
from collections import OrderedDict

import boto3
import numpy as np
from django.db.models import Q
from django.forms.models import model_to_dict
from django.http import HttpResponse, JsonResponse
from django.core.files.storage import FileSystemStorage
from pydub import AudioSegment
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from feedback.models import Feedback
from feedback.serializers import FeedbackSerializer
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
        # s3 작업
        s3 = boto3.client('s3')
        s3.delete_object(Bucket='miniminute-bucket', Key='{}_{}.{}'.format(obj.file_id, obj.file_name, obj.file_extension))
        # 파일 삭제
        os.remove('profile/audio_file/{}_{}.{}'.format(obj.file_id, obj.file_name, obj.file_extension))
        # DB 삭제
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
        file_data = {'file_name': os.path.splitext(request.FILES['file'].name)[0], 'file_extension': os.path.splitext(request.FILES['file'].name)[1][1:]}
        file_data['file_path'] = 'test'
        file_serializer = FileSerializer(data=file_data)
        if file_serializer.is_valid():
            file_serializer.save()
            # 회의록 정보 수정
            minutes.file_id = File.objects.get(file_id=file_serializer.data.get("file_id"))
            minutes.save()
            file = File.objects.get(file_id=minutes.file_id.file_id)
            request_file = request.FILES['file']
            # 버킷에 업로드
            s3 = boto3.resource('s3')
            s3.Bucket('miniminute-bucket').put_object(
                Key='{}_{}.{}'.format(file.file_id, file.file_name, file.file_extension), Body=request_file)
            # 파일 저장
            FileSystemStorage().save('./audio_file/{}_{}.{}'.format(file.file_id, file.file_name, file.file_extension), request_file)
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

        # 파일 복사
        shutil.copy('profile/audio_file/'+file_key, 'profile/audio_file/{}_{}.{}'.format(file.file_id, file.file_name, file.file_extension))

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
        speaker_serializer = SpeakerSerializer(speaker, many=True)
        vr_serializer = VoiceRecognitionSerializer(voice_recognition, many=True)
        response = {'minutes': minutes_serializer.data, 'file': file_serializer.data,
                    'speaker': speaker_serializer.data, 'voice_recognition': vr_serializer.data}
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
    user_emotion_count = [0.0, 0.0, 0.0, 0.0]
    user_speech_count = [0.0, 0.0, 0.0]

    obj = VoiceRecognition.objects.filter(mn_id=mn_id)
    serializer = VoiceRecognitionSerializer(obj, many=True)
    total_data = serializer.data

    obj = Minutes.objects.get(mn_id=mn_id, user_id=request.user.id)
    serializer = MinutesSerializer(obj)
    spk_seq = serializer.data['speaker_seq']
    obj = VoiceRecognition.objects.filter(mn_id=mn_id, speaker_seq=spk_seq)
    serializer = VoiceRecognitionSerializer(obj, many=True)
    user_data = serializer.data

    obj = Speaker.objects.get(speaker_seq=spk_seq)
    serializer = SpeakerSerializer(obj)
    username = serializer.data['speaker_name']

    for data in user_data:
        user_emotion_count[data['emotion_type']] += 1.0
        if data['emotion_type'] == 0:
            user_speech_count[data['speech_type']] += 1.0
        if sum(user_speech_count) == 0:
            hate = 0.0
            offensive = 0.0
            general = 0.0
        else:
            hate = user_speech_count[2] / sum(user_speech_count)
            offensive = user_speech_count[1] / sum(user_speech_count)
            general = user_speech_count[0] / sum(user_speech_count)

    speech_rate = get_speech_rate(request, mn_id)

    fb_data = {'mn_id': mn_id, 'user_id': request.user.id,
               'angry': user_emotion_count[0] / len(user_data),
               'sadness': user_emotion_count[1] / len(user_data),
               'neutral': user_emotion_count[2] / len(user_data),
               'happiness': user_emotion_count[3] / len(user_data),
               'hate_rate': hate,
               'offensive_rate': offensive,
               'general_rate': general,
               'speech_rate': speech_rate['total']}
    try:
        obj = Feedback.objects.get(mn_id=mn_id, user_id=request.user.id)
        obj.delete()
    except:
        print("")
    serializer = FeedbackSerializer(data=fb_data)
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)
    one_line_review = username + "님의 이번 회의 스타일은 "
    for i in range(len(user_emotion_count)):
        if max(user_emotion_count) == user_emotion_count[i]:
            if i == 0:
                one_line_review += "#분노형 "
                break
            elif i == 3:
                one_line_review += "#행복형 "
                break
            elif i == 1:
                one_line_review += "#슬픔형 "
                break
            else:
                one_line_review += "#무감정형 "
                break
    hate_rate = fb_data['hate_rate']
    offensive_rate = fb_data['offensive_rate']
    general_rate = fb_data['general_rate']
    total_hate_speech_rate = round((hate_rate + offensive_rate) * 100.0, 2)
    if offensive_rate >= hate_rate and offensive_rate >= general_rate and offensive_rate != 0:
        one_line_review += "#공격적 언행 "
    elif hate_rate >= offensive_rate and hate_rate >= general_rate and hate_rate != 0:
        one_line_review += "#증오적 언행 "
    elif general_rate >= offensive_rate and general_rate >= hate_rate:
        one_line_review += "#일반적 대화 "

    if speech_rate['total'] > 265 * 1.3:
        one_line_review += "#빠름 입니다."
    elif speech_rate['total'] < 265 * 0.6:
        one_line_review += "#느림 입니다."
    else:
        one_line_review += "#보통 빠르기 입니다."

    fb['one_line_review'] = one_line_review

    # 감정분포(수정중)
    for data in total_data:
        total_emotion_count[data['emotion_type']] += 1.0

    total_emotion_rate_feedback = "이번 회의는 전반적으로 "
    for i in range(0, len(total_emotion_count)):
        if (max(total_emotion_count) == total_emotion_count[i]):
            if i == 0:
                total_emotion_rate_feedback += "격앙된 분위기였네요.\n" \
                                               "분노는 전염된답니다. 너무 흥분하지 않도록 조심!"
                break
            elif i == 3:
                total_emotion_rate_feedback += "행복한 분위기였네요.\n"
                break
            elif i == 1:
                total_emotion_rate_feedback += "다운된 분위기였네요.\n" \
                                               "다음에는 좀 더 활기차게 진행해보는게 어때요?"
                break
            else:
                total_emotion_rate_feedback += "평온한 분위기 였네요."
                break

    user_emotion_rate_feedback = "이번 회의의 " + username + "님의 주된 감정은 "
    for i in range(0, len(user_emotion_count)):
        if (max(user_emotion_count) == user_emotion_count[i]):
            if i == 0:
                user_emotion_rate_feedback += "분노예요.\n" \
                                              "화가 났을 때는 감정적으로 행동하지 않도록 조심!"
                break
            elif i == 3:
                user_emotion_rate_feedback += "행복이에요."
                break
            elif i == 1:
                user_emotion_rate_feedback += "슬픔이에요.\n" \
                                              "슬프더라도 좀 더 힘을 내봐요. 화이팅!"
                break
            else:
                user_emotion_rate_feedback += "일반이에요."
                break
    fb['emotion'] = [{'total':
                          {'angry': round(total_emotion_count[0] / len(total_data), 2),
                           'sadness': round(total_emotion_count[1] / len(total_data), 2),
                           'neutral': round(total_emotion_count[2] / len(total_data), 2),
                           'happiness': round(total_emotion_count[3] / len(total_data), 2),
                           'text': total_emotion_rate_feedback}},
                     {'user':
                          {'angry': round(user_emotion_count[0] / len(user_data), 2),
                           'sadness': round(user_emotion_count[1] / len(user_data), 2),
                           'neutral': round(user_emotion_count[2] / len(user_data), 2),
                           'happiness': round(user_emotion_count[3] / len(user_data), 2),
                           'text': user_emotion_rate_feedback}}]

    # 공격발언(수정중)
    text = "분노 감정에서의 공격&차별 발언 비율이 " + str(total_hate_speech_rate)

    if user_emotion_count[0] == 0:
        text = "감지된 분노 감정 발화가 없습니다."
    elif total_hate_speech_rate >= 50:
        text = text + "%로 매우 높은 편이에요." \
                      "\n화난 감정을 적절하게 다루기 위한 노력이 필요해보입니다!" \
                      "\n회의중 감정이 격해졌다면 잠시 쉬어가는 것은 어떨까요?" \
                      "\n최근 화가 자주 난다면, 회의가 끝난 후 스스로 왜 화가 났는지에 대해 생각해보는 것도 좋은 방법입니다."
    elif total_hate_speech_rate >= 20:
        text = text + "%로 높은 편이에요." \
                      "\n분노라는 감정은 행동 유발력이 가장 강한 감정으로, 마음에 품고 있는 것을 너머 실제 행동으로 이어지기에 가장 쉬운 감정 중 하나입니다." \
                      "\n이러한 장점을 잘 이용하기 위해서는 화가 났을 때 이것을 제대로 표출하는 방식을 택하는 것이 중요합니다." \
                      "\n화가 났다면, 내가 어떤 감정을 느끼고 있는지 똑바로 인지한 후에, 다음 행동을 결정하는 것이 좋습니다."
    else:
        text = text + "%로 보통인 편이에요." \
                      "\n감정 조절을 잘 하고 계신 것으로 보입니다!"

    fb['hate_speech_rate'] = {'hate_rate': round(hate_rate, 2), 'offensive_rate': round(offensive_rate, 2),
                              'general_rate': round(general_rate, 2), 'text': text}

    # 말 빠르기(수정중)
    rate = round(speech_rate['total'] / (265.0), 2)
    text = username + "님의 분당 음절 수는 약 " + str(round(speech_rate['total'], 2)) + "음절/분 으로 정상 성인 평균 265음절/분 대비 약 " + str(
        rate) + "배입니다." \
                "\n전반적으로 "
    if (rate >= 1.3):
        text = text + "빠른 편이에요." \
                      "\n다음에는 조금만 천천히 말해보는 건 어떨까요?"
    elif (rate > 0.7):
        text = text + "평균 속도예요."
    else:
        text = text + "느린 편이에요." \
                      "\n원활한 대화를 위해 좀 더 빠르게 말하는 연습을 해보는 건 어떨까요?"
    l = []
    l.append(speech_rate['angry'])
    l.append(speech_rate['sadness'])
    l.append(speech_rate['neutral'])
    l.append(speech_rate['happiness'])
    for i in range(0,4):
        if(max(l) == l[i]):
            if i==0:
                text += "\n분노"
            elif i==1:
                text += "\n슬픔"
            elif i==2:
                text += "\n무감정"
            else:
                text += "\n행복"
    text += "일 때 가장 말이 빨랐어요. 평균 대비 약 " + str(round(max(l)/265, 2))+"배의 속도예요."
    print(l)
    min=10000
    for i in range(0,4):
        if(l[i]!=0.0 and l[i]<min):
            min = l[i]
    print(min)
    for i in range(0,4):
        if(min == l[i]):
            if i==0:
                text += "\n분노"
            elif i==1:
                text += "\n슬픔"
            elif i==2:
                text += "\n무감정"
            else:
                text += "\n행복"
    text += "일 때 가장 말이 느렸어요. 평균 대비 약 " + str(round(min/265, 2))+"배의 속도예요."
    fb['speech'] = {'text': text}

    return JsonResponse({'result': fb}, status=200)


# 분당 음절 수 계산
def get_speech_rate(request, mn_id):
    obj = Minutes.objects.get(mn_id=mn_id, user_id=request.user.id)
    serializer = MinutesSerializer(obj)
    speaker_seq = serializer.data['speaker_seq']
    obj = VoiceRecognition.objects.filter(mn_id=mn_id, speaker_seq=speaker_seq)
    serializer = VoiceRecognitionSerializer(obj, many=True)

    speech_rate = OrderedDict()
    time = 0.0
    text = ""
    data = serializer.data
    for idx in range(0, len(data)):
        time = time + (float(data[idx]['vr_end']) - float(data[idx]['vr_start']))
        text += data[idx]['vr_text']
    text = text.replace(" ", "")
    text = text.replace(".", "")

    total_speech_rate = (len(text) / time) * 60

    emotion_speech_rate = [0.0, 0.0, 0.0, 0.0]
    for type in range(0, 4):
        obj = VoiceRecognition.objects.filter(mn_id=mn_id, speaker_seq=speaker_seq, emotion_type=type)
        serializer = VoiceRecognitionSerializer(obj, many=True)
        text = ""
        time = 0
        data = serializer.data
        for idx in range(0, len(data)):
            time = time + (float(data[idx]['vr_end']) - float(data[idx]['vr_start']))
            text += data[idx]['vr_text']
        text = text.replace(" ", "")
        text = text.replace(".", "")
        if time == 0:
            emotion_speech_rate[type] = 0.0
        else:
            emotion_speech_rate[type] = (len(text) / time) * 60
    speech_rate['total'] = total_speech_rate
    speech_rate['angry'] = emotion_speech_rate[0]
    speech_rate['sadness'] = emotion_speech_rate[1]
    speech_rate['neutral'] = emotion_speech_rate[2]
    speech_rate['happiness'] = emotion_speech_rate[3]
    return speech_rate


# 최근 5개의 회의록 결과 조회
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def get_recent_result(request):
    obj = Feedback.objects.filter(user_id=request.user.id).order_by('-mn_id')
    serializer = FeedbackSerializer(obj, many=True)
    data = serializer.data

    recent_result = OrderedDict()

    if len(recent_result) > 5:
        for idx in range(0, 5):
            recent_result[str(idx)] = {'hate_speech_rate': data[idx]['hate_rate'] + data[idx]['offensive_rate'],
                                       'speech_rate': data[idx]['speech_rate']}
    else:
        for idx in range(0, len(data)):
            recent_result[str(idx)] = {'hate_speech_rate': data[idx]['hate_rate'] + data[idx]['offensive_rate'],
                                       'speech_rate': data[idx]['speech_rate']}
    if len(recent_result) <6:
        text = "최근 회의록 결과 분석을 위해\n 최소 5개의 회의록 결과가 필요합니다."
        recent_result['comment'] = {'text': text}
        return JsonResponse({'result': recent_result}, status=200)

    text = ""
    hate_speech_result=[0, 0]
    speech_rate_result = [0, 0, 0]
    for i in range(0,5):
        hate_speech_rate = data[idx]['hate_rate']+data[idx]['offensive_rate']
        if hate_speech_rate > 20:
            hate_speech_result[0]+=1
        else:
            hate_speech_result[1]+=1

        if data['speech_rate']>265*1.3:
            speech_rate_result[2]+=1
        elif data['speech_rate']<265*0.7:
            speech_rate_result[0]+=1
        else:
            speech_rate_result[1]+=1

    if hate_speech_result[0]>hate_speech_result[1]:
        text += "최근 회의록 중 대다수에서, 공경+차별 발언 비율이 높게 인식되었습니다.\n" \
                "스스로를 돌아볼 시간이 필요해보이네요.\n"
    elif hate_speech_result[0] > 0:
        text += "최근 회의록 중, "
        text += str(hate_speech_result[0])
        text += "개의 회의록에서, 공경+차별 발언 비율이 높게 인식되었습니다.\n" \
                "주의가 필요합니다.\n"
    else:
        text += "최근 회의록에서 감지된 공격+차별 발언이 없습니다.\n" \
                "잘 하고 있습니다!\n"

    if speech_rate_result[1]<4:
        text += "대화 속도에 주의를 기울일 필요가 있어보입니다.\n" \
                "원활한 회의를 위해 힘내주세요!\n"
    elif speech_rate_result[1]==5:
        text += "적정 발화 속도를 잘 유지하고 계신 것으로 보입니다.\n" \
                "잘 하고 있습니다!\n"
    else:
        text += "최근 회의록 중, "
        text += str(5 - speech_rate_result[1])
        text += "개의 회의록에서, 적절치 못한 말 빠르기가 관찰되었습니다.\n" \
                "주의가 필요합니다.\n"
    recent_result['comment']={'text': text}
    return JsonResponse({'result': recent_result}, status=200)

# 즐겨찾기된 회의록 조회
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def get_like_minute(request):
    obj = Minutes.objects.filter(user_id=request.user.id, is_like=True)
    serializer = MinutesSerializer(obj, many=True)
    return JsonResponse(serializer.data, safe=False)