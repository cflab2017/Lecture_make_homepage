// ===================================================
// 강의 04 예제 — Express 기초: HTML 파일 서빙
// 실행: node app.js
// 접속: http://localhost:3000
//
// 사전 준비:
//   npm init -y
//   npm install express
// ===================================================

const express = require('express');
const path = require('path');

// Express 앱 생성
const app = express();
const PORT = 3000;

// ① 정적 파일 제공 미들웨어 — public 폴더의 파일을 자동으로 제공
app.use(express.static(path.join(__dirname, 'public')));

// ② 로그 미들웨어 — 모든 요청을 콘솔에 출력
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString('ko-KR');
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next(); // 다음 미들웨어/라우트로 넘김
});

// ③ JSON/폼 데이터 파싱 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ④ 라우트 정의
// 홈 페이지
app.get('/', (req, res) => {
  // sendFile로 HTML 파일 직접 전송
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 소개 페이지
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// 연락처 페이지
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// ⑤ 연락처 폼 제출 처리 (POST)
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body; // 폼 데이터 추출
  console.log('\n--- 연락처 폼 수신 ---');
  console.log('이름:', name);
  console.log('이메일:', email);
  console.log('메시지:', message);

  // 실제로는 이메일 발송 또는 DB 저장
  res.send(`
    <h2>감사합니다, ${name}님!</h2>
    <p>메시지가 성공적으로 전달되었습니다.</p>
    <a href="/">홈으로 돌아가기</a>
  `);
});

// ⑥ API 엔드포인트 — 사이트 정보 반환 (JSON)
app.get('/api/info', (req, res) => {
  res.json({
    siteName: 'My Express Site',
    version: '1.0.0',
    pages: ['/', '/about', '/contact'],
    serverTime: new Date().toISOString(),
  });
});

// ⑦ 404 처리 — 존재하지 않는 경로 접근 시
app.use((req, res) => {
  res.status(404).send(`
    <h1>404 - 페이지를 찾을 수 없습니다</h1>
    <p>요청하신 페이지 <strong>${req.url}</strong>가 존재하지 않습니다.</p>
    <a href="/">홈으로 돌아가기</a>
  `);
});

// ⑧ 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 시작되었습니다: http://localhost:${PORT}`);
  console.log('종료하려면 Ctrl+C를 누르세요.');
});
