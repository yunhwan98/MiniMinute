from django.http import JsonResponse

# 회의록 감정분석 결과 갱신
from feedback.models import Feedback
from feedback.serializers import FeedbackSerializer
from voice_recognition.models import VoiceRecognition
from voice_recognition.serializers import VoiceRecognitionSerializer

#def set_user_feedback(mn_id, speaker_seq):
#    try:
#        obj = Feedback.objects.get(mn_id=mn_id)
#        obj.delete()
#    except:
#        print("")
#    emotion_count = [0, 0, 0, 0]
#    obj = VoiceRecognition.objects.filter(mn_id=mn_id, speaker_seq=speaker_seq).order_by('vr_seq')
#    serializer = VoiceRecognitionSerializer(obj, many=True)
#    data = serializer.data
#    ['fb_id', 'mn_id', 'angry', 'sadness', 'neutral', 'happiness', 'hate_rate', 'offensive_rate', 'general_rate', 'speech']
#    for i in range(0, len(data)):
#        if
#    fb_data = {'mn_id': mn_id, 'angry': 5, 'keyword2': noun_list[1][0], 'keyword3': noun_list[2][0]}
#    serializer = FeedbackSerializer(data=kw_data)
#    if serializer.is_valid():
#        serializer.save()
#        return JsonResponse(serializer.data, status=201)
#    return JsonResponse(serializer.errors, status=400)
