// ============================================
// 과제03 정답: SQL 인젝션 방어된 검색 기능
// ============================================
// 실행: node safe-search.js
// 테스트: http://localhost:3000/search?q=노트북
// ============================================

const express  = require('express');
const Database = require('better-sqlite3');

const app = express();
const db  = new Database(':memory:');

// ─────────────────────────────────────────
// 테스트 데이터 준비
// ─────────────────────────────────────────
db.exec(`
    CREATE TABLE products (
        id       INTEGER PRIMARY KEY,
        name     TEXT    NOT NULL,
        price    INTEGER NOT NULL,
        category TEXT
    );
    INSERT INTO products VALUES (1, '노트북',      1500000, '전자제품');
    INSERT INTO products VALUES (2, '마우스',         30000, '전자제품');
    INSERT INTO products VALUES (3, '클린코드',       32000, '도서');
    INSERT INTO products VALUES (4, '자바스크립트책', 45000, '도서');
    INSERT INTO products VALUES (5, '의자',          350000, '가구');
`);

// ─────────────────────────────────────────
// Prepared Statement 미리 준비
// ?가 플레이스홀더 역할: 바인딩된 값은 SQL로 해석되지 않음
// ─────────────────────────────────────────
const stmts = {
    // LIKE 검색: %값% 를 파라미터로 전달
    // 주의: LIKE의 %는 파라미터 안에 포함시킴 → 안전
    searchByName: db.prepare('SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC'),

    // 카테고리 필터
    searchByCategory: db.prepare('SELECT * FROM products WHERE category = ? ORDER BY name ASC'),

    // 이름 + 카테고리 복합 검색
    searchComplex: db.prepare('SELECT * FROM products WHERE name LIKE ? AND category = ? ORDER BY name ASC'),
};

// ─────────────────────────────────────────
// 입력 검증 함수 (화이트리스트 방식)
// ─────────────────────────────────────────
function validateSearchInput(keyword) {
    if (typeof keyword !== 'string') return null;

    // 길이 제한: 최대 100자
    if (keyword.length > 100) {
        return null;
    }

    // 앞뒤 공백 제거
    return keyword.trim();
}

// ─────────────────────────────────────────
// GET /search — 안전한 상품 검색
// 쿼리: ?q=검색어 (필수 아님)
//       ?category=카테고리 (선택)
// ─────────────────────────────────────────
app.get('/search', (req, res) => {
    try {
        // ─────────────────────────────────────────
        // 1. 입력값 검증 및 정제
        // ─────────────────────────────────────────
        const rawKeyword  = req.query.q        || '';
        const rawCategory = req.query.category || '';

        const keyword  = validateSearchInput(rawKeyword);
        const category = validateSearchInput(rawCategory);

        // 검증 실패 (null 반환) → 400 오류
        if (keyword === null || category === null) {
            return res.status(400).json({
                success: false,
                message: '검색어는 100자 이하여야 합니다.',
            });
        }

        // ─────────────────────────────────────────
        // 2. Prepared Statement로 안전한 쿼리 실행
        //    ? 플레이스홀더 사용: 바인딩된 값은 SQL 문법으로 처리되지 않음
        //    ' OR '1'='1 을 입력해도 문자열 그대로 비교됨
        // ─────────────────────────────────────────
        let results;

        if (keyword && category) {
            // 검색어 + 카테고리 복합 검색
            // LIKE 패턴의 %는 파라미터 값 안에 포함
            results = stmts.searchComplex.all(`%${keyword}%`, category);
        } else if (keyword) {
            // 검색어만
            results = stmts.searchByName.all(`%${keyword}%`);
        } else if (category) {
            // 카테고리만
            results = stmts.searchByCategory.all(category);
        } else {
            // 검색 조건 없음 → 빈 배열 반환 (전체 조회 금지)
            results = [];
        }

        res.json({
            success: true,
            count: results.length,
            query: {
                keyword:  keyword  || null,
                category: category || null,
            },
            data: results,
        });

    } catch (err) {
        // 서버 내부 에러: 로그에 기록하되 클라이언트에는 최소 정보만 반환
        // DB 구조, 테이블명, 컬럼명 등을 노출하지 않음
        console.error('[DB 에러]', err.message, '| 쿼리 파라미터:', req.query);
        res.status(500).json({
            success: false,
            message: '검색 중 오류가 발생했습니다.',
            // message: err.message  ← ⚠ 절대 이렇게 하면 안 됨! DB 정보 노출
        });
    }
});

// ─────────────────────────────────────────
// 서버 시작
// ─────────────────────────────────────────
app.listen(3000, () => {
    console.log('안전한 검색 서버: http://localhost:3000');
    console.log('');
    console.log('테스트:');
    console.log('  정상: GET /search?q=노트북');
    console.log('  공격: GET /search?q=\' OR \'1\'=\'1');
    console.log('  공격: GET /search?q=\'; DROP TABLE --');
});
