# 강의02 — SQL 기초

## 학습 목표

- CREATE TABLE로 테이블을 만들 수 있다
- INSERT로 데이터를 추가할 수 있다
- SELECT로 원하는 데이터를 조회할 수 있다
- UPDATE와 DELETE로 데이터를 수정/삭제할 수 있다
- 기본 데이터 타입과 제약조건을 이해한다

---

## 1. SQLite 데이터 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| `TEXT` | 문자열 | '김철수', 'hello' |
| `INTEGER` | 정수 | 42, -10, 0 |
| `REAL` | 실수 (소수점) | 3.14, 9.99 |
| `BLOB` | 이진 데이터 | 이미지, 파일 |
| `NULL` | 값 없음 | NULL |

---

## 2. CREATE TABLE — 테이블 만들기

```sql
CREATE TABLE 테이블명 (
    컬럼명  데이터타입  제약조건,
    컬럼명  데이터타입  제약조건
);
```

```sql
-- 예시: 책 테이블
CREATE TABLE books (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    title     TEXT    NOT NULL,
    author    TEXT    NOT NULL,
    price     INTEGER DEFAULT 0,
    isbn      TEXT    UNIQUE,
    published TEXT
);
```

### 주요 제약조건

| 제약조건 | 설명 |
|----------|------|
| `PRIMARY KEY` | 기본키 (행을 고유하게 식별) |
| `AUTOINCREMENT` | 자동으로 1씩 증가 |
| `NOT NULL` | NULL 값 금지 |
| `UNIQUE` | 중복값 금지 |
| `DEFAULT 값` | 값이 없을 때 기본값 |

---

## 3. INSERT — 데이터 추가

```sql
-- 방법 1: 모든 컬럼에 값 지정
INSERT INTO books VALUES (1, '클린 코드', '로버트 마틴', 30000, '978-0132350884', '2008-08-01');

-- 방법 2: 컬럼명 명시 (권장)
INSERT INTO books (title, author, price) VALUES ('리팩터링', '마틴 파울러', 35000);

-- 방법 3: 여러 행 동시 삽입
INSERT INTO books (title, author, price) VALUES
    ('자바스크립트 완벽 가이드', '데이비드 플래너건', 45000),
    ('파이썬 입문', '귀도 반 로썸', 28000);
```

---

## 4. SELECT — 데이터 조회

### 기본 조회

```sql
-- 전체 컬럼 조회
SELECT * FROM books;

-- 특정 컬럼만 조회
SELECT title, author, price FROM books;
```

### WHERE — 조건 필터링

```sql
-- 가격이 30000원 이상인 책
SELECT * FROM books WHERE price >= 30000;

-- 저자가 '마틴 파울러'인 책
SELECT * FROM books WHERE author = '마틴 파울러';

-- AND / OR 조합
SELECT * FROM books WHERE price >= 20000 AND price <= 40000;
SELECT * FROM books WHERE author = '마틴 파울러' OR author = '로버트 마틴';

-- LIKE — 패턴 검색
SELECT * FROM books WHERE title LIKE '%자바%';  -- '자바'가 포함된 제목

-- NULL 검색
SELECT * FROM books WHERE isbn IS NULL;
SELECT * FROM books WHERE isbn IS NOT NULL;
```

### ORDER BY — 정렬

```sql
-- 가격 오름차순
SELECT * FROM books ORDER BY price ASC;

-- 가격 내림차순
SELECT * FROM books ORDER BY price DESC;

-- 여러 기준 정렬 (저자 오름차순, 같은 저자면 가격 내림차순)
SELECT * FROM books ORDER BY author ASC, price DESC;
```

### LIMIT — 결과 개수 제한

```sql
-- 처음 5개만
SELECT * FROM books LIMIT 5;

-- 6번째부터 5개 (페이지네이션)
SELECT * FROM books LIMIT 5 OFFSET 5;
```

---

## 5. UPDATE — 데이터 수정

```sql
-- 특정 행 수정
UPDATE books SET price = 32000 WHERE id = 1;

-- 여러 컬럼 동시 수정
UPDATE books SET price = 32000, title = '클린 코드 2판' WHERE id = 1;

-- 조건 없이 수정 → 전체 행 수정 (주의!)
UPDATE books SET price = 0;  -- 모든 책의 가격이 0이 됨!
```

> **주의:** `WHERE` 절 없이 `UPDATE`하면 모든 행이 수정됩니다.

---

## 6. DELETE — 데이터 삭제

```sql
-- 특정 행 삭제
DELETE FROM books WHERE id = 3;

-- 조건에 맞는 여러 행 삭제
DELETE FROM books WHERE price < 10000;

-- 전체 삭제 (주의!)
DELETE FROM books;
```

> **주의:** `WHERE` 절 없이 `DELETE`하면 모든 데이터가 삭제됩니다.

---

## 7. 실습 흐름

```bash
# 1. SQLite CLI 실행
sqlite3 library.db

# 2. SQL 파일 실행
.read 예제/queries.sql

# 3. 테이블 목록 확인
.tables

# 4. 테이블 구조 확인
.schema books

# 5. 종료
.quit
```

---

## 예제 파일

- `예제/queries.sql` — 도서 관리 DB 전체 예제

---

## 다음 강의

강의03에서는 여러 테이블을 연결하는 **JOIN**, 집계하는 **GROUP BY** 등 심화 SQL을 학습합니다.
