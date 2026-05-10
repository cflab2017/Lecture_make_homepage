// ===================================================
// 과제 06 정답 — JSON 파일 기반 블로그 API
// 실행: node app.js
// 테스트: http://localhost:3000/api/posts
// ===================================================

// dotenv: .env 파일의 환경 변수를 process.env에 로드
// 파일 최상단에 위치해야 함
require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // .env의 PORT 값 사용, 없으면 3000

app.use(express.json()); // JSON 요청 바디 파싱

// ① 파일 경로 상수 정의
const DATA_DIR = path.join(__dirname, 'data');          // 데이터 폴더
const DB_PATH = path.join(DATA_DIR, 'posts.json');      // 블로그 포스트 JSON 파일

// ② 서버 시작 시 data 폴더 자동 생성 (없는 경우)
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true }); // recursive: 중간 폴더도 함께 생성
  console.log(`data 폴더 생성: ${DATA_DIR}`);
}

// ③ 데이터 읽기 헬퍼 함수
function readPosts() {
  if (!fs.existsSync(DB_PATH)) return []; // 파일 없으면 빈 배열

  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8'); // 파일 읽기
    return JSON.parse(raw);                        // JSON 문자열 → 배열
  } catch (err) {
    console.error('DB 읽기 실패:', err.message);
    return [];
  }
}

// ④ 데이터 쓰기 헬퍼 함수
function writePosts(posts) {
  // JSON.stringify(값, replacer, 들여쓰기공백수)
  // null: replacer 없음, 2: 2칸 들여쓰기로 보기 좋게 저장
  const json = JSON.stringify(posts, null, 2);
  fs.writeFileSync(DB_PATH, json, 'utf-8');
}

// ============================================================
// GET /api/posts — 전체 포스트 조회 (필터링 + 페이지네이션)
// ============================================================
app.get('/api/posts', (req, res) => {
  let posts = readPosts();
  const { author, tag, page, limit } = req.query;

  // 작성자 필터링: ?author=홍길동
  if (author) {
    posts = posts.filter((p) =>
      p.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  // 태그 필터링: ?tag=node.js
  if (tag) {
    posts = posts.filter((p) =>
      Array.isArray(p.tags) && p.tags.includes(tag)
    );
  }

  // 최신순 정렬 (createdAt 내림차순)
  posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // 페이지네이션: ?page=1&limit=5
  if (page && limit) {
    const pageNum = parseInt(page);   // 현재 페이지 (1부터 시작)
    const limitNum = parseInt(limit); // 페이지당 개수
    const startIdx = (pageNum - 1) * limitNum; // 시작 인덱스
    const endIdx = startIdx + limitNum;         // 끝 인덱스

    const total = posts.length;
    posts = posts.slice(startIdx, endIdx); // 해당 범위만 추출

    return res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: posts,
    });
  }

  res.json({ success: true, count: posts.length, data: posts });
});

// ============================================================
// GET /api/posts/:id — 특정 포스트 조회
// ============================================================
app.get('/api/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const posts = readPosts();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({
      success: false,
      error: `ID ${id}인 포스트를 찾을 수 없습니다.`,
    });
  }

  res.json({ success: true, data: post });
});

// ============================================================
// POST /api/posts — 포스트 생성
// ============================================================
app.post('/api/posts', (req, res) => {
  const { title, content, author, tags } = req.body;

  // title, content, author 필수값 검사
  if (!title || !content || !author) {
    return res.status(400).json({
      success: false,
      error: 'title, content, author 필드는 필수입니다.',
    });
  }

  const posts = readPosts(); // 기존 데이터 읽기

  const newPost = {
    id: Date.now(),                       // 유닉스 타임스탬프를 ID로 사용
    title: title.trim(),
    content: content.trim(),
    author: author.trim(),
    tags: Array.isArray(tags) ? tags : [], // tags가 배열이 아니면 빈 배열
    createdAt: new Date().toISOString(),   // 생성 시각 자동 추가 (ISO 형식)
    updatedAt: null,                       // 처음 생성 시 수정 시각은 null
  };

  posts.push(newPost);  // 새 포스트 추가
  writePosts(posts);    // JSON 파일에 저장

  res.status(201).json({
    success: true,
    message: '포스트가 생성되었습니다.',
    data: newPost,
  });
});

// ============================================================
// PUT /api/posts/:id — 포스트 수정
// ============================================================
app.put('/api/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const posts = readPosts();
  const index = posts.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `ID ${id}인 포스트를 찾을 수 없습니다.`,
    });
  }

  const { title, content, author, tags } = req.body;

  // 수정 시에도 title, content, author 필수
  if (!title || !content || !author) {
    return res.status(400).json({
      success: false,
      error: 'title, content, author 필드는 필수입니다.',
    });
  }

  // 기존 포스트 업데이트 (스프레드로 기존 데이터 유지 + 새 값 덮어쓰기)
  posts[index] = {
    ...posts[index],                       // id, createdAt 등 기존 값 유지
    title: title.trim(),
    content: content.trim(),
    author: author.trim(),
    tags: Array.isArray(tags) ? tags : posts[index].tags,
    updatedAt: new Date().toISOString(),   // 수정 시각 자동 갱신
  };

  writePosts(posts); // 파일에 저장

  res.json({
    success: true,
    message: '포스트가 수정되었습니다.',
    data: posts[index],
  });
});

// ============================================================
// DELETE /api/posts/:id — 포스트 삭제
// ============================================================
app.delete('/api/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const posts = readPosts();
  const index = posts.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `ID ${id}인 포스트를 찾을 수 없습니다.`,
    });
  }

  const [deleted] = posts.splice(index, 1); // 배열에서 제거
  writePosts(posts); // 파일에 저장

  res.json({
    success: true,
    message: '포스트가 삭제되었습니다.',
    data: deleted,
  });
});

// 서버 시작
app.listen(PORT, () => {
  const env = process.env.NODE_ENV || 'development';
  console.log(`[${env}] 블로그 API 서버: http://localhost:${PORT}`);
  console.log(`데이터 파일: ${DB_PATH}`);
  console.log('서버를 재시작해도 데이터가 유지됩니다!');
});
