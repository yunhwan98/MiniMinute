import json
import random
import string
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
        # AudioSegment.converter  = "D:/tool/ffmpeg-5.0.1-essentials_build/bin/ffmpeg"
        # convert mp3 to wav
        if file_data['file_extension'] == 'mp3':
            audSeg = AudioSegment.from_mp3('{}{}.mp3'.format(file_data['file_path'], file_data['file_name']),
                                           format='mp3')
            audSeg.export('{}{}.wav'.format(file_data['file_path'], file_data['file_name']), format='wav')
            file_data['file_extension'] = 'wav'

        # convert m4a to wav
        if file_data['file_extension'] == 'm4a':
            audSeg = AudioSegment.from_file('{}{}.m4a'.format(file_data['file_path'], file_data['file_name']),
                                            format='m4a')
            audSeg.export('{}{}.wav'.format(file_data['file_path'], file_data['file_name']), format='wav')
            file_data['file_extension'] = 'wav'

        file_serializer = FileSerializer(data=file_data)
        if file_serializer.is_valid():
            file_serializer.save()
            # 회의록 정보 수정
            minutes.file_id = File.objects.get(file_id=file_serializer.data.get("file_id"))
            minutes.save()
            # 버킷에 업로드
            try:
                audio = open('{}{}.{}'.format(file_data.get('file_path'), file_data.get('file_name'),
                                              file_data.get('file_extension')), 'rb')
            except FileNotFoundError:
                return HttpResponse('FileNotFoundError')
            else:
                s3 = boto3.resource('s3')
                s3.Bucket('miniminute-bucket').put_object(
                    Key='{}_{}.{}'.format(request.user.id, file_data.get('file_name'), file_data.get('file_extension')),
                    Body=audio)
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
        print(share_str)

        data = {
            'mn_id': minutes.mn_id,
            'user_id': request.user.id,
            'dr_id': minutes.dr_id.dr_id,
            'mn_title': minutes.mn_title,
            'mn_date': minutes.mn_date,
            'mn_place': minutes.mn_place,
            'mn_explanation': minutes.mn_explanation,
            'mn_memo': minutes.mn_memo,
            'mn_share_link': share_str,
            'speaker_seq': minutes.speaker_seq.speaker_seq
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
    # 회의록 정보 불러오기 > 화자 선택하기 > 회의록 생성
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
        speaker_dic = {}
        old_speaker_seq = 0
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
        s3.meta.client.copy(copy_source, bucket,
                            '{}_{}.{}'.format(request.user.id, file.file_name, file.file_extension))

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

    obj = Minutes.objects.get(user_id=request.user.id)
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
        if (data['emotion_type'] == 0):
            user_speech_count[data['speech_type']] += 1.0

    fb_data = {'mn_id': mn_id, 'user_id': request.user.id,
               'angry': user_emotion_count[0] / len(user_data),
               'sadness': user_emotion_count[1] / len(user_data),
               'neutral': user_emotion_count[2] / len(user_data),
               'happiness': user_emotion_count[3] / len(user_data),
               'hate_rate': user_speech_count[2] / len(user_data),
               'offensive_rate': user_speech_count[1] / len(user_data),
               'general_rate': user_speech_count[0] / len(user_data),
               'speech_rate': 265}
    try:
        obj = Feedback.objects.get(mn_id=mn_id, user_id=request.user.id)
        obj.delete()
    except:
        print("")
    serializer = FeedbackSerializer(data=fb_data)

    if serializer.is_valid():
        serializer.save()

    one_line_review = username + "님의 이번 회의 스타일은 "
    for i in range(len(user_emotion_count)):
        if max(user_emotion_count) == user_emotion_count[i]:
            if i == 0:
                one_line_review += "#분노형 "
                break
            elif i == 3:
                one_line_review += "#행복형 "
                break
            elif i == 2:
                one_line_review += "#슬픔형 "
                break
            else:
                one_line_review += "#일반형 "
                break
    hate_rate = fb_data['hate_rate']
    offensive_rate = fb_data['offensive_rate']
    general_rate = fb_data['general_rate']
    total_hate_speech_rate = round((hate_rate + offensive_rate) * 100.0, 2)
    if offensive_rate >= hate_rate and offensive_rate >= general_rate:
        one_line_review += "#공격적 언행 "
    elif hate_rate >= offensive_rate and hate_rate >= general_rate:
        one_line_review += "#증오적 언행 "
    elif general_rate >= offensive_rate and general_rate >= hate_rate:
        one_line_review += "#일상적 대화 "

    speech_rate = fb_data['speech_rate']
    if speech_rate > 265 * 1.3:
        one_line_review += "#빠름 입니다."
    elif speech_rate < 265 * 0.6:
        one_line_review += "#느림 입니다."
    else:
        one_line_review += "#보통 입니다."

    fb['one_line_review'] = one_line_review

    # 감정분포(수정중)
    for data in total_data:
        total_emotion_count[data['emotion_type']] += 1.0

    total_emotion_rate_feedback = "이번 회의는 전반적으로 "
    for i in range(0, len(total_emotion_count)):
        if (max(total_emotion_count) == total_emotion_count[i]):
            if i == 0:
                total_emotion_rate_feedback += "격앙된 분위기였네요." \
                                               "분노는 전염된답니다. 너무 흥분하지 않도록 조심!"
                break
            elif i == 3:
                total_emotion_rate_feedback += "행복한 분위기였네요."
                break
            elif i == 1:
                total_emotion_rate_feedback += "다운된 분위기였네요." \
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
    if total_hate_speech_rate >= 50:
        text = text + "%로 매우 높은 편이에요." \
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
    text = username + "님의 분당 음절 수는 약 " + str(round(speech_rate, 2)) + "음절/분 으로 정상 성인 평균 265음절/분 대비 약 " + str(
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
    fb['speech'] = {'text': text}

    return JsonResponse({'result': fb}, status=200)
