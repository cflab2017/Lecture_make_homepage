# 강의03 — SQL 심화

## 학습 목표

- JOIN으로 여러 테이블을 연결할 수 있다
- GROUP BY와 집계 함수로 통계를 낼 수 있다
- 서브쿼리를 작성할 수 있다
- 인덱스로 쿼리 성능을 개선할 수 있다

---

## 1. JOIN — 테이블 연결

### INNER JOIN

두 테이블에서 **공통 조건이 일치하는 행만** 반환합니다.

```sql
-- users 테이블과 orders 테이블을 연결
SELECT users.name, orders.total_price, orders.status
FROM orders
INNER JOIN users ON orders.user_id = users.id;
```

```
[결과] 매칭된 행만 포함
users 테이블        orders 테이블
kim  ──── (match) ──── 주문1, 주문2
lee  ──── (match) ──── 주문3
park ──── (no match) → 결과에서 제외
```

### LEFT JOIN

왼쪽 테이블의 **모든 행을 포함**, 오른쪽에 매칭 없으면 NULL

```sql
-- 주문이 없는 회원도 포함
SELECT users.name, orders.total_price
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
-- 주문 없는 회원 → total_price가 NULL로 표시
```

### RIGHT JOIN / FULL JOIN

SQLite는 RIGHT JOIN / FULL OUTER JOIN을 직접 지원하지 않습니다.  
LEFT JOIN 방향을 바꾸거나 UNION을 사용합니다.

### 3개 테이블 JOIN

```sql
SELECT
    u.name        AS 회원명,
    p.name        AS 상품명,
    oi.quantity   AS 수량,
    oi.unit_price AS 단가
FROM order_items oi
INNER JOIN orders   o ON oi.order_id   = o.id
INNER JOIN users    u ON o.user_id     = u.id
INNER JOIN products p ON oi.product_id = p.id;
```

---

## 2. GROUP BY — 그룹 집계

`GROUP BY`는 특정 컬럼 값이 같은 행들을 하나의 그룹으로 묶습니다.

```sql
-- 카테고리별 상품 수
SELECT category, COUNT(*) AS 상품수
FROM products
GROUP BY category;

-- 카테고리별 평균 가격
SELECT category, AVG(price) AS 평균가격
FROM products
GROUP BY category;
```

### 집계 함수

| 함수 | 설명 |
|------|------|
| `COUNT(*)` | 행 수 |
| `COUNT(컬럼)` | NULL 제외 행 수 |
| `SUM(컬럼)` | 합계 |
| `AVG(컬럼)` | 평균 |
| `MAX(컬럼)` | 최대값 |
| `MIN(컬럼)` | 최소값 |

---

## 3. HAVING — 그룹 조건 필터링

`WHERE`는 그룹화 전 행 필터, `HAVING`은 그룹화 후 필터입니다.

```sql
-- 주문 건수가 2건 이상인 회원만 조회
SELECT user_id, COUNT(*) AS 주문수
FROM orders
GROUP BY user_id
HAVING COUNT(*) >= 2;

-- WHERE와 HAVING 함께 사용
SELECT category, AVG(price) AS 평균가격
FROM products
WHERE stock > 0          -- 재고 있는 상품만 (행 필터)
GROUP BY category
HAVING AVG(price) > 50000; -- 평균가격 5만원 이상인 카테고리만 (그룹 필터)
```

---

## 4. 서브쿼리 (Subquery)

쿼리 안에 또 다른 쿼리를 넣는 방식입니다.

```sql
-- 평균 가격보다 비싼 상품 조회
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);
--             ↑ 서브쿼리: 평균 가격을 먼저 계산

-- 특정 회원이 주문한 상품 이름 조회
SELECT name
FROM products
WHERE id IN (
    SELECT product_id
    FROM order_items
    WHERE order_id IN (
        SELECT id FROM orders WHERE user_id = 1
    )
);
```

---

## 5. 인덱스 (INDEX)

인덱스는 책의 **색인**과 같습니다. 자주 검색하는 컬럼에 인덱스를 추가하면 성능이 향상됩니다.

```sql
-- 인덱스 생성
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_products_category ON products(category);

-- 복합 인덱스 (여러 컬럼)
CREATE INDEX idx_order_items_order_product ON order_items(order_id, product_id);

-- 인덱스 목록 확인
.indexes

-- 인덱스 삭제
DROP INDEX idx_orders_user_id;
```

### EXPLAIN QUERY PLAN — 실행 계획 확인

```sql
-- 인덱스 사용 여부 확인
EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE user_id = 1;
-- 출력: SEARCH TABLE orders USING INDEX idx_orders_user_id (user_id=?)
--        ↑ 인덱스 사용 중!

-- 인덱스 없을 때
-- 출력: SCAN TABLE orders
--        ↑ 전체 테이블 스캔 (느림)
```

### 인덱스 사용 기준

- 자주 `WHERE` 조건에 사용되는 컬럼
- `JOIN` 연결 컬럼 (외래키)
- `ORDER BY`에 자주 사용되는 컬럼
- 단, 쓰기 성능이 약간 저하됨 (모든 컬럼에 인덱스를 걸지 않음)

---

## 예제 파일

- `예제/advanced.sql` — 주문-상품-유저 3테이블 조인 쿼리 모음

---

## 다음 강의

강의04에서는 Node.js에서 SQLite를 직접 연동하여 CRUD API를 만들어봅니다.
