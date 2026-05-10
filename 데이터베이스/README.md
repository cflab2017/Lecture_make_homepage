# 데이터베이스 과목

## 과목 소개

데이터를 영구적으로 저장하고 효율적으로 관리하는 방법을 학습합니다.  
JSON 파일 방식의 한계에서 시작하여 SQLite(관계형 DB), Prisma ORM, MongoDB(NoSQL)까지 단계별로 다룹니다.

**선수 조건:** Node.js 과목 완료

---

## 강의 목록

| 강의 | 주제 | 핵심 내용 |
|------|------|-----------|
| 강의01 | DB 개념 | RDBMS vs NoSQL, SQL 소개, SQLite 특징 |
| 강의02 | SQL 기초 | CREATE, INSERT, SELECT, UPDATE, DELETE |
| 강의03 | SQL 심화 | JOIN, GROUP BY, 집계함수, 서브쿼리, 인덱스 |
| 강의04 | Node + SQLite | better-sqlite3, Express CRUD API |
| 강의05 | Prisma ORM | 스키마 정의, 마이그레이션, 관계 설정 |
| 강의06 | MongoDB 기초 | NoSQL 개념, Mongoose, Atlas 연결 |

---

## 학습 목표

- 데이터베이스의 필요성과 종류를 이해한다
- SQL로 데이터를 생성, 조회, 수정, 삭제할 수 있다
- Node.js 애플리케이션에서 DB를 연동할 수 있다
- ORM을 사용해 타입 안전한 DB 조작을 할 수 있다
- 상황에 맞는 DB를 선택할 수 있다

---

## 환경 설정

```bash
# SQLite 관련
npm install better-sqlite3

# Prisma ORM
npm install prisma @prisma/client
npx prisma init

# MongoDB / Mongoose
npm install mongoose
```

---

## 참고 자료

- [SQLite 공식 문서](https://www.sqlite.org/docs.html)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [MongoDB 공식 문서](https://www.mongodb.com/docs/)
- [DB Browser for SQLite](https://sqlitebrowser.org/)
