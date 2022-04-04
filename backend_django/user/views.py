from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser

from .models import Users
from .serializers import UsersSerializer


# Create your views here.

#유저 전체 조회
@csrf_exempt
def users_list(request):
    if request.method == 'GET':
        query_set = Users.objects.all()
        serializer = UsersSerializer(query_set, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = UsersSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

#유저 단 건 조회
@csrf_exempt
def users(request, pk):
    obj = Users.objects.get(pk=pk)

    if request.method == 'GET':
        serializer = UsersSerializer(obj)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = UsersSerializer(obj, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    elif request.method == 'DELETE':
        obj.delete()
        return HttpResponse(status=204)

#유저 로그인
@csrf_exempt
def signin(request):

    if request.method == 'POST':
        data = JSONParser().parse(request)
        search_email = data['user_email']
        obj = Users.objects.get(user_email=search_email)

        if data['user_pw'] == obj.user_pw:
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=400)