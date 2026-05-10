# 강의 06 — 파일 DB (JSON 파일 영속화)

## 1. 왜 JSON 파일 DB가 필요한가?

지금까지 만든 API는 데이터를 메모리(배열)에 저장했습니다.
서버를 재시작하면 모든 데이터가 사라집니다.

JSON 파일을 활용하면 서버를 재시작해도 데이터가 유지됩니다.

```
요청 → Express → JSON 파일 읽기 → 처리 → JSON 파일 쓰기 → 응답
```

---

## 2. JSON 파일로 데이터 읽기/쓰기

```js
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

// 데이터 읽기 헬퍼 함수
function readDB() {
  if (!fs.existsSync(DB_PATH)) return []; // 파일 없으면 빈 배열
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw); // JSON 문자열 → 객체
}

// 데이터 쓰기 헬퍼 함수
function writeDB(data) {
  const json = JSON.stringify(data, null, 2); // 보기 좋게 들여쓰기
  fs.writeFileSync(DB_PATH, json, 'utf-8');
}
```

---

## 3. .env와 dotenv

환경 변수를 `.env` 파일에서 관리합니다.

```bash
npm install dotenv
```

### .env 파일

```
PORT=3000
NODE_ENV=development
DB_PATH=./data/db.json
```

### 사용 방법

```js
// 반드시 파일 맨 위에 추가
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;

console.log(PORT);     // 3000
console.log(NODE_ENV); // 'development'
```

> `.env` 파일은 `.gitignore`에 추가하여 git에 올리지 않습니다!

```gitignore
node_modules/
.env
data/
```

---

## 4. 환경 변수 활용

| 변수 | 용도 |
|------|------|
| `PORT` | 서버 포트 번호 |
| `NODE_ENV` | 환경 구분 (development/production) |
| `DB_PATH` | 데이터 파일 경로 |
| `JWT_SECRET` | 인증 시크릿 키 |

---

## 5. 데이터 폴더 구조

```
프로젝트/
├── app.js
├── .env
├── .gitignore
├── package.json
└── data/
    └── contacts.json   ← 자동 생성됨
```

---

## 학습 포인트 정리

| 개념 | 설명 |
|------|------|
| JSON 파일 DB | fs로 JSON을 읽고 써서 데이터 영속화 |
| `readFileSync` + `JSON.parse` | 파일 읽어서 객체로 변환 |
| `JSON.stringify` + `writeFileSync` | 객체를 JSON 파일로 저장 |
| dotenv | `.env` 파일의 환경 변수를 `process.env`에 로드 |
| `.gitignore` | `.env`, `node_modules`, `data/` 제외 |
