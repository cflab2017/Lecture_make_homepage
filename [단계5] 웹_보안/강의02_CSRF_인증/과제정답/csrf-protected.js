// ============================================
// 과제02 정답: CSRF 방어된 로그인 폼
// ============================================
// 실행: npm install express express-session && node csrf-protected.js
// ============================================

const express = require('express');
const session = require('express-session');
const crypto  = require('crypto');

const app = express();

// 요청 바디 파싱 (폼 데이터 + JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─────────────────────────────────────────
// 1. 세션 설정
//    실제 서비스: SESSION_SECRET을 .env에서 읽어야 함
// ─────────────────────────────────────────
app.use(session({
    secret:            process.env.SESSION_SECRET || 'change-this-in-production',
    resave:            false,     // 변경 없는 세션은 저장 안 함
    saveUninitialized: false,     // 빈 세션은 저장 안 함
    cookie: {
        httpOnly: true,            // JavaScript에서 쿠키 접근 불가 → XSS 방어
        secure:   false,           // 개발 환경: false / 프로덕션 HTTPS: true
        sameSite: 'Lax',           // 크로스 사이트 POST 요청 쿠키 차단 → CSRF 기본 방어
        maxAge:   60 * 60 * 1000,  // 세션 유효시간: 1시간
    },
}));

// ─────────────────────────────────────────
// 2. 테스트용 사용자 데이터 (실제로는 DB에서 관리)
// ─────────────────────────────────────────
const USERS = [
    { id: 1, username: 'admin', password: 'admin123' },
    { id: 2, username: 'user1', password: 'pass123'  },
];

// ─────────────────────────────────────────
// 3. CSRF 토큰 생성 미들웨어
//    모든 요청에서 실행: 세션에 토큰이 없으면 새로 발급
// ─────────────────────────────────────────
function ensureCsrfToken(req, res, next) {
    if (!req.session.csrfToken) {
        // 암호학적으로 안전한 랜덤 토큰 생성 (64자리 16진수)
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    next();
}
app.use(ensureCsrfToken);

// ─────────────────────────────────────────
// 4. CSRF 토큰 검증 미들웨어
//    상태 변경 요청에만 적용 (POST/PUT/DELETE)
// ─────────────────────────────────────────
function verifyCsrf(req, res, next) {
    if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        return next(); // GET 등은 상태 변경이 없으므로 건너뜀
    }

    // 요청에서 CSRF 토큰 추출 (폼 바디 또는 커스텀 헤더)
    const sentToken   = req.body._csrf || req.headers['x-csrf-token'];
    const storedToken = req.session.csrfToken;

    // 두 토큰이 모두 있고, 같은지 비교
    // timingSafeEqual: 타이밍 공격(Timing Attack) 방지
    const isValid = sentToken && storedToken &&
        crypto.timingSafeEqual(
            Buffer.from(sentToken,   'hex'),
            Buffer.from(storedToken, 'hex')
        );

    if (!isValid) {
        // 403 Forbidden: CSRF 토큰 검증 실패
        console.warn(`[보안] CSRF 토큰 검증 실패 - IP: ${req.ip}, URL: ${req.path}`);
        return res.status(403).send(`
            <h2>403 Forbidden</h2>
            <p>CSRF 토큰이 유효하지 않습니다.</p>
            <p>페이지를 새로고침 후 다시 시도하세요.</p>
            <a href="/">처음으로</a>
        `);
    }

    next();
}

// ─────────────────────────────────────────
// 5. 인증 확인 미들웨어
//    보호된 라우트에만 적용
// ─────────────────────────────────────────
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        // 미로그인 상태 → 로그인 페이지로 리다이렉트
        return res.redirect('/login');
    }
    next();
}

// ─────────────────────────────────────────
// 6. 라우트
// ─────────────────────────────────────────

