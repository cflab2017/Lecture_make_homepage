# 강의 04 — Express 기초

## 1. Express란?

Express는 Node.js의 가장 인기 있는 웹 프레임워크입니다. HTTP 서버를 쉽게 만들 수 있습니다.

```bash
npm install express
```

```js
const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
});
```

---

## 2. 라우팅 (Routing)

URL과 HTTP 메서드에 따라 다른 처리를 하는 것을 라우팅이라고 합니다.

```js
// GET 요청
app.get('/', (req, res) => {
  res.send('홈페이지입니다.');
});

// POST 요청
app.post('/users', (req, res) => {
  res.send('유저 생성');
});

// PUT 요청
app.put('/users/:id', (req, res) => {
  res.send(`유저 ${req.params.id} 수정`);
});

// DELETE 요청
app.delete('/users/:id', (req, res) => {
  res.send(`유저 ${req.params.id} 삭제`);
});
```

---

## 3. req / res 객체

### req (Request) — 요청 정보

```js
req.params    // URL 파라미터: /users/:id → req.params.id
req.query     // 쿼리스트링: /search?q=hello → req.query.q
req.body      // 요청 바디 (express.json() 필요)
req.headers   // 요청 헤더
req.method    // HTTP 메서드 ('GET', 'POST' ...)
req.url       // 요청 URL
```

### res (Response) — 응답 처리

```js
res.send('텍스트 응답')           // 텍스트 응답
res.json({ key: 'value' })        // JSON 응답
res.sendFile('/path/to/file.html') // 파일 응답
res.redirect('/other-page')        // 리다이렉트
res.status(404).send('Not Found') // 상태 코드 지정
res.render('index')                // 템플릿 렌더링 (EJS 등)
```

---

## 4. 미들웨어 (Middleware)

요청과 응답 사이에서 실행되는 함수입니다.

```js
// 모든 요청에 적용
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // 다음 미들웨어로 넘김
});

// JSON 바디 파서 (POST 요청 바디 읽기)
app.use(express.json());

// URL 인코딩 바디 파서 (폼 데이터)
app.use(express.urlencoded({ extended: true }));
```

---

## 5. 정적 파일 제공

HTML, CSS, 이미지 등 정적 파일을 자동으로 제공합니다.

```js
// public 폴더의 파일을 자동으로 제공
app.use(express.static('public'));

// http://localhost:3000/index.html → public/index.html 파일 응답
// http://localhost:3000/css/style.css → public/css/style.css 응답
```

---

## 6. 포트 설정

```js
const PORT = process.env.PORT || 3000; // 환경 변수 또는 기본값 3000

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
```

---

## 학습 포인트 정리

| 개념 | 설명 |
|------|------|
| `app.get/post/put/delete` | HTTP 메서드별 라우트 등록 |
| `req.params` | URL 경로 파라미터 |
| `req.query` | URL 쿼리스트링 |
| `res.send/json/sendFile` | 응답 전송 방법 |
| `app.use()` | 미들웨어 등록 |
| `express.static()` | 정적 파일 제공 |
