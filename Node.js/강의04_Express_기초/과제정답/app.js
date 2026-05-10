// ===================================================
// 과제 04 정답 — 개인 홈페이지 서버
// 실행: node app.js
// 접속: http://localhost:3000
// ===================================================

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ① 방문자 카운터 (메모리에 저장 — 서버 재시작 시 초기화)
let visitorCount = 0;

// ② 정적 파일 미들웨어 — public 폴더 전체를 정적 파일로 제공
app.use(express.static(path.join(__dirname, 'public')));

// ③ 요청 로그 미들웨어
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString('ko-KR')}] ${req.method} ${req.url}`);
  next();
});

// ④ 방문자 카운터 증가 미들웨어 (HTML 페이지 요청 시만)
app.use((req, res, next) => {
  // 정적 리소스(CSS, JS, 이미지)는 카운트 제외
  if (!req.url.includes('.')) {
    visitorCount++;
  }
  next();
});

// ⑤ 페이지 라우트 — HTML 파일 서빙
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/portfolio', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'portfolio.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// ⑥ API 엔드포인트 — 페이지 목록 반환
app.get('/api/pages', (req, res) => {
  res.json({
    pages: [
      { path: '/', title: '홈' },
      { path: '/about', title: '소개' },
      { path: '/portfolio', title: '포트폴리오' },
      { path: '/contact', title: '연락처' },
    ],
    total: 4,
  });
});

// ⑦ API 엔드포인트 — 현재 시간 반환
app.get('/api/time', (req, res) => {
  res.json({
    serverTime: new Date().toISOString(),
    localTime: new Date().toLocaleString('ko-KR'),
    visitorCount, // 누적 방문자 수
  });
});

// ⑧ 404 처리 — 앞의 모든 라우트에서 처리되지 않은 요청
app.use((req, res) => {
  // 상태 코드 404와 함께 404.html 파일 응답
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ⑨ 서버 시작
app.listen(PORT, () => {
  console.log(`개인 홈페이지 서버가 시작되었습니다!`);
  console.log(`접속 주소: http://localhost:${PORT}`);
  console.log('종료: Ctrl+C');
});
