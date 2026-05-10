# 강의02 — CSRF 방어와 인증

## 학습 목표

- CSRF 공격의 원리와 시나리오를 이해한다
- SameSite 쿠키로 CSRF를 방어할 수 있다
- CSRF 토큰으로 요청을 검증할 수 있다
- 세션과 JWT의 차이를 이해한다
- 보안 쿠키 속성을 올바르게 설정할 수 있다

---

## 1. CSRF란?

**CSRF (Cross-Site Request Forgery):** 인증된 사용자를 속여 의도하지 않은 요청을 서버에 보내게 하는 공격

### 공격 시나리오

```
1. 피해자가 bank.com에 로그인 (세션 쿠키 저장)
2. 공격자가 evil.com에 악성 코드를 심어둠:
   <form action="https://bank.com/transfer" method="POST">
       <input name="to"     value="공격자계좌">
       <input name="amount" value="1000000">
   </form>
   <script>document.forms[0].submit();</script>
3. 피해자가 evil.com 방문
4. 브라우저가 bank.com에 자동으로 쿠키를 포함하여 POST 전송
5. bank.com은 유효한 세션으로 판단 → 송금 실행!
```

---

## 2. CSRF 방어 방법

### 방법 1: SameSite 쿠키 (현대적 방어)

```js
// SameSite=Strict: 같은 사이트에서의 요청에만 쿠키 전송
res.cookie('sessionId', token, {
    httpOnly: true,
    secure:   true,
    sameSite: 'Strict',  // 다른 사이트에서 오는 요청에 쿠키 없음 → CSRF 차단
});

// SameSite=Lax: Strict보다 덜 엄격 (GET은 허용, POST는 차단)
res.cookie('sessionId', token, { sameSite: 'Lax' });

// SameSite=None: 크로스사이트 허용 (Secure 필수)
res.cookie('sessionId', token, { sameSite: 'None', secure: true });
```

| 값 | 동작 |
|----|------|
| `Strict` | 외부 사이트 링크로 온 GET도 쿠키 없음 (가장 엄격) |
| `Lax` | 외부 GET은 허용, POST 등은 차단 (권장) |
| `None` | 모두 허용 (Secure 필수) |

---

### 방법 2: CSRF 토큰

서버가 랜덤 토큰을 발급하고, 요청마다 검증합니다.

```js
// 1. 토큰 생성 (서버)
const crypto = require('crypto');
const csrfToken = crypto.randomBytes(32).toString('hex');

// 세션에 저장
req.session.csrfToken = csrfToken;

// 2. 토큰을 HTML에 포함 (hidden input)
res.render('form', { csrfToken });
```

```html
<!-- HTML 폼에 숨겨진 토큰 포함 -->
<form method="POST" action="/transfer">
    <input type="hidden" name="_csrf" value="<%= csrfToken %>">
    <input name="amount" type="number">
    <button type="submit">송금</button>
</form>
```

```js
// 3. 요청 시 토큰 검증 (미들웨어)
function csrfProtect(req, res, next) {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const submitted = req.body._csrf || req.headers['x-csrf-token'];
        const stored    = req.session.csrfToken;

        if (!submitted || submitted !== stored) {
            return res.status(403).json({ error: 'CSRF 토큰 검증 실패' });
        }
    }
    next();
}
```

---

## 3. 세션 vs JWT

### 세션 (Session)

```
[클라이언트]              [서버]
   │──── POST /login ────>│
   │                      │ 세션 생성: { userId: 1 }
   │<── Set-Cookie: sid=abc │ 세션 저장소(Redis/DB)에 저장
   │                      │
   │──── GET /profile ──>│ Cookie: sid=abc
   │                      │ 저장소에서 세션 조회 → userId 확인
   │<──── 프로필 데이터 ──│
```

**장점:** 서버에서 즉시 무효화 가능  
**단점:** 저장소 필요, 수평 확장 시 세션 공유 필요

### JWT (JSON Web Token)

```
[클라이언트]              [서버]
   │──── POST /login ────>│
   │                      │ JWT 생성: { userId: 1, exp: ... }
   │<── JWT 토큰 반환 ──── │ (서버에 저장하지 않음)
   │                      │
   │──── GET /profile ──>│ Authorization: Bearer eyJ...
   │                      │ JWT 서명 검증 → userId 확인
   │<──── 프로필 데이터 ──│
```

**장점:** 서버 저장소 불필요, 수평 확장 용이  
**단점:** 토큰 만료 전 무효화 어려움, 토큰이 크면 네트워크 부담

---

## 4. httpOnly / Secure 쿠키

```js
res.cookie('token', value, {
    httpOnly: true,    // JavaScript에서 document.cookie로 접근 불가 → XSS로 쿠키 탈취 방지
    secure:   true,    // HTTPS에서만 전송 → 네트워크 도청 방지
    sameSite: 'Lax',  // CSRF 방어
    maxAge:   7 * 24 * 60 * 60 * 1000, // 7일 (밀리초)
    path:     '/',
});
```

| 속성 | 목적 |
|------|------|
| `httpOnly` | XSS를 통한 쿠키 탈취 방지 |
| `secure` | 네트워크 도청 방지 |
| `sameSite` | CSRF 방지 |
| `maxAge` | 세션 하이재킹 최소화 (짧을수록 안전) |

---

## 예제 파일

- `예제/` — Express CSRF 토큰 미들웨어 구현

### 실행

```bash
cd 예제
npm install
node server.js
# http://localhost:3000
```

---

## 다음 강의

강의03에서는 SQL 인젝션 공격과 Prepared Statement 방어를 학습합니다.
