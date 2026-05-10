// ============================================
// 강의04 예제: Express + better-sqlite3 책 목록 CRUD API
// ============================================
// 실행: node app.js
// 테스트: http://localhost:3000/books
// ============================================

const express = require('express');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3000;

// JSON 요청 바디 파싱
app.use(express.json());

// ─────────────────────────────────────────
// 1. 데이터베이스 초기화
// ─────────────────────────────────────────
// 파일이 없으면 자동으로 생성됨
const db = new Database('library.db');

// 앱 시작 시 테이블이 없으면 자동 생성 (CREATE TABLE IF NOT EXISTS)
db.exec(`
    CREATE TABLE IF NOT EXISTS books (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        title     TEXT    NOT NULL,
        author    TEXT    NOT NULL,
        price     INTEGER DEFAULT 0,
        category  TEXT    DEFAULT '미분류',
        created_at TEXT   DEFAULT (datetime('now'))
    )
`);

// 초기 더미 데이터 (책이 없을 때만 삽입)
const count = db.prepare('SELECT COUNT(*) AS cnt FROM books').get();
if (count.cnt === 0) {
    const insert = db.prepare(
        'INSERT INTO books (title, author, price, category) VALUES (?, ?, ?, ?)'
    );
    // 여러 행을 트랜잭션으로 묶어 빠르게 삽입
    const insertMany = db.transaction((books) => {
        for (const book of books) {
            insert.run(book.title, book.author, book.price, book.category);
        }
    });
    insertMany([
        { title: '클린 코드',     author: '로버트 마틴',   price: 30000, category: '프로그래밍' },
        { title: '리팩터링',      author: '마틴 파울러',   price: 35000, category: '프로그래밍' },
        { title: '파이썬 입문',   author: '귀도 반 로썸',  price: 28000, category: '프로그래밍' },
        { title: '사피엔스',      author: '유발 하라리',   price: 22000, category: '역사'       },
    ]);
    console.log('더미 데이터 삽입 완료');
}

// ─────────────────────────────────────────
// 2. Prepared Statements 미리 준비
//    자주 쓰는 쿼리를 한 번만 컴파일하여 성능 향상
// ─────────────────────────────────────────
const stmts = {
    // 전체 조회 (category 필터 옵션)
    getAll: db.prepare('SELECT * FROM books ORDER BY id DESC'),
    getAllByCategory: db.prepare('SELECT * FROM books WHERE category = ? ORDER BY id DESC'),

    // 단일 조회
    getById: db.prepare('SELECT * FROM books WHERE id = ?'),

    // 삽입
    insert: db.prepare(
        'INSERT INTO books (title, author, price, category) VALUES (@title, @author, @price, @category)'
    ),

    // 수정
    update: db.prepare(
        'UPDATE books SET title = @title, author = @author, price = @price, category = @category WHERE id = @id'
    ),

    // 삭제
    delete: db.prepare('DELETE FROM books WHERE id = ?'),
};

// ─────────────────────────────────────────
// 3. API 라우트
// ─────────────────────────────────────────

// GET /books — 전체 목록 (쿼리로 카테고리 필터 가능)
// 예: GET /books?category=프로그래밍
app.get('/books', (req, res) => {
    const { category } = req.query;

    // category 쿼리가 있으면 필터, 없으면 전체 조회
    const books = category
        ? stmts.getAllByCategory.all(category)
        : stmts.getAll.all();

    res.json({ success: true, count: books.length, data: books });
});

// GET /books/:id — 특정 책 조회
app.get('/books/:id', (req, res) => {
    const { id } = req.params;

    // get()은 단일 행 반환, 없으면 undefined
    const book = stmts.getById.get(id);

    if (!book) {
        // 404: 해당 ID 책이 없음
        return res.status(404).json({ success: false, message: '책을 찾을 수 없습니다.' });
    }

    res.json({ success: true, data: book });
});

// POST /books — 새 책 추가
// Body: { title, author, price, category }
app.post('/books', (req, res) => {
    const { title, author, price = 0, category = '미분류' } = req.body;

    // 필수 필드 검증
    if (!title || !author) {
        return res.status(400).json({ success: false, message: 'title과 author는 필수입니다.' });
    }

    // @name 형식의 파라미터 바인딩 (객체로 전달)
    const result = stmts.insert.run({ title, author, price, category });

    // 방금 삽입한 행을 다시 조회하여 반환
    const newBook = stmts.getById.get(result.lastInsertRowid);

    res.status(201).json({ success: true, data: newBook });
});

// PUT /books/:id — 책 정보 수정
// Body: { title, author, price, category }
app.put('/books/:id', (req, res) => {
    const { id } = req.params;

    // 기존 데이터 조회
    const existing = stmts.getById.get(id);
    if (!existing) {
        return res.status(404).json({ success: false, message: '책을 찾을 수 없습니다.' });
    }

    // 기존 값을 유지하면서 요청된 필드만 업데이트 (부분 업데이트)
    const updated = {
        id,
        title:    req.body.title    ?? existing.title,
        author:   req.body.author   ?? existing.author,
        price:    req.body.price    ?? existing.price,
        category: req.body.category ?? existing.category,
    };

    const result = stmts.update.run(updated);

    if (result.changes === 0) {
        return res.status(400).json({ success: false, message: '수정에 실패했습니다.' });
    }

    // 수정된 데이터 반환
    const updatedBook = stmts.getById.get(id);
    res.json({ success: true, data: updatedBook });
});

// DELETE /books/:id — 책 삭제
app.delete('/books/:id', (req, res) => {
    const { id } = req.params;

    // 삭제 전 존재 확인
    const existing = stmts.getById.get(id);
    if (!existing) {
        return res.status(404).json({ success: false, message: '책을 찾을 수 없습니다.' });
    }

    // run()은 영향받은 행 수를 changes에 담아 반환
    const result = stmts.delete.run(id);

    if (result.changes === 0) {
        return res.status(400).json({ success: false, message: '삭제에 실패했습니다.' });
    }

    res.json({ success: true, message: `"${existing.title}" 삭제 완료` });
});

// ─────────────────────────────────────────
// 4. 서버 시작
// ─────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
    console.log('');
    console.log('사용 가능한 API:');
    console.log('  GET    /books           - 전체 목록');
    console.log('  GET    /books?category= - 카테고리 필터');
    console.log('  GET    /books/:id       - 단일 조회');
    console.log('  POST   /books           - 책 추가');
    console.log('  PUT    /books/:id       - 책 수정');
    console.log('  DELETE /books/:id       - 책 삭제');
});
