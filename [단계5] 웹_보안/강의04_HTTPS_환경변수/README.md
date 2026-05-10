# 강의04 — HTTPS와 환경변수 관리

## 학습 목표

- HTTP와 HTTPS의 차이를 이해한다
- 보안 HTTP 헤더를 Express에 설정할 수 있다
- .env 파일로 시크릿을 안전하게 관리할 수 있다
- 시크릿이 유출됐을 때 대응 방법을 안다

---

## 1. HTTP vs HTTPS

```
HTTP  (평문):  클라이언트 ── 비밀번호:abc123 ──────────> 서버
                               ↑ 중간자가 읽을 수 있음

HTTPS (암호화): 클라이언트 ── 5h#@x9!K3m... ──────────> 서버
                               ↑ 암호화됨, 해독 불가
```

### TLS/SSL 인증서

HTTPS는 **TLS(Transport Layer Security)** 프로토콜을 사용합니다.

```
1. 서버가 인증서(공개키)를 클라이언트에 전송
2. 클라이언트가 인증서를 신뢰할 수 있는지 확인 (CA 검증)
3. 대칭키를 안전하게 교환 (TLS Handshake)
4. 이후 통신은 대칭키로 암호화
```

### Let's Encrypt — 무료 인증서

```bash
# Certbot으로 Let's Encrypt 인증서 발급 (Ubuntu)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com

# 자동 갱신 (90일 만료)
sudo certbot renew --dry-run
```

---

## 2. 보안 HTTP 헤더

### 주요 헤더

```js
const express = require('express');
const app = express();

// 직접 설정하는 방법
app.use((req, res, next) => {
    // HSTS: HTTPS만 허용 (1년간)
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    // X-Frame-Options: 클릭재킹 방지 (다른 사이트에서 iframe으로 삽입 불가)
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    // X-Content-Type-Options: MIME 타입 스니핑 방지
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Referrer-Policy: 참조 URL 정보 제한
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Content-Security-Policy: 리소스 출처 제한 (XSS 방어 보조)
    res.setHeader('Content-Security-Policy', "default-src 'self'");

    next();
});
```

### helmet 라이브러리 (권장)

```bash
npm install helmet
```

```js
const helmet = require('helmet');

// 모든 보안 헤더를 한 번에 설정
app.use(helmet());

// 또는 개별 설정
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc:  ["'self'", "https://cdn.example.com"],
        },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true },
}));
```

---

## 3. 환경변수로 시크릿 관리

### 절대 하지 말 것

```js
// ⚠ 하드코딩 — 절대 금지!
const DB_PASSWORD    = 'my_secret_password';
const JWT_SECRET     = 'jwt-secret-key-123';
const API_KEY        = 'sk-abcdefghijk12345';
const MONGODB_URI    = 'mongodb+srv://user:pass@cluster.mongodb.net/db';
```

```json
// package.json에도 시크릿 넣지 말 것!
{
    "scripts": {
        "start": "DB_PASSWORD=secret node app.js"  // ⚠ 노출됨
    }
}
```

### .env 파일 사용

```bash
# .env 파일 (프로젝트 루트)
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=매우긴랜덤문자열여기에
API_KEY=sk-abcdefghijk12345
SESSION_SECRET=또다른랜덤문자열
PORT=3000
```

```js
// .env 로드
require('dotenv').config();

// 환경변수 사용
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('JWT_SECRET이 설정되지 않았습니다!');
    process.exit(1); // 시크릿 없으면 서버 시작 거부
}
```

### .gitignore에 반드시 추가

```gitignore
# .gitignore
.env
.env.local
.env.production
*.pem          # SSL 인증서
node_modules/
```

### .env.example — 템플릿 파일 (Git에 포함)

```bash
# .env.example (실제 값 없이 키 이름만 포함)
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=generate_a_random_string_here
API_KEY=your_api_key_here
SESSION_SECRET=another_random_string
PORT=3000
```

---

## 4. 시크릿 유출 대응

### 즉시 해야 할 일

1. **즉시 키 무효화:** API 키, 비밀번호 즉시 변경
2. **Git 히스토리 정리:** 과거 커밋에서 시크릿 제거
3. **피해 평가:** 유출된 키로 무엇을 할 수 있었는지 확인

```bash
# Git 히스토리에서 시크릿이 포함된 파일 제거
git filter-branch --force --index-filter \
    'git rm --cached --ignore-unmatch .env' \
    --prune-empty --tag-name-filter cat -- --all

# 또는 BFG Repo Cleaner 사용 (더 안전)
bfg --delete-files .env
```

### 예방

```bash
# git-secrets 또는 pre-commit hook으로 커밋 전 검사
npm install -g git-secrets
git secrets --install
git secrets --register-aws  # AWS 키 패턴 등록
```

---

## 예제 파일

- `예제/security-headers.js` — Express 보안 헤더 미들웨어
- `예제/.env.example` — 환경변수 템플릿

### 실행

```bash
cd 예제
npm install
cp .env.example .env
# .env 파일에 실제 값 입력 후
node security-headers.js
```
