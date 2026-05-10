# 강의06 — MongoDB 기초

## 학습 목표

- NoSQL과 MongoDB의 핵심 개념을 이해한다
- MongoDB Atlas 무료 클러스터를 생성할 수 있다
- Mongoose로 Node.js와 MongoDB를 연결할 수 있다
- Schema/Model을 정의하고 CRUD를 구현할 수 있다
- MongoDB를 선택해야 할 상황을 판단할 수 있다

---

## 1. NoSQL — 문서/컬렉션 개념

MongoDB는 데이터를 **JSON과 유사한 문서(Document)** 형태로 저장합니다.

### 용어 비교

| SQL (관계형) | MongoDB | 설명 |
|-------------|---------|------|
| 데이터베이스 | Database | 같음 |
| 테이블 | Collection | 문서의 묶음 |
| 행(Row) | Document | 하나의 데이터 단위 |
| 열(Column) | Field | 데이터의 속성 |
| 기본키(PK) | `_id` | 자동 생성 ObjectId |

### 문서 예시

```json
// memos 컬렉션의 문서 하나
{
    "_id": "64a7c8e3f9b12345678abcde",
    "title": "오늘 할 일",
    "content": "MongoDB 공부하기",
    "tags": ["공부", "개발"],
    "author": {
        "name": "김철수",
        "email": "kim@example.com"
    },
    "createdAt": "2024-03-15T10:00:00.000Z"
}
```

**특징:** 관련 데이터를 문서 안에 중첩(embed) 가능 → JOIN 없이 하나의 쿼리로 조회

---

## 2. MongoDB Atlas 무료 클러스터 생성

### 가입 및 클러스터 생성

1. [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) 접속
2. 회원 가입
3. `Build a Database` → **Free (M0)** 선택
4. 클라우드: AWS / 지역: Seoul (ap-northeast-2)
5. 클러스터 이름: `Cluster0`
6. `Create` 클릭

### 접속 설정

1. `Database Access` → 사용자 추가 (비밀번호 기록!)
2. `Network Access` → `Add IP Address` → `Allow Access from Anywhere`
3. `Connect` → `Connect your application` → Node.js → Connection String 복사

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myDatabase?retryWrites=true&w=majority
```

---

## 3. Mongoose 설치 및 연결

```bash
npm install mongoose express dotenv
```

```js
// .env 파일
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myDB

// server.js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB 연결 성공'))
    .catch((err) => console.error('연결 실패:', err));
```

---

## 4. Schema / Model 정의

```js
const mongoose = require('mongoose');

// 1. Schema 정의 — 문서의 구조와 타입 지정
const memoSchema = new mongoose.Schema(
    {
        title:   { type: String, required: true },
        content: { type: String, required: true },
        tags:    [String],                         // 문자열 배열
        isPublic:{ type: Boolean, default: false },
    },
    {
        timestamps: true, // createdAt, updatedAt 자동 추가
    }
);

// 2. Model 생성 — 컬렉션과 연결
// mongoose.model('모델명', 스키마) → 컬렉션명은 자동으로 소문자 복수형 (Memo → memos)
const Memo = mongoose.model('Memo', memoSchema);

module.exports = Memo;
```

---

## 5. CRUD 메서드

### Create

```js
// 방법 1: new + save()
const memo = new Memo({ title: '제목', content: '내용', tags: ['공부'] });
await memo.save();

// 방법 2: create() (권장)
const memo = await Memo.create({ title: '제목', content: '내용' });
```

### Read

```js
// 전체 조회
const memos = await Memo.find();

// 조건 조회
const memos = await Memo.find({ tags: '공부' });        // 배열에 '공부' 포함
const memos = await Memo.find({ isPublic: true });

// 정렬 + 제한
const memos = await Memo.find().sort({ createdAt: -1 }).limit(10);

// 단건 조회
const memo = await Memo.findById('64a7c8e3f9b12345678abcde');
const memo = await Memo.findOne({ title: '오늘 할 일' });
```

### Update

```js
// ID로 수정 (수정된 문서 반환)
const updated = await Memo.findByIdAndUpdate(
    id,
    { title: '새 제목' },
    { new: true }  // new: true → 수정 후 문서 반환 (기본은 수정 전)
);
```

### Delete

```js
// ID로 삭제
await Memo.findByIdAndDelete(id);
```

---

## 6. 언제 MongoDB를 선택하는가?

### MongoDB가 유리한 경우

- 데이터 구조가 자주 바뀌는 프로젝트
- 문서 안에 배열/중첩 객체가 많은 경우 (예: 태그, 댓글 배열)
- 대용량 비정형 데이터 (로그, 이벤트 데이터)
- 빠른 수평 확장이 필요한 경우

### RDB가 유리한 경우

- 데이터 간 복잡한 관계가 많은 경우
- 금융/결제 등 트랜잭션 무결성이 중요한 경우
- 정해진 스키마로 데이터 일관성이 중요한 경우

---

## 예제 파일

- `예제/server.js` — Mongoose 연결 및 Express 서버
- `예제/models/Memo.js` — Memo 스키마/모델
- `예제/routes/memo.js` — Memo CRUD 라우터

### 실행 방법

```bash
cd 예제
npm install
# .env 파일에 MONGODB_URI 설정 후
node server.js
```
