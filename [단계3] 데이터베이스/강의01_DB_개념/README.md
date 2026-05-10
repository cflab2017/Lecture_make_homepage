# 강의01 — 데이터베이스 개념

## 학습 목표

- 데이터베이스가 필요한 이유를 설명할 수 있다
- RDBMS와 NoSQL의 차이를 비교할 수 있다
- SQL의 역할을 이해한다
- SQLite를 설치하고 DB Browser for SQLite를 사용할 수 있다

---

## 1. JSON 파일의 한계

지금까지 데이터를 저장할 때 JSON 파일을 사용했습니다.

```js
// data.json
{
  "users": [
    { "id": 1, "name": "김철수", "email": "kim@example.com" }
  ]
}
```

### JSON 파일 방식의 문제점

| 문제 | 설명 |
|------|------|
| **동시 접근 충돌** | 두 사용자가 동시에 쓰면 데이터가 덮어씌워짐 |
| **검색 성능** | 10만 건 중 하나를 찾으려면 전체를 읽어야 함 |
| **관계 표현** | 유저-주문-상품의 관계를 표현하기 어려움 |
| **데이터 무결성** | 타입 검증, 중복 방지 등이 없음 |
| **동시 트랜잭션** | 여러 작업을 묶어서 처리할 수 없음 |

---

## 2. 데이터베이스란?

**데이터베이스(Database):** 구조화된 방식으로 데이터를 저장하고 관리하는 시스템

**DBMS(Database Management System):** DB를 관리하는 소프트웨어

```
애플리케이션 → DBMS → 데이터베이스(파일/디스크)
```

---

## 3. RDBMS vs NoSQL

### RDBMS (관계형 데이터베이스)

- 데이터를 **테이블(행과 열)** 로 저장
- SQL로 데이터를 조작
- 관계(Relationship)를 통해 여러 테이블 연결
- 대표: MySQL, PostgreSQL, SQLite, Oracle

```
[users 테이블]
id | name   | email
---|--------|------------------
1  | 김철수 | kim@example.com
2  | 이영희 | lee@example.com

[orders 테이블]
id | user_id | product | price
---|---------|---------|------
1  | 1       | 노트북  | 1500000
2  | 1       | 마우스  | 30000
```

### NoSQL (비관계형 데이터베이스)

- 다양한 형태로 저장 (문서, 키-값, 그래프 등)
- 유연한 스키마
- 수평 확장에 유리
- 대표: MongoDB(문서), Redis(키-값), Neo4j(그래프)

```json
// MongoDB 문서 예시
{
  "_id": "64abc123",
  "name": "김철수",
  "email": "kim@example.com",
  "orders": [
    { "product": "노트북", "price": 1500000 },
    { "product": "마우스", "price": 30000 }
  ]
}
```

### 비교 표

| 항목 | RDBMS | NoSQL |
|------|-------|-------|
| 데이터 구조 | 고정된 스키마 | 유연한 스키마 |
| 관계 표현 | JOIN으로 표현 | 문서 내 중첩 |
| 확장 방식 | 수직 확장 | 수평 확장 |
| 트랜잭션 | 강력한 지원 | 제한적 |
| 사용 사례 | 금융, 쇼핑몰 | SNS, 실시간 앱 |

---

## 4. SQL이란?

**SQL (Structured Query Language):** RDBMS를 조작하는 표준 언어

```sql
-- 데이터 조회
SELECT name, email FROM users WHERE id = 1;

-- 데이터 삽입
INSERT INTO users (name, email) VALUES ('김철수', 'kim@example.com');

-- 데이터 수정
UPDATE users SET email = 'new@example.com' WHERE id = 1;

-- 데이터 삭제
DELETE FROM users WHERE id = 1;
```

SQL은 거의 모든 RDBMS에서 동일하게 동작합니다.

---

## 5. SQLite 특징

SQLite는 **파일 하나**가 곧 데이터베이스입니다.

```
my-project/
├── app.js
├── database.db   ← 이 파일이 전체 DB
└── package.json
```

### SQLite 선택 이유

- 서버 설치 불필요 (파일 기반)
- 가볍고 빠름
- 학습 및 소규모 프로젝트에 적합
- Node.js와 연동 쉬움

### 실제 사용 사례

- 모바일 앱 로컬 DB (iOS/Android 내장)
- 브라우저 로컬 저장소
- 소규모 웹 서비스

---

## 6. DB Browser for SQLite 설치

GUI로 SQLite 파일을 확인하고 쿼리를 실행할 수 있는 도구입니다.

```bash
# macOS (Homebrew)
brew install --cask db-browser-for-sqlite

# Ubuntu/Debian
sudo apt-get install sqlitebrowser

# Windows
# https://sqlitebrowser.org/dl/ 에서 다운로드
```

### 사용법

1. `파일 > 데이터베이스 열기`로 `.db` 파일 선택
2. `데이터 보기` 탭에서 테이블 내용 확인
3. `SQL 실행` 탭에서 쿼리 직접 입력

---

## 예제 파일

- `예제/schema.sql` — 학생 테이블 CREATE 문

---

## 다음 강의

강의02에서는 실제 SQL 문법을 학습합니다.  
`CREATE TABLE`, `INSERT`, `SELECT`, `UPDATE`, `DELETE`를 직접 작성해봅니다.
