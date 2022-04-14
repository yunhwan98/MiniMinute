from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from .models import Minutes, Speaker, Bookmark
from .serializers import MinutesSerializer, SpeakerSerializer, BookmarkSerializer

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