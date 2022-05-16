import os

from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from .models import User, Directory
from .serializers import UserSerializer, DirectorySerializer
import requests


# Create your views here.


# 유저 전체 목록(조회)
# 관리자 계정만 전체 조회 가능
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def user_list(request):
    if request.user.is_admin:
        query_set = User.objects.all()
        serializer = UserSerializer(query_set, many=True)
        return JsonResponse(serializer.data, safe=False)
    return HttpResponse(status=400)


# 유저 단일 목록(조회, 삭제)
@api_view(['GET', 'DELETE'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def user(request):
    obj = User.objects.get(id=request.user.id)

    if request.method == 'GET':
        serializer = UserSerializer(obj)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'DELETE':
        if(str(request.user.user_profile)!="default.jpg"):
            os.remove('./profile/' + str(request.user.user_profile))
        request.user.delete()
        return HttpResponse(status=204)


# 유저 이름 변경(수정)
@api_view(['PUT'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def user_name_modify(request):
    data = JSONParser().parse(request)
    data["id"] = str(request.user.id)
    data["email"] = str(request.user.email)
    data["password"] = str(request.user.password)
    serializer = UserSerializer(request.user, data=data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=200)
    return JsonResponse(serializer.errors, status=400)


# 유저 이메일 변경(수정)
@api_view(['PUT'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def user_email_modify(request):
    data = JSONParser().parse(request)
    data["id"] = str(request.user.id)
    data["username"] = str(request.user.username)
    data["password"] = str(request.user.password)
    serializer = UserSerializer(request.user, data=data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=200)
    return JsonResponse(serializer.errors, status=400)


# 사용자 프로필 사진 업로드, 수정
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def user_profile(request):
    if str(request.user.user_profile) != "default.jpg":
        os.remove('./profile/' + str(request.user.user_profile))
    data = {"user_profile": request.FILES["user_profile"], "id": request.user.id, "email": request.user.email,
            "username": request.user.username, "password": request.user.password}
    serializer = UserSerializer(request.user, data=data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=200)
    return JsonResponse(serializer.errors, status=400)


# 사용자별 디렉토리 전체 목록(조회, 생성)
@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def directory_list(request):
    if request.method == 'GET':
        dirs = Directory.objects.filter(user_id=request.user.id)
        serializer = DirectorySerializer(dirs, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        data["user_id"] = str(request.user.id)
        serializer = DirectorySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


# 사용자별 디렉토리 개별 목록(조회, 수정, 삭제)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def directory(request, n):
    obj = Directory.objects.get(user_id=request.user.id, dr_id=n)

    if request.method == 'GET':
        serializer = DirectorySerializer(obj)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)

        data["user_id"] = str(request.user.id)
        serializer = DirectorySerializer(obj, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        obj.delete()
        return HttpResponse(status=204)
