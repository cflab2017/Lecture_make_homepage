# 강의05 — Prisma ORM

## 학습 목표

- Prisma가 무엇인지 이해하고 설치할 수 있다
- schema.prisma 파일로 데이터 모델을 정의할 수 있다
- 마이그레이션으로 DB 스키마를 관리할 수 있다
- Prisma Client로 CRUD 작업을 할 수 있다
- 1:N 관계를 스키마에서 표현할 수 있다

---

## 1. Prisma란?

**Prisma:** Node.js/TypeScript를 위한 차세대 ORM

```
schema.prisma (모델 정의)
    ↓ npx prisma migrate dev
DB 테이블 자동 생성
    ↓
Prisma Client (자동 생성 코드)
    ↓ 사용
JavaScript 코드에서 타입 안전한 DB 조작
```

### 기존 방식 vs Prisma

```js
// 기존 방식 (better-sqlite3)
const users = db.prepare('SELECT * FROM users WHERE age > ?').all(20);

// Prisma 방식
const users = await prisma.user.findMany({
    where: { age: { gt: 20 } }
});
```

---

## 2. 설치 및 초기화

```bash
# 새 프로젝트에서
npm init -y
npm install @prisma/client
npm install -D prisma

# Prisma 초기화 (SQLite 사용)
npx prisma init --datasource-provider sqlite
```

생성되는 파일:
```
prisma/
└── schema.prisma   ← 모델 정의 파일
.env                ← DATABASE_URL 환경변수
```

---

## 3. schema.prisma — 모델 정의

```prisma
// prisma/schema.prisma

generator client {
    provider = "prisma-client-js"
}

datasource db {
    provider = "sqlite"
    url      = env("DATABASE_URL")
}

// 사용자 모델
model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    name      String
    posts     Post[]   // 1:N 관계 — 한 유저는 여러 포스트
    createdAt DateTime @default(now())
}

// 포스트 모델
model Post {
    id        Int      @id @default(autoincrement())
    title     String
    content   String
    published Boolean  @default(false)
    author    User     @relation(fields: [authorId], references: [id])
    authorId  Int      // 외래키
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
```

### 주요 속성

| 속성 | 설명 |
|------|------|
| `@id` | 기본키 |
| `@default(autoincrement())` | 자동 증가 |
| `@unique` | 유니크 제약조건 |
| `@default(now())` | 현재 시각 기본값 |
| `@updatedAt` | 수정 시 자동 갱신 |
| `@relation(...)` | 관계 정의 |

---

## 4. 마이그레이션

```bash
# 마이그레이션 생성 및 적용 (개발용)
npx prisma migrate dev --name init

# 마이그레이션 목록 확인
npx prisma migrate status

# Prisma Studio — DB GUI 도구
npx prisma studio
```

---

## 5. Prisma Client CRUD

```js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 생성 (Create)
const user = await prisma.user.create({
    data: { email: 'kim@example.com', name: '김철수' }
});

// 전체 조회 (Read - Many)
const users = await prisma.user.findMany();

// 조건 조회
const activeUsers = await prisma.user.findMany({
    where: { posts: { some: { published: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10,  // LIMIT
});

// 단일 조회 (없으면 null)
const user = await prisma.user.findUnique({
    where: { id: 1 }
});

// 수정 (Update)
const updated = await prisma.user.update({
    where: { id: 1 },
    data: { name: '김영수' }
});

// 삭제 (Delete)
await prisma.user.delete({
    where: { id: 1 }
});
```

---

## 6. 관계 데이터 다루기

```js
// 유저와 포스트를 함께 조회 (include)
const userWithPosts = await prisma.user.findUnique({
    where: { id: 1 },
    include: { posts: true }
});

// 포스트 생성 시 유저 연결
const post = await prisma.post.create({
    data: {
        title: '첫 번째 포스트',
        content: '내용',
        author: { connect: { id: 1 } }  // 기존 유저와 연결
    }
});

// 유저와 포스트 동시 생성 (중첩 create)
const userWithPost = await prisma.user.create({
    data: {
        name: '이영희',
        email: 'lee@example.com',
        posts: {
            create: [
                { title: '포스트 1', content: '내용 1' }
            ]
        }
    }
});
```

---

## 예제 파일

- `예제/schema.prisma` — User-Post 1:N 관계 스키마
- `예제/prisma/seed.js` — 초기 데이터 삽입 스크립트
- `예제/api.js` — Prisma를 사용한 Express API

### 실행 방법

```bash
cd 예제
npm install
npx prisma migrate dev --name init
node prisma/seed.js
node api.js
```

---

## 다음 강의

강의06에서는 NoSQL 데이터베이스인 MongoDB를 Mongoose로 연동합니다.
