-- ============================================
-- 과제03 정답: 통계 쿼리 작성
-- ============================================
-- 실행 전: 강의03 예제/advanced.sql을 먼저 실행하여 데이터 준비
-- ============================================

-- ─────────────────────────────────────────
-- 쿼리 1. 카테고리별 매출 통계
-- order_items와 products를 JOIN한 뒤
-- 카테고리로 그룹화하여 총매출, 판매수량, 평균단가를 계산
-- ─────────────────────────────────────────
SELECT
    p.category                               AS 카테고리,
    SUM(oi.quantity * oi.unit_price)         AS 총매출,       -- 수량 × 단가 합계
    SUM(oi.quantity)                         AS 판매수량,     -- 총 팔린 개수
    CAST(AVG(oi.unit_price) AS INTEGER)      AS 평균단가      -- 평균 판매 단가 (정수 변환)
FROM order_items oi
INNER JOIN products p ON oi.product_id = p.id  -- 상품 정보 연결
GROUP BY p.category                            -- 카테고리별 묶기
ORDER BY 총매출 DESC;                          -- 매출 높은 순

-- ─────────────────────────────────────────
-- 쿼리 2. 월별 주문 수 및 매출
-- strftime('%Y-%m', ordered_at)으로 연-월 문자열을 추출
-- 예: '2024-01-15' → '2024-01'
-- 주문(orders)과 주문상품(order_items)을 JOIN하여 매출 계산
-- ─────────────────────────────────────────
SELECT
    strftime('%Y-%m', o.ordered_at)          AS 연월,        -- 연-월 추출
    COUNT(DISTINCT o.id)                     AS 주문건수,    -- 중복 없이 주문 수 세기
    SUM(oi.quantity * oi.unit_price)         AS 총매출       -- 해당 월 총 매출
FROM orders o
INNER JOIN order_items oi ON o.id = oi.order_id  -- 주문별 상품 연결
GROUP BY strftime('%Y-%m', o.ordered_at)          -- 연월별 그룹화
ORDER BY 연월 ASC;                                 -- 날짜 오름차순

-- ─────────────────────────────────────────
-- 쿼리 3. 회원별 구매 순위
-- 여러 테이블을 3중 JOIN하여 회원 기준으로 집계
-- COUNT(DISTINCT product_id)로 구매한 상품 종류 수 계산
-- ─────────────────────────────────────────
SELECT
    u.username                                AS 회원명,
    SUM(oi.quantity * oi.unit_price)          AS 총구매액,       -- 누적 구매 금액
    COUNT(DISTINCT oi.product_id)             AS 구매상품종류수   -- 중복 제거한 상품 종류 수
FROM order_items oi
INNER JOIN orders o ON oi.order_id = o.id   -- 주문 연결
INNER JOIN users  u ON o.user_id   = u.id   -- 회원 연결
GROUP BY u.id, u.username                   -- 회원별 그룹화
ORDER BY 총구매액 DESC;                      -- 구매액 높은 순

-- ─────────────────────────────────────────
-- 쿼리 4. 베스트셀러 상품 TOP 5
-- 상품별로 판매 수량과 총 매출을 계산
-- ORDER BY + LIMIT으로 상위 5개만 추출
-- ─────────────────────────────────────────
SELECT
    p.name                                   AS 상품명,
    p.category                               AS 카테고리,
    SUM(oi.quantity)                         AS 총판매수량,  -- 팔린 개수 합계
    SUM(oi.quantity * oi.unit_price)         AS 총매출       -- 해당 상품 총 매출
FROM order_items oi
INNER JOIN products p ON oi.product_id = p.id  -- 상품 정보 연결
GROUP BY p.id, p.name, p.category              -- 상품별 그룹화
ORDER BY 총판매수량 DESC                        -- 많이 팔린 순
LIMIT 5;                                        -- 상위 5개

-- ─────────────────────────────────────────
-- 쿼리 5. 주문이 없는 회원 목록
-- LEFT JOIN을 사용하면 users의 모든 행을 포함
-- 주문이 없는 회원은 orders.id가 NULL → WHERE로 필터링
-- ─────────────────────────────────────────
SELECT
    u.username   AS 회원명,
    u.email      AS 이메일
FROM users u
LEFT JOIN orders o ON u.id = o.user_id  -- 주문 없어도 회원은 포함
WHERE o.id IS NULL;                     -- 주문이 없는 경우만 (NULL인 경우)
