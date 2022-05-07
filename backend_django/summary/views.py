from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from .models import Summary
from .serializers import SummarySerializer


# 회의록 키워드 불러오기
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
def get_summary(request, mn_id):
    obj = Summary.objects.get(mn_id=mn_id)

    if request.method == 'GET':
        serializer = SummarySerializer(obj)
        return JsonResponse(serializer.data, safe=False)
