// ============================================
// 강의03 예제: SQL 인젝션 취약한 로그인 (학습용)
// ============================================
// ⚠ 이 코드는 SQL 인젝션 취약점을 보여주기 위한 예제입니다.
//   실제 서비스에서 절대 사용하지 마세요!
// ============================================
// 실행: node vulnerable-login.js
// 테스트: http://localhost:3001
// ============================================

const express    = require('express');
const Database   = require('better-sqlite3');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─────────────────────────────────────────
// DB 초기화 (메모리 DB 사용)
// ─────────────────────────────────────────
const db = new Database(':memory:'); // 메모리 DB

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
// 로그인 페이지
// ─────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>취약한 로그인 (학습용)</title>
            <style>
                body { font-family: sans-serif; max-width: 500px; margin: 40px auto; padding: 0 20px; }
                .warning { background: #fff3cd; border: 2px solid #ffc107; padding: 12px; border-radius: 6px; margin-bottom: 20px; }
                input { display: block; width: 100%; margin: 8px 0; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
                button { padding: 10px 20px; background: #cc0000; color: white; border: none; border-radius: 4px; cursor: pointer; }
                .payload { background: #fff0f0; border: 1px solid #cc0000; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 0.9rem; }
            </style>
        </head>
        <body>
            <div class="warning">
                ⚠ <strong>학습용 취약 코드</strong> — 절대 실제 서비스에 사용 금지
            </div>

            <h1>로그인 (취약 버전)</h1>

            <form method="POST" action="/login">
                <label>아이디</label>
                <input type="text" name="username" placeholder="아이디">
                <label>비밀번호</label>
                <input type="password" name="password" placeholder="비밀번호">
                <button type="submit">로그인</button>
            </form>

            <hr style="margin: 30px 0">
            <h2>SQL 인젝션 테스트</h2>
            <p>아이디 입력창에 아래 페이로드를 입력해보세요:</p>
            <div class="payload">
                admin' --<br>
                ' OR '1'='1<br>
                ' OR 1=1 --
            </div>
            <p>비밀번호는 아무거나 입력해도 됩니다.</p>
        </body>
        </html>
    `);
});

// ─────────────────────────────────────────
// 취약한 로그인 처리
// ⚠ 사용자 입력을 SQL 문자열에 직접 삽입!
// ─────────────────────────────────────────
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // ⚠ 핵심 취약점: 문자열 템플릿으로 SQL 직접 구성
    // 공격자가 username에 admin' -- 를 입력하면:
    // SELECT * FROM users WHERE username = 'admin' --' AND password = '...'
    // -- 이후가 주석 처리되어 비밀번호 확인이 무효화됨!
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    console.log('[취약] 실행된 쿼리:', query); // 실제로 어떤 쿼리가 실행되는지 확인

    try {
        const user = db.prepare(query).get();

        if (user) {
            res.send(`
                <h2>로그인 성공!</h2>
                <p>ID: ${user.id} / 아이디: ${user.username} / 역할: ${user.role}</p>
                <p style="color:red">⚠ SQL 인젝션으로 로그인 우회 성공!</p>
                <a href="/">돌아가기</a>
            `);
        } else {
            res.send('<h2>로그인 실패</h2><a href="/">돌아가기</a>');
        }
    } catch (err) {
        // ⚠ 에러 메시지를 그대로 노출 → DB 구조 정보 유출
        res.status(500).send(`<p>에러: ${err.message}</p>`);
    }
});

app.listen(3001, () => {
    console.log('취약한 서버 실행: http://localhost:3001');
    console.log('테스트: 아이디에 admin\' -- 입력');
});
