# text
import torch
from torch.utils.data import Dataset
import gluonnlp as nlp
from manage import BERTDataset
from kobert.utils import get_tokenizer
from kobert.pytorch_kobert import get_pytorch_kobert_model
from voice_recognition.cpu_unpickler import CPU_Unpickler as cu

# audio
import librosa
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np


# BERT 모델, Vocabulary 불러오기
bertmodel, vocab = get_pytorch_kobert_model()

# 토큰화
tokenizer = get_tokenizer()
tok = nlp.data.BERTSPTokenizer(tokenizer, vocab, lower=False)

text_model = cu(open("text_model.pickle", "rb")).load()
device = torch.device('cpu')

# Setting parameters
max_len = 64
batch_size = 64


def text_predict(predict_sentence):
    data = [predict_sentence, '0']
    dataset_another = [data]

    another_test = BERTDataset(dataset_another, 0, 1, tok, max_len, True, False)
    test_dataloader = torch.utils.data.DataLoader(another_test, batch_size=batch_size, num_workers=0)

    text_model.eval()

    for batch_id, (token_ids, valid_length, segment_ids, label) in enumerate(test_dataloader):
        token_ids = token_ids.long().to(device)
        segment_ids = segment_ids.long().to(device)

        valid_length = valid_length
        label = label.long().to(device)

        out = text_model(token_ids, valid_length, segment_ids)

        test_eval = []
        for i in out:
            logits = i
            logits = logits.detach().cpu().numpy()
    return logits


def split_wav(data, sample_rate, start, end):
    start *= sample_rate
    end *= sample_rate
    return data[int(start):int(end)]


audio_model = tf.keras.models.load_model('./audio_model.h5')
max_pad_len = 1000
n_columns = 1000
n_row = 40
n_channels = 1


def audio_predict(predict_audio, sr, start, end):
    audio_data = split_wav(predict_audio, sr, start, end)
    mfccs = librosa.feature.mfcc(y=audio_data, sr=sr, n_mfcc=40)
    padded_mfccs = pad_sequences(mfccs, padding='post', maxlen=max_pad_len)
    audio_data = tf.reshape(padded_mfccs, [-1, n_row, n_columns, n_channels])
    result = audio_model.predict(audio_data).tolist()
    return result[0]


def multi_modal_predict(text, audio, sr, start, end):
    text_result = text_predict(text)
    audio_result = audio_predict(audio, sr, start, end)

    text_result = np.array(text_result)
    audio_result = np.array(audio_result)

    text_result -= min(text_result)
    if (sum(text_result) < 10):
        text_result += (10 - sum(text_result))
    for i in range(0, 4):
        text_result[i] /= sum(text_result)

    audio_result /= sum(audio_result)
    audio_result *=0.58

    result = []
    for i in range(0,4):
        result.append(text_result[i] + audio_result[i])
    label = result.index(max(result))
    return label