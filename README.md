# Todo Backend

Node.js 기반 Todo 백엔드 프로젝트입니다.

## 요구 사항

- Node.js 24 이상
- npm

## 시작하기

프로젝트 루트에서 의존성을 설치합니다.

```powershell
npm.cmd install
```

`.env.example`을 `.env`로 복사한 뒤, `MONGODB_URI`에 MongoDB 연결 문자열을 설정합니다. 로컬 MongoDB를 사용하는 경우 기본 예시를 그대로 사용할 수 있습니다.
서버는 실행 위치와 관계없이 프로젝트 폴더의 `.env`를 읽으며, `.env`의 `MONGODB_URI`가 이미 설정된 셸 환경변수보다 우선합니다.

```powershell
Copy-Item .env.example .env
```

PowerShell 실행 정책 때문에 `npm` 명령이 차단되는 환경에서는 `npm` 대신 `npm.cmd`를 사용하세요.

## 서버 실행

```powershell
npm.cmd start
```

MongoDB 연결에 성공하면 `연결 성공`이 출력되고, 서버가 포트 5000번에서 실행됩니다. `http://localhost:5000/`에 접속하면 서버 상태를 확인할 수 있습니다.

## 할 일 저장 API

`POST /todos` 요청으로 할 일을 저장합니다. MongoDB의 `todos` 컬렉션에 저장되며, 제목은 필수이고 최대 200자입니다. `date`는 `YYYY-MM-DD` 형식의 날짜이며 생략하면 UTC 기준 오늘 날짜로 저장됩니다.

```json
{
  "title": "장보기",
  "date": "2026-10-12",
  "completed": false
}
```

`date`와 `completed`는 생략할 수 있습니다. `completed`는 생략 시 `false`로 저장됩니다. `createdAt`과 `updatedAt`은 서버가 자동으로 저장합니다. 성공하면 `201 Created`와 함께 저장된 할 일을 반환합니다. 제목이 비어 있거나 200자를 넘으면, 날짜가 유효한 `YYYY-MM-DD`가 아니면, 또는 `completed`가 불리언이 아니면 `400 Bad Request`를 반환합니다.

## 할 일 목록 조회 API

`GET /todos` 요청으로 저장된 할 일 목록을 생성 시각 최신순으로 조회합니다. `date` 쿼리 파라미터를 지정하면 해당 날짜의 할 일만 조회합니다. 성공하면 `200 OK`와 함께 할 일 배열을 반환합니다. 날짜 형식이 올바르지 않으면 `400 Bad Request`를 반환합니다.

```text
GET /todos?date=2026-10-12
```

## 할 일 수정 API

`PATCH /todos/:id` 요청으로 해당 ID의 할 일 제목 또는 날짜를 수정합니다. `title`, `date` 중 하나 이상을 요청 본문에 전달합니다. 성공하면 `200 OK`와 수정된 할 일을 반환합니다. ID 형식, 제목 또는 날짜가 올바르지 않으면 `400 Bad Request`, 해당 ID의 할 일이 없으면 `404 Not Found`를 반환합니다.

```json
{
  "date": "2026-10-13"
}
```

## 프론트엔드 호출 예시

```js
const API_URL = "http://localhost:5000/todos";

// 특정 날짜의 할 일 조회
const response = await fetch(`${API_URL}?date=2026-10-12`);
const todos = await response.json();

// 날짜를 지정해 새 할 일 추가 (date 생략 시 서버의 UTC 오늘 날짜)
const createdResponse = await fetch(API_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "장보기", date: "2026-10-12" }),
});
const createdTodo = await createdResponse.json();

// 기존 할 일의 날짜 변경
const updatedResponse = await fetch(`${API_URL}/${createdTodo._id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ date: "2026-10-13" }),
});
const updatedTodo = await updatedResponse.json();
```

각 Todo 응답에는 `date` 문자열이 포함됩니다. 현재 날짜 필드 추가 전부터 존재한 MongoDB 문서에는 `date`가 자동으로 채워지지 않으므로, 날짜별 조회에 포함시키려면 날짜를 수정하거나 해당 문서를 업데이트해야 합니다.

## 할 일 완료 상태 변경 API

`PATCH /todos/:id/completed` 요청으로 완료 여부를 변경합니다. 요청 본문에 불리언 `completed`를 전달합니다.

```json
{
  "completed": true
}
```

성공하면 `200 OK`와 완료 상태가 변경된 할 일을 반환합니다. ID가 올바르지 않거나 `completed`가 불리언이 아니면 `400 Bad Request`, 해당 ID의 할 일이 없으면 `404 Not Found`를 반환합니다.

## 할 일 삭제 API

`DELETE /todos/:id` 요청으로 해당 ID의 할 일을 삭제합니다. 성공하면 `200 OK`와 삭제된 할 일을 반환합니다. ID 형식이 올바르지 않으면 `400 Bad Request`, 해당 ID의 할 일이 없으면 `404 Not Found`를 반환합니다.

## 테스트

```powershell
npm.cmd test
```

테스트는 Node.js 내장 테스트 러너(`node --test`)로 실행됩니다.
