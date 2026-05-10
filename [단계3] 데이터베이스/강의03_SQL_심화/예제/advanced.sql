-- ============================================
-- 강의03 예제: 주문-상품-유저 3테이블 조인 쿼리 모음
-- ============================================

-- ─────────────────────────────────────────
-- 1. 테이블 생성 및 데이터 준비
-- ─────────────────────────────────────────
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    username   TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    created_at TEXT    DEFAULT (date('now'))
);

CREATE TABLE products (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT    NOT NULL,
    price    INTEGER NOT NULL,
    category TEXT    NOT NULL,
    stock    INTEGER DEFAULT 0
);

CREATE TABLE orders (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    status      TEXT    DEFAULT 'pending',
    ordered_at  TEXT    DEFAULT (date('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id   INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity   INTEGER NOT NULL DEFAULT 1,
    unit_price INTEGER NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 샘플 데이터
INSERT INTO users (username, email) VALUES
    ('kim',  'kim@shop.com'),
    ('lee',  'lee@shop.com'),
    ('park', 'park@shop.com'),
    ('choi', 'choi@shop.com');  -- 주문 없는 회원

INSERT INTO products (name, price, category, stock) VALUES
    ('노트북',     1500000, '전자제품', 10),
    ('마우스',       30000, '전자제품', 50),
    ('키보드',       80000, '전자제품', 30),
    ('모니터',      450000, '전자제품', 15),
    ('파이썬 책',    28000, '도서',     40),
    ('클린코드',     32000, '도서',     35),
    ('의자',        350000, '가구',     20);

-- 주문 데이터 (ordered_at을 직접 지정하여 월별 통계 테스트)
INSERT INTO orders (user_id, status, ordered_at) VALUES
    (1, 'paid',    '2024-01-15'),
    (1, 'paid',    '2024-02-20'),
    (2, 'paid',    '2024-01-10'),
    (2, 'pending', '2024-03-05'),
    (3, 'paid',    '2024-02-14'),
    (1, 'paid',    '2024-03-22');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
    (1, 1, 1, 1500000),  -- 주문1: 노트북 1개
    (1, 2, 2,   30000),  -- 주문1: 마우스 2개
    (2, 3, 1,   80000),  -- 주문2: 키보드 1개
    (2, 5, 2,   28000),  -- 주문2: 파이썬 책 2개
    (3, 4, 1,  450000),  -- 주문3: 모니터 1개
    (4, 6, 1,   32000),  -- 주문4: 클린코드 1개
    (5, 7, 1,  350000),  -- 주문5: 의자 1개
    (5, 2, 1,   30000),  -- 주문5: 마우스 1개
    (6, 1, 1, 1500000),  -- 주문6: 노트북 1개
    (6, 3, 1,   80000);  -- 주문6: 키보드 1개

-- 인덱스 생성
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_ordered_at ON orders(ordered_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ─────────────────────────────────────────
-- 2. JOIN 쿼리 모음
-- ─────────────────────────────────────────

-- 2-1. 전체 주문 내역 (회원명 포함) — INNER JOIN
SELECT
    u.username           AS 회원명,
    o.id                 AS 주문번호,
    o.status             AS 상태,
    o.ordered_at         AS 주문일
FROM orders o
INNER JOIN users u ON o.user_id = u.id
ORDER BY o.ordered_at DESC;

-- 2-2. 주문 상품 상세 내역 — 3테이블 JOIN
SELECT
    u.username                        AS 회원명,
    o.id                              AS 주문번호,
    p.name                            AS 상품명,
    p.category                        AS 카테고리,
    oi.quantity                       AS 수량,
    oi.unit_price                     AS 단가,
    (oi.quantity * oi.unit_price)     AS 소계
FROM order_items oi
INNER JOIN orders   o ON oi.order_id   = o.id
INNER JOIN users    u ON o.user_id     = u.id
INNER JOIN products p ON oi.product_id = p.id
ORDER BY o.id, oi.id;

-- 2-3. 주문이 없는 회원 찾기 — LEFT JOIN 활용
SELECT
    u.username,
    u.email,
    o.id AS 주문번호
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;  -- 주문이 없으면 NULL

-- ─────────────────────────────────────────
-- 3. GROUP BY + 집계 함수
-- ─────────────────────────────────────────

-- 3-1. 회원별 총 주문 금액
SELECT
    u.username                              AS 회원명,
    COUNT(DISTINCT o.id)                    AS 주문수,
    SUM(oi.quantity * oi.unit_price)        AS 총구매액,
    AVG(oi.quantity * oi.unit_price)        AS 평균주문금액
FROM order_items oi
INNER JOIN orders o ON oi.order_id = o.id
INNER JOIN users  u ON o.user_id   = u.id
GROUP BY u.id, u.username
ORDER BY 총구매액 DESC;

-- 3-2. 카테고리별 판매량 및 매출
SELECT
    p.category              AS 카테고리,
    COUNT(oi.id)            AS 판매건수,
    SUM(oi.quantity)        AS 판매수량,
    SUM(oi.quantity * oi.unit_price) AS 총매출
FROM order_items oi
INNER JOIN products p ON oi.product_id = p.id
GROUP BY p.category
ORDER BY 총매출 DESC;

-- 3-3. HAVING: 총 구매액 100만원 이상 VIP 고객
SELECT
    u.username,
    SUM(oi.quantity * oi.unit_price) AS 총구매액
FROM order_items oi
INNER JOIN orders o ON oi.order_id = o.id
INNER JOIN users  u ON o.user_id   = u.id
GROUP BY u.id, u.username
HAVING SUM(oi.quantity * oi.unit_price) >= 1000000;  -- 100만원 이상만

-- ─────────────────────────────────────────
-- 4. 서브쿼리
-- ─────────────────────────────────────────

-- 4-1. 평균 단가보다 비싼 상품 조회
SELECT name, price, category
FROM products
WHERE price > (SELECT AVG(price) FROM products)
ORDER BY price DESC;

-- 4-2. 가장 많이 팔린 상품 TOP 3
SELECT
    p.name,
    SUM(oi.quantity) AS 총판매수량
FROM order_items oi
INNER JOIN products p ON oi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY 총판매수량 DESC
LIMIT 3;

-- ─────────────────────────────────────────
-- 5. EXPLAIN QUERY PLAN — 실행 계획 확인
-- ─────────────────────────────────────────

-- 인덱스 사용 여부 확인
EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE user_id = 1;
-- 기대 결과: SEARCH TABLE orders USING INDEX idx_orders_user_id
