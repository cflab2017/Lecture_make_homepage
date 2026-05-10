// ===================================================
// 강의 06 예제 — JSON 파일 기반 연락처 API
// 실행: node app.js
// 테스트: http://localhost:3000/api/contacts
//
// 사전 준비:
//   npm init -y
//   npm install express dotenv
//   .env 파일 생성 후 PORT=3000 작성
// ===================================================

// dotenv 설정 — .env 파일의 내용을 process.env에 로드
// 반드시 파일 맨 위에 작성해야 함
require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // 환경 변수 우선, 없으면 3000

app.use(express.json());

// ① 데이터 파일 경로 설정
const DATA_DIR = path.join(__dirname, 'data');    // 데이터 폴더
const DB_PATH = path.join(DATA_DIR, 'contacts.json'); // JSON 파일 경로

// ② data 폴더가 없으면 자동 생성
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true }); // 중간 폴더도 함께 생성
  console.log('data 폴더 생성 완료');
}

// ③ 헬퍼 함수 — JSON 파일에서 데이터 읽기
function readContacts() {
  // 파일이 없으면 빈 배열 반환 (초기 상태)
  if (!fs.existsSync(DB_PATH)) return [];

  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8'); // 파일 읽기
    return JSON.parse(raw);                        // JSON 파싱
  } catch (err) {
    console.error('DB 읽기 오류:', err.message);
    return []; // 오류 시 빈 배열 반환
  }
}

// ④ 헬퍼 함수 — JSON 파일에 데이터 쓰기
function writeContacts(contacts) {
  // JSON.stringify(data, replacer, 들여쓰기) — 보기 좋게 저장
  const json = JSON.stringify(contacts, null, 2);
  fs.writeFileSync(DB_PATH, json, 'utf-8');
}

// ============================================================
// 연락처 CRUD API
// ============================================================

// GET /api/contacts — 전체 연락처 조회
app.get('/api/contacts', (req, res) => {
  const contacts = readContacts(); // 파일에서 읽기
  res.json({ success: true, count: contacts.length, data: contacts });
});

// GET /api/contacts/:id — 특정 연락처 조회
app.get('/api/contacts/:id', (req, res) => {
  const contacts = readContacts();
  const contact = contacts.find((c) => c.id === Number(req.params.id));

  if (!contact) {
    return res.status(404).json({ success: false, error: '연락처를 찾을 수 없습니다.' });
  }

  res.json({ success: true, data: contact });
});

// POST /api/contacts — 새 연락처 생성
app.post('/api/contacts', (req, res) => {
  const { name, phone, email } = req.body;

  // 이름과 전화번호는 필수
  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      error: 'name과 phone 필드는 필수입니다.',
    });
  }

  const contacts = readContacts(); // 현재 데이터 읽기

  const newContact = {
    id: Date.now(),              // 유닉스 타임스탬프 ID
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : '', // email은 선택
    createdAt: new Date().toISOString(),
  };

  contacts.push(newContact);  // 새 연락처 추가
  writeContacts(contacts);    // 파일에 저장 (영속화!)

  res.status(201).json({
    success: true,
    message: '연락처가 저장되었습니다.',
    data: newContact,
  });
});

// PUT /api/contacts/:id — 연락처 수정
app.put('/api/contacts/:id', (req, res) => {
  const id = Number(req.params.id);
  const contacts = readContacts();
  const index = contacts.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: '연락처를 찾을 수 없습니다.' });
  }

  const { name, phone, email } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, error: 'name과 phone은 필수입니다.' });
  }

  // 기존 데이터 업데이트 (id, createdAt은 유지)
  contacts[index] = {
    ...contacts[index], // 기존 데이터 복사
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : contacts[index].email,
    updatedAt: new Date().toISOString(), // 수정 시각 추가
  };

  writeContacts(contacts); // 파일에 저장

  res.json({ success: true, message: '연락처가 수정되었습니다.', data: contacts[index] });
});

// DELETE /api/contacts/:id — 연락처 삭제
app.delete('/api/contacts/:id', (req, res) => {
  const id = Number(req.params.id);
  const contacts = readContacts();
  const index = contacts.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: '연락처를 찾을 수 없습니다.' });
  }

  const [deleted] = contacts.splice(index, 1); // 삭제
  writeContacts(contacts); // 파일에 저장

  res.json({ success: true, message: '연락처가 삭제되었습니다.', data: deleted });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`연락처 API 서버: http://localhost:${PORT}`);
  console.log(`데이터 저장 경로: ${DB_PATH}`);
  console.log('서버를 재시작해도 데이터가 유지됩니다!');
});
