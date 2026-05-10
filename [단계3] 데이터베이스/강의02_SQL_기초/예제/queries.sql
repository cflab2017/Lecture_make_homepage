-- ============================================
-- 강의02 예제: 도서 관리 데이터베이스
-- ============================================

-- ─────────────────────────────────────────
-- 1. 테이블 생성
-- ─────────────────────────────────────────
DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id        INTEGER PRIMARY KEY AUTOINCREMENT, -- 도서 고유 번호
    title     TEXT    NOT NULL,                  -- 도서 제목
    author    TEXT    NOT NULL,                  -- 저자
    price     INTEGER DEFAULT 0,                 -- 가격
    category  TEXT,                              -- 분류 (예: '프로그래밍', '소설')
    isbn      TEXT    UNIQUE,                    -- ISBN (중복 불가)
    published TEXT                               -- 출판일
);

-- ─────────────────────────────────────────
-- 2. 더미 데이터 삽입
-- ─────────────────────────────────────────
INSERT INTO books (title, author, price, category, published) VALUES
    ('클린 코드',               '로버트 마틴',      30000, '프로그래밍', '2008-08-01'),
    ('리팩터링',                '마틴 파울러',      35000, '프로그래밍', '2018-11-20'),
    ('자바스크립트 완벽 가이드', '데이비드 플래너건', 45000, '프로그래밍', '2020-07-26'),
    ('파이썬 입문',             '귀도 반 로썸',     28000, '프로그래밍', '2019-03-15'),
    ('채식주의자',              '한강',             14000, '소설',       '2007-10-30'),
    ('82년생 김지영',           '조남주',           14800, '소설',       '2016-10-14'),
    ('어린 왕자',               '생텍쥐페리',       12000, '소설',       '1943-04-06'),
    ('사피엔스',                '유발 하라리',      22000, '역사',       '2011-01-01'),
    ('총, 균, 쇠',              '재레드 다이아몬드', 26000, '역사',       '1997-03-01'),
    ('코스모스',                '칼 세이건',        25000, '과학',       '1980-10-01');

-- ─────────────────────────────────────────
-- 3. 다양한 SELECT 쿼리
-- ─────────────────────────────────────────

-- 3-1. 전체 도서 목록
SELECT * FROM books;

-- 3-2. 제목과 가격만 조회
SELECT title, price FROM books;

-- 3-3. 프로그래밍 카테고리 도서만 조회
SELECT title, author, price
FROM books
WHERE category = '프로그래밍';

-- 3-4. 가격이 20000원 이상인 도서 (저렴한 순)
SELECT title, price
FROM books
WHERE price >= 20000
ORDER BY price ASC;

-- 3-5. 제목에 '코드'가 들어간 도서
SELECT title, author
FROM books
WHERE title LIKE '%코드%';

-- 3-6. 가장 비싼 도서 TOP 3
SELECT title, author, price
FROM books
ORDER BY price DESC
LIMIT 3;

-- 3-7. 2010년 이후 출판된 도서 (날짜 문자열 비교)
SELECT title, published
FROM books
WHERE published >= '2010-01-01'
ORDER BY published DESC;

-- ─────────────────────────────────────────
-- 4. UPDATE 예제
-- ─────────────────────────────────────────

-- '클린 코드' 가격을 32000원으로 인상
UPDATE books SET price = 32000 WHERE title = '클린 코드';

-- 소설 카테고리 전체 가격 10% 인상
UPDATE books
SET price = CAST(price * 1.1 AS INTEGER)
WHERE category = '소설';

-- ─────────────────────────────────────────
-- 5. DELETE 예제
-- ─────────────────────────────────────────

-- 특정 도서 삭제 (어린 왕자)
DELETE FROM books WHERE title = '어린 왕자';

-- 현재 남아있는 도서 확인
SELECT id, title, category, price FROM books ORDER BY id;
