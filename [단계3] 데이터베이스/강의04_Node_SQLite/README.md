# 강의04 — Node.js + SQLite

## 학습 목표

- better-sqlite3를 설치하고 Node.js에서 SQLite를 사용할 수 있다
- prepare/run/get/all 메서드의 차이를 이해한다
- Express와 SQLite로 CRUD API를 만들 수 있다
- ORM의 개념과 필요성을 이해한다

---

## 1. better-sqlite3 소개

Node.js에서 SQLite를 사용하는 가장 인기 있는 라이브러리입니다.

### 왜 better-sqlite3인가?

- **동기식(Synchronous) API** — async/await 불필요, 코드가 단순
- 빠른 성능
- 준비된 구문(Prepared Statement)으로 SQL 인젝션 방지
- TypeScript 타입 정의 내장

```bash
# 설치
npm install better-sqlite3
npm install express
```

---

## 2. 기본 사용법

```js
const Database = require('better-sqlite3');

// 데이터베이스 파일 열기 (없으면 자동 생성)
const db = new Database('library.db');
```

### prepare() — SQL 준비

```js
// 쿼리를 미리 컴파일 (재사용 가능, 성능 좋음)
const stmt = db.prepare('SELECT * FROM books WHERE id = ?');
```

### run() — INSERT / UPDATE / DELETE

```js
// 데이터를 변경하는 쿼리 실행
const insert = db.prepare('INSERT INTO books (title, author) VALUES (?, ?)');
const result = insert.run('클린 코드', '로버트 마틴');

console.log(result.lastInsertRowid); // 삽입된 행의 ID
console.log(result.changes);         // 영향받은 행 수
```

### get() — 단일 행 조회

```js
// 결과가 하나인 SELECT (없으면 undefined 반환)
const stmt = db.prepare('SELECT * FROM books WHERE id = ?');
const book = stmt.get(1);

console.log(book); // { id: 1, title: '클린 코드', author: '로버트 마틴' }
```

### all() — 여러 행 조회

```js
// 결과가 여러 개인 SELECT (배열 반환)
const stmt = db.prepare('SELECT * FROM books WHERE category = ?');
const books = stmt.all('프로그래밍');

console.log(books); // [{ id: 1, ... }, { id: 2, ... }]
```

---

## 3. 메서드 비교

| 메서드 | 용도 | 반환값 |
|--------|------|--------|
| `run()` | INSERT/UPDATE/DELETE | `{ lastInsertRowid, changes }` |
| `get()` | SELECT 단일 행 | 객체 또는 `undefined` |
| `all()` | SELECT 여러 행 | 배열 (빈 배열 가능) |

---

## 4. 파라미터 바인딩

```js
// 위치 파라미터 (?)
const stmt = db.prepare('SELECT * FROM books WHERE price > ? AND category = ?');
stmt.all(20000, '프로그래밍');

// 이름 파라미터 (@name 형식)
const stmt2 = db.prepare('SELECT * FROM books WHERE price > @minPrice AND category = @cat');
stmt2.all({ minPrice: 20000, cat: '프로그래밍' });
```

---

## 5. 테이블 생성 (초기화)

```js
// 앱 시작 시 테이블이 없으면 생성
db.exec(`
    CREATE TABLE IF NOT EXISTS books (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        title   TEXT    NOT NULL,
        author  TEXT    NOT NULL,
        price   INTEGER DEFAULT 0
    )
`);
```

---

## 6. ORM의 개념과 필요성

**ORM (Object-Relational Mapping):** SQL 대신 JavaScript 객체로 DB를 조작하는 방법

### SQL 방식 (better-sqlite3)

```js
const book = db.prepare('SELECT * FROM books WHERE id = ?').get(1);
```

### ORM 방식 (Prisma)

```js
const book = await prisma.book.findUnique({ where: { id: 1 } });
```

### ORM의 장점

- SQL을 직접 작성하지 않아도 됨
- 타입 안전성 (TypeScript와 궁합 좋음)
- 복잡한 관계 처리를 추상화
- 마이그레이션 도구 제공

### ORM의 단점

- 복잡한 쿼리는 ORM으로 표현이 어려움
- 성능이 필요할 때 Raw SQL이 필요할 수 있음
- 추가 학습 비용

---

## 예제 파일

- `예제/app.js` — Express + better-sqlite3 책 목록 CRUD API

### 실행 방법

```bash
cd 예제
npm install
node app.js
```

### API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/books` | 전체 책 목록 |
| GET | `/books/:id` | 특정 책 조회 |
| POST | `/books` | 책 추가 |
| PUT | `/books/:id` | 책 수정 |
| DELETE | `/books/:id` | 책 삭제 |

---

## 다음 강의

강의05에서는 Prisma ORM을 사용해 더 체계적인 DB 관리를 배웁니다.
