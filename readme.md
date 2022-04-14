### 감정인식 회의록 Mini Minute

# Rest API 통신 규칙 
필요 시에 추가나 수정 후 표시 부탁드립니다
<br>
<br>

## Rest HTTP Method

 
| HTTP Method | 설명             |
| ----------- | -----------------|
| GET         | 리소스 조회       |
| POST        | 리소스 생성       |
| PUT         | 리소스 전체 수정  |
| PATCH       | 리소스 부분 수정  |
| DELETE      | 리소스 삭제       |

## HTTP 응답 코드
 
| Code | 설명                 |
| ---- | -------------------- |
| 200  | OK                   |
| 201  | Created              |
| 202  | Accepted             |
| 204  | No Content           |
| 400  | Bad Request          |
| 401  | Unauthorized         |
| 403  | Forbidden            |
| 404  | Not Found            |
| 500  | Internal Server Error|
<br>

## dJango REST API 주소
### 이용 시 주의 사항
> 1. 사용자 개별 정보를 건드릴 때에는 항상 토큰을 같이 실어서 보내야함<br>
> 2. Authorization header에 토큰 실어 보낼 때 : 토큰 값 앞에 jwt + 한 칸 공백 + 토큰 값

### /api

> 토큰 발행, 검증, 갱신 관련 주소

| Path                          | Method | request | response          | Code | 설명              |
| ----------------------------- | ------ | ------- | ------------------| ---- | ----------------- |
|/token|POST|{email, password}|{token}||JWT 토큰 발행|
|/token/verify|POST|{token}|{token}||JWT 토큰 검증|
|/token/refresh|POST|{token}|{token}||JWT 토큰 갱신|

### /rest-auth

> 로그인, 회원가입, 비밀번호 변경 주소

| Path                          | Method | request | response          | Code | 설명              |
| ----------------------------- | ------ | ------- | ------------------| ---- | ----------------- |
|/login|POST|{email, password}|{token, user{<br>pk, username, email,<br>first_name, last_name}}|200 성공<br>400 실패(아이디 비밀번호 확인)|로그인|
|/signup|POST|{email, username,<br>password1, password2}|{token, user{<br>pk, username, email,<br>first_name, last_name}}|201 성공<br>400 실패 (빈칸 or 비밀번호 값이 서로 다름)|회원가입|
|/password/change|POST|{new_password1, new_password2}|{}|200 성공<br>401 실패(토큰 인증 실패)|비밀번호 변경|

### /users

> 회원 정보 관련 주소

| Path                          | Method | request | response          | Code | 설명              |
| ----------------------------- | ------ | ------- | ------------------| ---- | ----------------- |
|/lists|GET|{email, password|{token, user{<br>pk, username, email,<br>first_name, last_name}}|200 성공<br>400 실패(관리자 계정 아님)<br>401 실패(토큰 인증 실패)|회원 목록 전체 조회<br>(관리자 계정 전용)|
|/name/change|PUT|{username}|{id, email, user_profile,<br>password, username,<br>user_sign_up_date,<br>user_access_date}|200 성공<br>400 실패(이름 중복)<br>401 실패(토큰 인증 실패)|회원 이름 변경|
|/email/change|PUT|{email}|{id, email, user_profile,<br>password, username,<br>user_sign_up_date,<br>user_access_date}|200 성공<br>401 실패(토큰 인증 실패)|회원 이메일 변경|
|/withdraw|DELETE|{}|{}|204 성공<br>401 실패(토큰 인증 실패)|회원 탈퇴|

### /directorys

> 디렉토리 정보 관련 주소

| Path                          | Method | request | response          | Code | 설명              |
| ----------------------------- | ------ | ------- | ------------------| ---- | ----------------- |
|/lists|GET|{}|[{dr_id, de_name,<br>dr_pid, user_id}]|200 성공<br>401 실패(토큰 인증 실패)|사용자 디렉토리 목록 조회|
|/lists|POST|{dr_name}|{dr_id, de_name,<br>dr_pid, user_id}|201 성공<br>400 실패(요구되지 않는 필드값)<br>401 실패(토큰 인증 실패)|디렉토리 생성|
|/<int : 디렉토리 번호>|GET|{}|{dr_id, de_name,<br>dr_pid, user_id}|200 성공<br>401 실패(토큰 인증 실패)<br>500 실패(존재하지 않는 디렉토리)|디렉토리 개별 조회|
|/<int : 디렉토리 번호>|PUT|{dr_name}|{dr_id, de_name,<br>dr_pid, user_id}|200 성공<br>400 실패(요구되지 않는 필드값)<br>401 실패(토큰 인증 실패)|디렉토리 이름 수정|
|/<int : 디렉토리 번호>|DELETE|{}|{}|204 성공<br>401 실패(토큰 인증 실패)|디렉토리 삭제|
