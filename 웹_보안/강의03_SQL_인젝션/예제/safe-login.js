// ============================================
// 강의03 예제: Prepared Statement로 방어된 로그인
// ============================================
// 실행: node safe-login.js
// 테스트: http://localhost:3000
// ============================================

const express  = require('express');
const Database = require('better-sqlite3');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─────────────────────────────────────────
// DB 초기화
// ─────────────────────────────────────────
const db = new Database(':memory:');

db.exec(`
    CREATE TABLE users (
        id       INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        role     TEXT DEFAULT 'user'
    );

    INSERT INTO users VALUES (1, 'admin', 'super_secret_password', 'admin');
    INSERT INTO users VALUES (2, 'alice', 'alice_password',        'user');
    INSERT INTO users VALUES (3, 'bob',   'bob_password',          'user');
`);

// ─────────────────────────────────────────
// Prepared Statement 미리 준비
// ? 플레이스홀더로 데이터와 SQL을 분리
// ─────────────────────────────────────────
const stmts = {
    // 로그인 쿼리: username과 password는 항상 데이터로만 처리됨
    findUser: db.prepare('SELECT * FROM users WHERE username = ? AND password = ?'),

    // 아이디로만 조회 (이미 검증된 경우)
    findById: db.prepare('SELECT id, username, role FROM users WHERE id = ?'),
};

// ─────────────────────────────────────────
// 로그인 페이지
// ─────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>안전한 로그인</title>
            <style>
                body { font-family: sans-serif; max-width: 500px; margin: 40px auto; padding: 0 20px; }
                .safe { background: #e8f5e9; border: 2px solid #4caf50; padding: 12px; border-radius: 6px; margin-bottom: 20px; }
                input { display: block; width: 100%; margin: 8px 0; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
                button { padding: 10px 20px; background: #2e7d32; color: white; border: none; border-radius: 4px; cursor: pointer; }
                .payload { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; }
            </style>
        </head>
        <body>
            <div class="safe">✓ <strong>안전한 버전</strong> — Prepared Statement 사용</div>
            <h1>로그인 (안전한 버전)</h1>
            <form method="POST" action="/login">
                <label>아이디</label>
                <input type="text" name="username" placeholder="아이디">
                <label>비밀번호</label>
                <input type="password" name="password" placeholder="비밀번호">
                <button type="submit">로그인</button>
            </form>

            <hr style="margin: 30px 0">
            <h2>테스트</h2>
            <p>아래 페이로드를 입력해도 로그인 우회가 되지 않습니다:</p>
            <div class="payload">
                아이디: admin' --<br>
                아이디: ' OR '1'='1<br>
                비밀번호: 아무거나
            </div>
            <p>정상 계정: admin / super_secret_password</p>
        </body>
        </html>
    `);
});

// ─────────────────────────────────────────
// 안전한 로그인 처리
// ─────────────────────────────────────────
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 기본 입력 검증 (빈 값 거부)
    if (!username || !password) {
        return res.status(400).send('<p>아이디와 비밀번호를 입력해주세요.</p><a href="/">돌아가기</a>');
    }

    try {
        // ✓ Prepared Statement 사용
        // username과 password는 ? 플레이스홀더로 바인딩됨
        // SQL 문법으로 해석되지 않고 단순 문자열로 처리됨
        // 따라서 ' OR '1'='1 같은 페이로드도 효과 없음
        const user = stmts.findUser.get(username, password);

        if (user) {
            res.send(`
                <h2>로그인 성공!</h2>
                <p>아이디: ${user.username} / 역할: ${user.role}</p>
                <p style="color:green">✓ Prepared Statement로 SQL 인젝션 차단!</p>
                <a href="/">돌아가기</a>
            `);
        } else {
            // 에러 메시지는 일반적으로 — DB 구조 정보 노출 금지
            res.send('<h2>로그인 실패</h2><p>아이디 또는 비밀번호가 올바르지 않습니다.</p><a href="/">돌아가기</a>');
        }
    } catch (err) {
        // 서버 로그에만 상세 에러 기록
        console.error('[에러]', err);
        // 클라이언트에는 최소한의 정보만 반환
        res.status(500).send('<p>서버 오류가 발생했습니다.</p><a href="/">돌아가기</a>');
    }
});

app.listen(3000, () => {
    console.log('안전한 서버 실행: http://localhost:3000');
    console.log('테스트 계정: admin / super_secret_password');
});
