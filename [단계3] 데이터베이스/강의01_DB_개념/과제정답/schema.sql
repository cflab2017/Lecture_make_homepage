-- ============================================
-- 과제01 정답: 쇼핑몰 DB 스키마 설계
-- ============================================

-- ─────────────────────────────────────────
-- 1. 회원 테이블
--    쇼핑몰에 가입한 사용자 정보를 저장
-- ─────────────────────────────────────────
CREATE TABLE users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT, -- 회원 고유 번호 (자동 증가)
    username   TEXT    NOT NULL UNIQUE,           -- 로그인 아이디 (중복 불가)
    password   TEXT    NOT NULL,                  -- 비밀번호 (실제로는 해시 저장)
    email      TEXT    NOT NULL UNIQUE,           -- 이메일 (중복 불가)
    created_at TEXT    DEFAULT (datetime('now'))  -- 가입일시
);

-- ─────────────────────────────────────────
-- 2. 상품 테이블
--    판매할 상품 정보를 저장
-- ─────────────────────────────────────────
CREATE TABLE products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT, -- 상품 고유 번호
    name        TEXT    NOT NULL,                  -- 상품명
    price       INTEGER NOT NULL,                  -- 가격 (원 단위)
    stock       INTEGER DEFAULT 0,                 -- 재고 수량
    category    TEXT,                              -- 카테고리 (예: '전자제품', '의류')
    description TEXT                               -- 상품 설명
);

-- ─────────────────────────────────────────
-- 3. 주문 테이블
--    회원이 생성한 주문 하나를 나타냄
--    (여러 상품을 담은 장바구니 전체)
-- ─────────────────────────────────────────
CREATE TABLE orders (
    id          INTEGER PRIMARY KEY AUTOINCREMENT, -- 주문 고유 번호
    user_id     INTEGER NOT NULL,                  -- 주문한 회원 (FK → users.id)
    status      TEXT    DEFAULT 'pending',         -- 주문 상태 (pending/paid/shipped/done)
    total_price INTEGER NOT NULL,                  -- 주문 총 금액
    ordered_at  TEXT    DEFAULT (datetime('now')), -- 주문 일시
    FOREIGN KEY (user_id) REFERENCES users(id)    -- 외래키: users 테이블 참조
);

-- ─────────────────────────────────────────
-- 4. 주문 상품 테이블 (중간 테이블)
--    주문 하나에 여러 상품이 포함될 수 있으므로
--    orders와 products를 연결하는 중간 테이블
--    → N:M 관계를 1:N + N:1 로 분리
-- ─────────────────────────────────────────
CREATE TABLE order_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT, -- 주문상품 고유 번호
    order_id    INTEGER NOT NULL,                  -- 어느 주문 (FK → orders.id)
    product_id  INTEGER NOT NULL,                  -- 어느 상품 (FK → products.id)
    quantity    INTEGER NOT NULL DEFAULT 1,        -- 수량
    unit_price  INTEGER NOT NULL,                  -- 주문 시점 단가 (상품 가격이 나중에 바뀔 수 있으므로 별도 저장)
    FOREIGN KEY (order_id)   REFERENCES orders(id),   -- 외래키: orders 테이블 참조
    FOREIGN KEY (product_id) REFERENCES products(id)  -- 외래키: products 테이블 참조
);

-- ─────────────────────────────────────────
-- 텍스트 ERD
-- ─────────────────────────────────────────
--
--  users (1) ──── (N) orders (1) ──── (N) order_items (N) ──── (1) products
--
--  설명:
--  - 한 회원(users)은 여러 주문(orders)을 할 수 있다 → 1:N
--  - 한 주문(orders)에 여러 주문상품(order_items)이 있다 → 1:N
--  - 한 상품(products)이 여러 주문상품(order_items)에 포함될 수 있다 → 1:N
--  - orders와 products는 order_items를 통해 N:M 관계
-- ─────────────────────────────────────────

-- ─────────────────────────────────────────
-- 샘플 데이터
-- ─────────────────────────────────────────
INSERT INTO users (username, password, email) VALUES
    ('kim', 'hashed_pw_1', 'kim@shop.com'),
    ('lee', 'hashed_pw_2', 'lee@shop.com');

INSERT INTO products (name, price, stock, category) VALUES
    ('노트북',    1500000, 10, '전자제품'),
    ('마우스',      30000, 50, '전자제품'),
    ('키보드',      80000, 30, '전자제품');

-- 김철수의 주문 (노트북 1개 + 마우스 2개)
INSERT INTO orders (user_id, total_price) VALUES (1, 1560000);

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
    (1, 1, 1, 1500000),  -- 노트북 1개
    (1, 2, 2,   30000);  -- 마우스 2개

-- 주문 내역 조회 (JOIN 예시)
SELECT
    u.username,
    o.id        AS order_id,
    p.name      AS product_name,
    oi.quantity,
    oi.unit_price,
    (oi.quantity * oi.unit_price) AS subtotal
FROM order_items oi
JOIN orders   o ON oi.order_id   = o.id
JOIN users    u ON o.user_id     = u.id
JOIN products p ON oi.product_id = p.id;
