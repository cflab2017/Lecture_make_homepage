// ============================================
// 강의02 예제: Express CSRF 토큰 미들웨어 구현
// ============================================
// 실행: npm install express express-session && node server.js
// ============================================

const express = require('express');
const session = require('express-session');
const crypto  = require('crypto');

const app = express();

// JSON + URL 인코딩 바디 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────
// 1. 세션 설정
//    secret: 세션 쿠키 서명에 사용 (반드시 환경변수로 관리)
// ─────────────────────────────────────────
app.use(session({
    secret:            process.env.SESSION_SECRET || 'dev-secret-change-in-prod',
    resave:            false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,    // XSS로 쿠키 탈취 방지
        secure:   false,   // HTTPS 환경에서는 true로 설정
        sameSite: 'Lax',   // CSRF 기본 방어
        maxAge:   30 * 60 * 1000, // 30분
    },
}));

// ─────────────────────────────────────────
// 2. CSRF 토큰 생성 미들웨어
//    모든 요청에서 세션에 CSRF 토큰을 생성/유지
// ─────────────────────────────────────────
function generateCsrfToken(req, res, next) {
    // 세션에 토큰이 없으면 새로 생성
    if (!req.session.csrfToken) {
        // crypto.randomBytes: 암호학적으로 안전한 랜덤값
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    next();
}
app.use(generateCsrfToken);

// ─────────────────────────────────────────
// 3. CSRF 토큰 검증 미들웨어
//    상태 변경 요청(POST/PUT/DELETE)에만 적용
// ─────────────────────────────────────────
function verifyCsrfToken(req, res, next) {
    // GET, HEAD, OPTIONS는 상태를 변경하지 않으므로 건너뜀
    if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        return next();
    }

    // 요청에서 CSRF 토큰 추출 (폼 바디 또는 헤더)
    const submittedToken = req.body._csrf || req.headers['x-csrf-token'];
    const storedToken    = req.session.csrfToken;

    // 토큰 비교 (timingSafeEqual: 타이밍 공격 방지)
    const isValid = submittedToken && storedToken &&
        crypto.timingSafeEqual(
            Buffer.from(submittedToken, 'hex'),
            Buffer.from(storedToken,    'hex')
        );

    if (!isValid) {
        return res.status(403).json({
            error: 'CSRF 토큰이 유효하지 않습니다. 페이지를 새로고침 후 다시 시도하세요.'
        });
    }

    next();
}

// ─────────────────────────────────────────
// 4. 라우트
// ─────────────────────────────────────────

// GET / — 로그인 폼 페이지
app.get('/', (req, res) => {
    const csrfToken = req.session.csrfToken;

    // HTML에 CSRF 토큰을 hidden input으로 포함
    // 공격자의 사이트에서는 이 토큰을 알 수 없음
    res.send(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>CSRF 방어 예제</title>
            <style>
                body { font-family: sans-serif; max-width: 500px; margin: 40px auto; padding: 0 20px; }
                input { display: block; width: 100%; margin: 8px 0; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
                button { padding: 10px 20px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer; }
                .info { background: #e8f4fd; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 0.9rem; }
            </style>
        </head>
        <body>
            <h1>CSRF 방어 예제</h1>
            <div class="info">
                CSRF 토큰이 hidden input으로 포함됩니다.<br>
                개발자 도구에서 확인: <code>input[name="_csrf"]</code>
            </div>

            <form method="POST" action="/transfer">
                <!-- CSRF 토큰: 숨겨진 필드로 포함 -->
                <input type="hidden" name="_csrf" value="${csrfToken}">

                <label>수신자 계좌번호</label>
                <input type="text" name="to" placeholder="123-456-7890" required>

                <label>금액 (원)</label>
                <input type="number" name="amount" placeholder="10000" required>

                <button type="submit">송금하기</button>
            </form>

            <hr style="margin: 30px 0">

            <h2>CSRF 공격 시뮬레이션</h2>
            <p>아래 버튼은 CSRF 토큰 없이 요청합니다 (403 에러가 발생해야 함):</p>
            <button onclick="simulateAttack()">악성 요청 시뮬레이션</button>
            <div id="attack-result" style="margin-top: 12px; color: red;"></div>

            <script>
                async function simulateAttack() {
                    // CSRF 토큰 없이 POST 요청 → 서버에서 403 반환
                    const res = await fetch('/transfer', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ to: '악성계좌', amount: 999999 })
                        // _csrf 토큰 없음!
                    });
                    const data = await res.json();
                    document.getElementById('attack-result').textContent =
                        '서버 응답 (' + res.status + '): ' + JSON.stringify(data);
                }
            </script>
        </body>
        </html>
    `);
});

// POST /transfer — 송금 처리 (CSRF 검증 적용)
app.post('/transfer', verifyCsrfToken, (req, res) => {
    const { to, amount } = req.body;

    if (!to || !amount) {
        return res.status(400).json({ error: '수신자와 금액을 입력해주세요.' });
    }

    // 실제로는 DB에서 잔액 확인, 트랜잭션 처리 등
    console.log(`송금 처리: ${to}에게 ${amount}원`);

    // 폼 제출인 경우 리다이렉트, API 호출인 경우 JSON 반환
    if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
        res.send(`
            <h2>송금 완료</h2>
            <p>${to}에게 ${Number(amount).toLocaleString()}원을 송금했습니다.</p>
            <a href="/">돌아가기</a>
        `);
    } else {
        res.json({ success: true, message: '송금 완료' });
    }
});

// ─────────────────────────────────────────
// 5. 서버 시작
// ─────────────────────────────────────────
app.listen(3000, () => {
    console.log('CSRF 방어 예제 서버: http://localhost:3000');
});
