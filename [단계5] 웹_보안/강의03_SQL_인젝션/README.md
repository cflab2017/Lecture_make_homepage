# 강의03 — SQL 인젝션 방어

## 학습 목표

- SQL 인젝션의 원리와 공격 방식을 이해한다
- Prepared Statement로 인젝션을 방어할 수 있다
- ORM이 SQL 인젝션을 방어하는 이유를 이해한다
- 입력값 검증과 에러 메시지 처리의 중요성을 안다

---

## 1. SQL 인젝션이란?

**SQL Injection:** 공격자가 입력값에 SQL 문법을 삽입하여 의도하지 않은 쿼리를 실행시키는 공격

### 공격 예시

```js
// 취약한 코드: 사용자 입력을 문자열로 직접 쿼리에 삽입
const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
```

**공격자 입력:**
```
username: admin' --
password: 아무거나
```

**실제 실행되는 쿼리:**
```sql
SELECT * FROM users WHERE username = 'admin' --' AND password = '아무거나'
-- 이후는 주석 처리됨 → 비밀번호 확인 없이 admin으로 로그인!
```

---

## 2. 대표적인 SQL 인젝션 페이로드

```sql
-- 항상 참이 되는 조건
' OR '1'='1
' OR 1=1 --
" OR "1"="1

-- 주석으로 뒤 조건 무력화
admin' --
admin'/*

-- 여러 쿼리 실행 (UNION)
' UNION SELECT username, password FROM users --

-- 모든 데이터 삭제 (DROP)
'; DROP TABLE users; --
```

---

## 3. Prepared Statement (파라미터화 쿼리)

핵심 방어법입니다. SQL 문법과 데이터를 **분리**하여 처리합니다.

```js
// ⚠ 취약한 코드 (절대 사용 금지)
const query = `SELECT * FROM users WHERE username = '${username}'`;
db.query(query);

// ✓ 안전한 코드: Prepared Statement
// ? 또는 $1 등의 플레이스홀더 사용
const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?');
const user = stmt.get(username, password);
// username에 ' OR 1=1 --  를 입력해도 SQL로 해석되지 않음
// 그냥 문자열로 처리됨
```

### 왜 안전한가?

```
일반 쿼리:  SQL 파싱 → 데이터 삽입  → 실행
Prepared:  SQL 파싱 →       실행    → 데이터 바인딩

데이터가 SQL 파싱 단계에 개입하지 않으므로
아무리 SQL 문법을 넣어도 데이터로만 처리됨
```

---

## 4. ORM이 SQL 인젝션을 방어하는 이유

```js
// Prisma ORM (자동으로 Prepared Statement 사용)
const user = await prisma.user.findFirst({
    where: { username: username }
});
// 내부적으로: SELECT * FROM users WHERE username = $1
// username 값은 항상 데이터로 처리됨

// Mongoose (NoSQL이므로 SQL 인젝션 없음, NoSQL 인젝션 주의)
const user = await User.findOne({ username: username });
```

ORM은 내부적으로 항상 파라미터화 쿼리를 사용하므로 SQL 인젝션이 불가능합니다.

---

## 5. 입력값 검증 (화이트리스트)

Prepared Statement만으로 충분하지 않은 경우:

```js
// 동적 컬럼명이나 테이블명 — Prepared Statement로 해결 불가
// 화이트리스트로 허용된 값만 사용
const ALLOWED_SORT_COLUMNS = ['name', 'price', 'created_at'];
const ALLOWED_ORDERS        = ['ASC', 'DESC'];

function buildSafeQuery(sortBy, order) {
    // 화이트리스트 검증 (허용된 값이 아니면 기본값 사용)
    const safeColumn = ALLOWED_SORT_COLUMNS.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder  = ALLOWED_ORDERS.includes(order?.toUpperCase()) ? order.toUpperCase() : 'DESC';

    // 컬럼명은 직접 삽입 (화이트리스트로 안전이 보장됨)
    // 실제 데이터는 Prepared Statement로 처리
    return `SELECT * FROM products ORDER BY ${safeColumn} ${safeOrder}`;
}
```

---

## 6. 에러 메시지 노출 금지

```js
// 나쁜 예: SQL 에러를 그대로 노출
app.get('/search', (req, res) => {
    try {
        const results = db.prepare(`SELECT * FROM products WHERE name LIKE '%${req.query.q}%'`).all();
        res.json(results);
    } catch (err) {
        // ⚠ DB 구조와 에러 정보가 공격자에게 노출됨
        res.status(500).json({ error: err.message });
        // 예: "SQLITE_ERROR: no such table: users" → 테이블 이름 노출!
    }
});

// 좋은 예: 일반적인 에러 메시지만 반환
app.get('/search', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM products WHERE name LIKE ?');
        const results = stmt.all(`%${req.query.q}%`);
        res.json(results);
    } catch (err) {
        console.error('[에러]', err); // 서버 로그에는 상세 기록
        res.status(500).json({ error: '검색 중 오류가 발생했습니다.' }); // 클라이언트에는 최소 정보
    }
});
```

---

## 예제 파일

- `예제/vulnerable-login.js` — SQL 인젝션 취약한 로그인
- `예제/safe-login.js` — Prepared Statement로 방어된 로그인

### 실행

```bash
npm install express better-sqlite3
node 예제/safe-login.js
```

---

## 다음 강의

강의04에서는 HTTPS 설정, 보안 헤더, 환경변수 관리를 학습합니다.
