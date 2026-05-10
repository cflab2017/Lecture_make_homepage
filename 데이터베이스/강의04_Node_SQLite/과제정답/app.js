// ============================================
// 과제04 정답: 블로그 포스트 CRUD API
// better-sqlite3 + Express
// ============================================
// 실행: node app.js
// ============================================

const express = require('express');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3000;

// JSON 요청 바디 파싱 미들웨어
app.use(express.json());

// ─────────────────────────────────────────
// 1. 데이터베이스 초기화
//    blog.db 파일이 없으면 자동 생성
// ─────────────────────────────────────────
const db = new Database('blog.db');

// WAL 모드: 읽기/쓰기 성능 향상 (SQLite 권장 설정)
db.pragma('journal_mode = WAL');

// posts 테이블 자동 생성 (없을 때만 생성)
db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        title      TEXT    NOT NULL,                     -- 포스트 제목 (필수)
        content    TEXT    NOT NULL,                     -- 포스트 내용 (필수)
        author     TEXT    NOT NULL,                     -- 작성자 (필수)
        created_at TEXT    DEFAULT (datetime('now')),    -- 작성일시 (자동)
        updated_at TEXT    DEFAULT (datetime('now'))     -- 수정일시 (자동, 수정 시 갱신)
    )
`);

// ─────────────────────────────────────────
// 2. Prepared Statements 준비
//    자주 쓰는 쿼리를 미리 컴파일 → 성능 향상 + SQL 인젝션 방지
// ─────────────────────────────────────────
const stmts = {
    // 전체 포스트 조회 (최신 순)
    getAll: db.prepare('SELECT * FROM posts ORDER BY created_at DESC'),

    // 작성자 필터
    getByAuthor: db.prepare('SELECT * FROM posts WHERE author = ? ORDER BY created_at DESC'),

    // 제목 검색 (LIKE)
    searchByTitle: db.prepare("SELECT * FROM posts WHERE title LIKE '%' || ? || '%' ORDER BY created_at DESC"),

    // 단일 포스트 조회
    getById: db.prepare('SELECT * FROM posts WHERE id = ?'),

    // 포스트 생성
    insert: db.prepare(
        'INSERT INTO posts (title, content, author) VALUES (@title, @content, @author)'
    ),

    // 포스트 수정 (updated_at을 현재 시각으로 갱신)
    update: db.prepare(`
        UPDATE posts
        SET title      = @title,
            content    = @content,
            author     = @author,
            updated_at = datetime('now')   -- 수정 시각 자동 갱신
        WHERE id = @id
    `),

    // 포스트 삭제
    delete: db.prepare('DELETE FROM posts WHERE id = ?'),
};

// ─────────────────────────────────────────
// 3. API 라우트 구현
// ─────────────────────────────────────────

// GET /posts — 전체 목록 조회
// 쿼리 파라미터로 필터 가능:
//   ?author=김철수   → 작성자 필터
//   ?search=키워드   → 제목 검색
app.get('/posts', (req, res) => {
    const { author, search } = req.query;

    let posts;

    if (author) {
        // 작성자 필터 (정확히 일치)
        posts = stmts.getByAuthor.all(author);
    } else if (search) {
        // 제목 키워드 검색
        posts = stmts.searchByTitle.all(search);
    } else {
        // 전체 조회
        posts = stmts.getAll.all();
    }

    res.json({
        success: true,
        count: posts.length,
        data: posts,
    });
});

// GET /posts/:id — 단일 포스트 조회
app.get('/posts/:id', (req, res) => {
    const { id } = req.params;

    // get()은 단일 행 반환, 없으면 undefined
    const post = stmts.getById.get(id);

    if (!post) {
        // 해당 ID의 포스트가 없을 때 404 반환
        return res.status(404).json({
            success: false,
            message: `ID ${id}에 해당하는 포스트가 없습니다.`,
        });
    }

    res.json({ success: true, data: post });
});

// POST /posts — 새 포스트 작성
// Body: { title, content, author }
app.post('/posts', (req, res) => {
    const { title, content, author } = req.body;

    // 필수 필드 검증: title, content, author 모두 필요
    if (!title || !content || !author) {
        return res.status(400).json({
            success: false,
            message: 'title, content, author는 모두 필수 항목입니다.',
        });
    }

    // 빈 문자열도 거부
    if (title.trim() === '' || content.trim() === '' || author.trim() === '') {
        return res.status(400).json({
            success: false,
            message: '값이 비어있으면 안 됩니다.',
        });
    }

    // 포스트 삽입 (run()은 { lastInsertRowid, changes } 반환)
    const result = stmts.insert.run({ title: title.trim(), content: content.trim(), author: author.trim() });

    // 생성된 포스트를 다시 조회하여 응답 (created_at 포함)
    const newPost = stmts.getById.get(result.lastInsertRowid);

    res.status(201).json({
        success: true,
        message: '포스트가 생성되었습니다.',
        data: newPost,
    });
});

// PUT /posts/:id — 포스트 수정
// Body: { title?, content?, author? } — 부분 수정 가능
app.put('/posts/:id', (req, res) => {
    const { id } = req.params;

    // 수정 전 기존 데이터 조회
    const existing = stmts.getById.get(id);
    if (!existing) {
        return res.status(404).json({
            success: false,
            message: `ID ${id}에 해당하는 포스트가 없습니다.`,
        });
    }

    // 요청 바디에 없는 필드는 기존 값 유지 (부분 업데이트)
    const updated = {
        id,
        title:   req.body.title   ?? existing.title,
        content: req.body.content ?? existing.content,
        author:  req.body.author  ?? existing.author,
        // updated_at은 SQL에서 datetime('now')로 자동 갱신
    };

    const result = stmts.update.run(updated);

    if (result.changes === 0) {
        return res.status(400).json({
            success: false,
            message: '수정에 실패했습니다.',
        });
    }

    // 수정된 데이터 반환 (updated_at 확인 가능)
    const updatedPost = stmts.getById.get(id);
    res.json({
        success: true,
        message: '포스트가 수정되었습니다.',
        data: updatedPost,
    });
});

// DELETE /posts/:id — 포스트 삭제
app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;

    // 삭제 전 존재 확인 (삭제 후에는 제목을 알 수 없으므로 미리 저장)
    const existing = stmts.getById.get(id);
    if (!existing) {
        return res.status(404).json({
            success: false,
            message: `ID ${id}에 해당하는 포스트가 없습니다.`,
        });
    }

    // 삭제 실행 (changes가 0이면 실패)
    const result = stmts.delete.run(id);

    if (result.changes === 0) {
        return res.status(400).json({
            success: false,
            message: '삭제에 실패했습니다.',
        });
    }

    res.json({
        success: true,
        message: `"${existing.title}" 포스트가 삭제되었습니다.`,
    });
});

// ─────────────────────────────────────────
// 4. 서버 시작
// ─────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`블로그 API 서버 실행: http://localhost:${PORT}`);
    console.log('');
    console.log('API 목록:');
    console.log('  GET    /posts              - 전체 목록');
    console.log('  GET    /posts?author=이름  - 작성자 필터');
    console.log('  GET    /posts?search=키워드 - 제목 검색');
    console.log('  GET    /posts/:id          - 단일 조회');
    console.log('  POST   /posts              - 포스트 작성');
    console.log('  PUT    /posts/:id          - 포스트 수정');
    console.log('  DELETE /posts/:id          - 포스트 삭제');
});
