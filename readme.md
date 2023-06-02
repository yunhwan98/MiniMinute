# Mini Minute

## 프로젝트 설명

![miniminute](https://user-images.githubusercontent.com/79241793/227952472-cb2e2046-1d99-4a93-aa82-2a1b5c2a6a43.png)

## _Miniminute은?_

<br>
참가자들의 회의 내용을 대화 형식으로 저장하고

텍스트와 음성을 기반을 한 감성 인식을 통해

참가자에게 피드백을 제시하는 **_감정인식 AI회의록_**
<br>

---

## 팀원

| 이승우(팀장) | 허서영 | 박윤환 | 문지원 |
| --- | --- | --- | --- |
| 🔧Backend + AI | 🔧Backend | 💻Frontend | 💻Frontend |
| - 감정인식, 키워드, 문서요약, 공격 발언 감지<br>- 말빠르기 계산 기능 구현<br>- 전반적인 피드백 내용 설정| - DB, 장고 orm 설계 <br>- 음성인식 관련 기능 구현 <br>- 회의록 생성 및 북마크/검색/공유 | - UI 설계<br>- 북마크, 감정인식 페이지 구현<br>- 시작, 로그인, 프로필, 회의록(생성, 수정) 페이지 구현| - UI 설계<br>- 디렉토리 관련 기능 구현<br>-  홈/회의록 목록/내용정리/회의록(생성, 수정, 삭제) 페이지 구현 |

## 📝 논리 구성도

![논리구성도](https://user-images.githubusercontent.com/79241793/227952713-19d37215-dd38-4b29-a73e-68d46e11769c.png)

## ⚙ 시스템 아키텍처

![아키텍쳐](https://user-images.githubusercontent.com/79241793/227952776-8ac51e99-8db8-4cd9-9b2d-163a198fb6a6.png)

## 🛠️ 사용 기술 및 라이브러리

<br/>

### Frontend

<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white"> <img src="https://img.shields.io/badge/React Router-CA4245?style=for-the-badge&logo=React Router&logoColor=white"> <img src="https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=MUI&logoColor=white"> <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=Bootstrap&logoColor=white">

### Backend

<img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=Django&logoColor=white"> <img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=MariaDB&logoColor=white">

### AI

<img src="https://img.shields.io/badge/AWS Transcribe-FFCA28?style=for-the-badge&logo=AWS Transcribe&logoColor=white"><img src="https://img.shields.io/badge/Pytorch-EE4C2C?style=for-the-badge&logo=Pytorch&logoColor=white"><img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=TensorFlow&logoColor=white">

#

## 🎮 주요 기능

<br/>

### 로그인 기능

- 회원가입한 e-mail과 pw를 통해 로그인을 합니다.
- e-mail과 pw가 일치할 경우 BE에서 Token을 부여받고, 토근이 유효한 경우 로그인을 진행합니다.
  <img width="1280" alt="로그인" src="https://user-images.githubusercontent.com/79241793/227953345-51c8c644-5e83-4ee1-9aa5-9877c5016c25.png">
  <br/>

### 회의록 생성 기능

- 새로운 회의록을 생성하는 기능입니다.
- 회의록 관련된 정보(주제, 날짜, 장소, 설명)를 입력하여 생성합니다.
  <img width="1274" alt="회의록 생성" src="https://user-images.githubusercontent.com/79241793/227953076-33c443df-11a8-4ab7-8de8-6cccc3a58a08.png">
  <br/>

### 음성 파일 업로드 기능

- 선택한 음성 파일을 업로드 합니다.

<img width="1285" alt="파일 업로드" src="https://user-images.githubusercontent.com/79241793/227953081-b973abe6-18fb-4f8c-97fa-401ef62ce9f1.png">

<br/>

### 음성 인식 및 감정 인식 기능

- 업로드 된 음성파일을 문자로 변환하고, 목소리를 식별하여 화자를 구분해줍니다.
- 이 과정에서 Tex +Audio 멀티 모달 감정인식을 진행하여 대화별 감정을 표시해줍니다.

<img width="1285" alt="음성인식" src="https://user-images.githubusercontent.com/79241793/227953084-9d1e5fbd-6c98-4649-8a93-c390e5e7228b.png">

- 참가자들의 이름 변경이 가능하고 '나'를 지정해줄 수 있습니다.
  <img width="1278" alt="나 지정" src="https://user-images.githubusercontent.com/79241793/227953927-178c0a4c-c51b-4330-b8c1-020b4a2a532d.png">

- 감정 별로 대화를 분류할 수 있습니다.
  <img width="1278" alt="감정별로 살펴보기" src="https://user-images.githubusercontent.com/79241793/227954008-c21dcd2b-0ccf-446b-a907-5d967c2766c8.png">

<br/>

### 회의록 대화 수정 기능

- 잘 못 인식된 대화 부분을 수정 가능합니다.
  <img width="1286" alt="수정 기능" src="https://user-images.githubusercontent.com/79241793/227954247-a8a6d9a8-2c4c-4252-95e6-8fa3fc6837b3.png">

### 북마크 기능

- 중요하다고 생각하는 대화 부분을 북마크로 추가할 수 있는 기능입니다.
  <img width="1288" alt="북마크 추가" src="https://user-images.githubusercontent.com/79241793/227954374-f8ea8efa-6a70-4935-8acb-9eeeb1dee336.png">

- 북마크 클릭 시, 대화와 음성 파일이 해당 위치로 이동합니다.
  <img width="1282" alt="북마크 클릭시 이동" src="https://user-images.githubusercontent.com/79241793/227954506-23a8824c-7991-41f1-a6d9-84ac3f3675e2.png">

### 회의록 공유 기능

- 공유하고 싶은 회의록에서 공유코드를 생성할 수 있습니다.
  <img width="1294" alt="회의록 공유코드 생성" src="https://user-images.githubusercontent.com/79241793/227954584-3fcb260e-b25a-405e-9e24-5abe87740919.png">

- 공유를 받은 코드를 통해 회의록에 참여할 수 있습니다.
  <img width="1284" alt="공유코드로 회의록 생성" src="https://user-images.githubusercontent.com/79241793/227954660-4c5c899e-9adc-4384-8a7f-24148bacb1cc.png">
  <img width="1278" alt="공유코드로 생성된 회의록" src="https://user-images.githubusercontent.com/79241793/227954689-b3959ca1-fcf6-478b-8592-a1760ff4e3a2.png">

### 회의록 검색 기능

- 회의록 이름 또는 내용을 검색할 수 있습니다.
  <img width="1284" alt="회의록 검색" src="https://user-images.githubusercontent.com/79241793/227954789-8e9872b1-fbfe-4ff9-a82b-7e75526df559.png">

### 회의록 내용 정리

- 회의록 키워드를 분석해주고, 회의의 내용을 요약해줍니다.
  <img width="1281" alt="키워드 분석 및 요약" src="https://user-images.githubusercontent.com/79241793/227954844-9d69d290-e7df-486d-9b4f-60fd0209db4a.png">

### 회의록 감정 분석

- 사용자의 감정을 분석해주고 한 줄로 코멘트 해줍니다
- 전체적인 회의의 감정 분포와 사용자의 감정분포를 나타내줍니다.
  <img width="1286" alt="피드백 및 감정분포" src="https://user-images.githubusercontent.com/79241793/227955073-8cda8b1a-eb26-407a-87f9-7f4771149717.png">

- 회의에서 문제가 되는 발언을 감지합니다.
  <img width="1275" alt="문제발언 인식" src="https://user-images.githubusercontent.com/79241793/227955081-aa20bd4f-394b-4339-bef1-feb56ee25ac2.png">

- 사용자의 말 빠르기를 나타내줍니다.
  <img width="1281" alt="말빠르기 평가" src="https://user-images.githubusercontent.com/79241793/227955084-46acf343-99d7-409c-82c1-ad9254d6cc13.png">

## 💡새롭게 배운 점

<br/>

> ✔️ : 소통과 협업의 중요성

- 첫 협업 프로젝트여서, 담당하는 파트의 분배가 애매모호 했고 서로의 파트에 대해 이해도가 떨어졌습니다.

- 많은 회의 끝에 노션과 디스코드를 이용하여 회의시간 이외에도 소통이 가능해져 프로젝트가 수월하게 진행되었습니다.

> ✔️ : 재사용 가능한 컴포넌트를 사용하기

- 웹 페이지를 제작하다보면 header나 nav같이 중복되는 부분들이 많았습니다. 이럴 때 마다 기존에 제작하였던 header, nav 컴포넌트를 이용하여 재사용을 했습니다.
- 기초적으로 뼈대가 되는 컴포넌트 설계를 잘 해놓으면 빠르게 개발을 진행할 수 있다는 점을 알게되었습니다.

> ✔️ : 다양한 라이브러리 사용

- 프로젝트를 진행하면서, 하나하나 처음부터 구현하기 어려운 부분들이 있었습니다.(ex 차트, 오디오 플레이어, 아이콘,)
- mui/icons-material, react-h5-audio-player, apexcharts 등 외부 라이브러리를 이용하며 이를 구현할 필요없이, 설치를 통해 상황에 맞게 사용했습니다.
- 다양한 라이브러리들을 의도한 바에 맞게 적절히 사용하는 것이 프론트엔드 개발자에게 꼭 필요하다고 생각이 들었습니다.

- 블로깅 (https://fordev-yunhwan.tistory.com/entry/%EA%B7%B8%EB%9E%98%ED%94%84%EA%B7%B8%EB%A6%AC%EA%B8%B0-Apexcharts)

## 🧑🏻‍💻 느낀 점

<br/>

> 😥 : 학습하며 개발과정 중 어려웠던 부분

- 다른 파트와의 협업이 어려웠습니다. REST API를 이용한 동작에서도 백엔드 파트와 많은 소통을 해야했고, 에러가 발생할 때 어느쪽에서 문제가 생긴것인지 찾는 것이 어려웠습니다.

- 외부 라이브러리를 사용할 때마다 공식문서나 사용 예시가 부족해서 사용법을 익히는 데 어려움을 겪었습니다.

- 너무 당연한 소리이지만, 에러의 원인을 파악하지 못할 때가 제일 어려웠습니다.
  콘솔의 에러를 참고하여도 풀리지 않는 에러들로 새벽까지 붙잡고 있는 경우가 많아서, 개발을 하면서 가장 어려웠던 부분 같습니다.

- 에러 블로깅
  <br>(https://fordev-yunhwan.tistory.com/entry/%EC%98%A4%EB%A5%98%EB%85%B8%ED%8A%B8)
  <br>(https://fordev-yunhwan.tistory.com/entry/%EC%98%A4%EB%A5%98%EC%9D%BC%EC%A7%80)
  <br>(https://fordev-yunhwan.tistory.com/entry/%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)

<br />

> 😥 : 아쉬운 부분

- React의 이해도가 부족하여, useState, useEffect 등 간단한 React Hook 밖에 사용하지 못했습니다. 추가적인 공부를 통해서 부족한 부분을 매꿔야겠습니다.


