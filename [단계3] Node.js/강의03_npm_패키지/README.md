# 강의 03 — npm 패키지

## 1. package.json 구조

`package.json`은 Node.js 프로젝트의 설정 파일로, 프로젝트 정보와 의존성을 관리합니다.

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "내 첫 Node.js 프로젝트",
  "main": "index.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "node test.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dayjs": "^1.11.10"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## 2. npm 기본 명령어

```bash
# 프로젝트 초기화 (package.json 생성)
npm init          # 질문에 답하며 생성
npm init -y       # 기본값으로 자동 생성

# 패키지 설치
npm install express          # 프로덕션 의존성 설치
npm install --save-dev nodemon  # 개발 의존성 설치
npm install -g typescript    # 전역 설치

# 설치된 패키지 목록
npm list
npm list --depth=0   # 최상위만

# 패키지 제거
npm uninstall express

# 스크립트 실행
npm run dev
npm run start
npm start    # start는 run 생략 가능
```

### dependencies vs devDependencies

| 구분 | 설명 | 예시 |
|------|------|------|
| `dependencies` | 실제 실행에 필요 | express, dayjs |
| `devDependencies` | 개발 중에만 필요 | nodemon, eslint |

---

## 3. npx

패키지를 설치하지 않고 바로 실행하는 명령어입니다.

```bash
npx create-react-app my-app    # 패키지 설치 없이 바로 실행
npx cowsay "Hello, Node!"      # 일회성 실행
```

---

## 4. nodemon

파일이 변경될 때 서버를 자동으로 재시작해주는 개발 도구입니다.

```bash
# 설치
npm install --save-dev nodemon

# package.json scripts에 추가
{
  "scripts": {
    "dev": "nodemon server.js"
  }
}

# 실행
npm run dev
```

---

## 5. dayjs — 날짜/시간 라이브러리

JavaScript 내장 `Date` 객체보다 훨씬 사용하기 편리한 날짜 라이브러리입니다.

```bash
npm install dayjs
```

```js
const dayjs = require('dayjs');

dayjs()                         // 현재 시각
dayjs('2025-01-15')             // 특정 날짜

dayjs().format('YYYY-MM-DD')            // '2025-01-15'
dayjs().format('YYYY년 MM월 DD일')      // '2025년 01월 15일'
dayjs().format('HH:mm:ss')             // '14:30:00'

dayjs().add(7, 'day')           // 7일 후
dayjs().subtract(1, 'month')    // 1달 전
dayjs().diff(dayjs('2000-01-01'), 'year')  // 나이 계산
```

---

## 6. .gitignore

`node_modules` 폴더는 용량이 크고, `npm install`로 언제든 복원 가능하므로 git에 올리지 않습니다.

```gitignore
# .gitignore
node_modules/
.env
*.log
```

---

## 학습 포인트 정리

| 개념 | 설명 |
|------|------|
| `package.json` | 프로젝트 설정 및 의존성 관리 파일 |
| `npm install` | 패키지 설치 (package.json 기반) |
| `devDependencies` | 개발 환경에서만 필요한 패키지 |
| `nodemon` | 파일 변경 시 서버 자동 재시작 |
| `dayjs` | 날짜/시간 처리 라이브러리 |
| `.gitignore` | node_modules를 git에서 제외 |
