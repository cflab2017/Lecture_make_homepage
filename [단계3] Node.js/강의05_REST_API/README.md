# 강의 05 — REST API

## 1. REST란?

REST(Representational State Transfer)는 웹 API를 설계하는 아키텍처 스타일입니다.

### 핵심 개념

| 개념 | 설명 | 예시 |
|------|------|------|
| **자원(Resource)** | API가 다루는 데이터 | 할 일, 유저, 상품 |
| **행위(Verb)** | 자원에 대한 작업 | 조회, 생성, 수정, 삭제 |
| **표현(Representation)** | 데이터 형식 | JSON |

### REST URL 설계 원칙

```
자원은 명사, 복수형으로 표현
행위는 HTTP 메서드로 표현

GET    /todos       → 할 일 목록 조회
GET    /todos/1     → 특정 할 일 조회
POST   /todos       → 할 일 생성
PUT    /todos/1     → 할 일 전체 수정
PATCH  /todos/1     → 할 일 일부 수정
DELETE /todos/1     → 할 일 삭제
```

---

## 2. HTTP 메서드별 역할

| 메서드 | 역할 | 멱등성 | 바디 |
|--------|------|--------|------|
| `GET` | 조회 | O | X |
| `POST` | 생성 | X | O |
| `PUT` | 전체 수정 | O | O |
| `PATCH` | 일부 수정 | O | O |
| `DELETE` | 삭제 | O | X |

---

## 3. HTTP 상태 코드

```
2xx 성공
  200 OK              → 요청 성공 (조회, 수정, 삭제)
  201 Created         → 생성 성공 (POST 응답)
  204 No Content      → 성공이지만 응답 바디 없음

4xx 클라이언트 오류
  400 Bad Request     → 잘못된 요청 (유효성 오류)
  401 Unauthorized    → 인증 필요
  403 Forbidden       → 권한 없음
  404 Not Found       → 자원 없음

5xx 서버 오류
  500 Internal Server Error → 서버 내부 오류
```

```js
// Express에서 상태 코드 지정
res.status(201).json({ id: 1, message: '생성 완료' });
res.status(404).json({ error: '항목을 찾을 수 없습니다.' });
res.status(500).json({ error: '서버 오류가 발생했습니다.' });
```

---

## 4. JSON 응답

```js
// Content-Type: application/json 자동 설정
res.json({
  success: true,
  data: { id: 1, title: '할 일 1' },
});

// 배열 응답
res.json([
  { id: 1, title: '할 일 1' },
  { id: 2, title: '할 일 2' },
]);
```

---

## 5. express.json() 미들웨어

POST/PUT 요청에서 JSON 바디를 읽으려면 반드시 추가해야 합니다.

```js
app.use(express.json());

app.post('/todos', (req, res) => {
  const { title, done } = req.body; // JSON 바디에서 추출
  console.log(title, done);
});
```

---

## 6. API 테스트 도구

### Thunder Client (VS Code 확장)
VS Code에서 바로 API 테스트 가능

### curl (터미널)

```bash
# GET
curl http://localhost:3000/api/todos

# POST
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Node.js 공부", "done": false}'

# DELETE
curl -X DELETE http://localhost:3000/api/todos/1
```

---

## 학습 포인트 정리

| 개념 | 내용 |
|------|------|
| REST | 자원, 행위, 표현 기반의 API 설계 |
| HTTP 메서드 | GET/POST/PUT/PATCH/DELETE |
| 상태 코드 | 200/201/400/404/500 |
| `express.json()` | JSON 요청 바디 파싱 미들웨어 |