// GET / → 로그인 페이지로 리다이렉트
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// GET /login — 로그인 폼
app.get('/login', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/dashboard'); // 이미 로그인 상태면 대시보드로
    }

    const errorMsg  = req.query.error  || '';
    const csrfToken = req.session.csrfToken; // 세션에서 토큰 꺼내기

    res.send(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>로그인</title>
            <style>
                body { font-family: sans-serif; max-width: 400px; margin: 100px auto; padding: 0 20px; }
                .form-group { margin-bottom: 16px; }
                label { display: block; font-weight: bold; margin-bottom: 4px; }
                input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
                button { width: 100%; padding: 12px; background: #0066cc; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
                .error { color: #cc0000; background: #fff0f0; padding: 10px; border-radius: 4px; margin-bottom: 16px; }
                .info  { background: #f0f4ff; padding: 10px; border-radius: 4px; margin-bottom: 16px; font-size: 0.85rem; }
            </style>
        </head>
        <body>
            <h1>로그인</h1>

            <div class="info">
                테스트 계정: admin / admin123 또는 user1 / pass123
            </div>

            ${errorMsg ? `<div class="error">${errorMsg}</div>` : ''}

            <form method="POST" action="/login">
                <!-- CSRF 토큰: hidden input으로 포함
                     공격자의 사이트에서는 이 값을 알 수 없음 -->
                <input type="hidden" name="_csrf" value="${csrfToken}">

                <div class="form-group">
                    <label for="username">아이디</label>
                    <input type="text" id="username" name="username" required autocomplete="username">
                </div>

                <div class="form-group">
                    <label for="password">비밀번호</label>
                    <input type="password" id="password" name="password" required autocomplete="current-password">
                </div>

                <button type="submit">로그인</button>
            </form>
        </body>
        </html>
    `);
});

// POST /login — 로그인 처리 (CSRF 검증 포함)
app.post('/login', verifyCsrf, (req, res) => {
    const { username, password } = req.body;

    // 사용자 조회 (실제로는 DB 조회 + 비밀번호 해시 비교)
    const user = USERS.find(u => u.username === username && u.password === password);

    if (!user) {
        // 로그인 실패: 구체적인 오류(아이디 없음 / 비밀번호 틀림)를 알려주지 않음
        // (사용자 계정 존재 여부를 노출하지 않기 위해)
        return res.redirect('/login?error=아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    // 세션 고정 공격 방지: 로그인 성공 시 세션 재생성
    req.session.regenerate((err) => {
        if (err) return res.status(500).send('서버 오류');

        // 새 세션에 사용자 정보 저장
        req.session.userId   = user.id;
        req.session.username = user.username;

        // 새 세션에도 CSRF 토큰 발급
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');

        res.redirect('/dashboard');
    });
});

// GET /dashboard — 보호된 페이지 (로그인 필요)
app.get('/dashboard', requireAuth, (req, res) => {
    const csrfToken = req.session.csrfToken;

    res.send(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>대시보드</title>
            <style>
                body { font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 0 20px; }
                .user-info { background: #e8f5e9; padding: 16px; border-radius: 8px; margin-bottom: 20px; }
                button { padding: 10px 20px; background: #cc0000; color: white; border: none; border-radius: 4px; cursor: pointer; }
            </style>
        </head>
        <body>
            <h1>대시보드</h1>
            <div class="user-info">
                <strong>${req.session.username}</strong>님 환영합니다!
            </div>

            <!-- 로그아웃 폼: POST 요청 + CSRF 토큰 -->
            <form method="POST" action="/logout">
                <!-- CSRF 토큰으로 로그아웃 요청도 보호 -->
                <input type="hidden" name="_csrf" value="${csrfToken}">
                <button type="submit">로그아웃</button>
            </form>
        </body>
        </html>
    `);
});

// POST /logout — 로그아웃 (CSRF 검증 포함)
app.post('/logout', requireAuth, verifyCsrf, (req, res) => {
    // 세션 파기: 모든 세션 데이터 삭제
    req.session.destroy((err) => {
        if (err) return res.status(500).send('로그아웃 실패');
        res.clearCookie('connect.sid'); // 쿠키 삭제
        res.redirect('/login');
    });
});

// ─────────────────────────────────────────
// 7. 서버 시작
// ─────────────────────────────────────────
app.listen(3000, () => {
    console.log('CSRF 방어 로그인 서버: http://localhost:3000');
    console.log('테스트 계정: admin / admin123');
});
