// ===================================================
// 강의 05 예제 — 할 일 목록 REST API
// 실행: node api.js
// 테스트: http://localhost:3000/api/todos
//
// 사전 준비:
//   npm init -y
//   npm install express
// ===================================================

const express = require('express');
const app = express();
const PORT = 3000;

// ① JSON 요청 바디 파싱 미들웨어 (필수)
app.use(express.json());

// ② 인메모리 데이터 저장소 (서버 재시작 시 초기화)
let todos = [
  { id: 1, title: 'Node.js 강의 듣기', done: false },
  { id: 2, title: 'Express 예제 실습', done: true },
  { id: 3, title: 'REST API 만들기', done: false },
];

// ID 자동 증가를 위한 카운터
let nextId = 4;

// ③ 헬퍼 함수 — ID로 할 일 찾기
const findTodo = (id) => todos.find((t) => t.id === id);

// ============================================================
// 라우트 정의
// ============================================================

// GET /api/todos — 전체 할 일 목록 조회
app.get('/api/todos', (req, res) => {
  // 쿼리스트링으로 필터링 가능: /api/todos?done=true
  const { done } = req.query;

  let result = todos;
  if (done !== undefined) {
    // 'true'/'false' 문자열을 boolean으로 변환
    const isDone = done === 'true';
    result = todos.filter((t) => t.done === isDone);
  }

  res.json({
    success: true,
    count: result.length,
    data: result,
  });
});

// GET /api/todos/:id — 특정 할 일 조회
app.get('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id); // URL 파라미터는 문자열이므로 숫자 변환
  const todo = findTodo(id);

  if (!todo) {
    // 없으면 404 응답
    return res.status(404).json({
      success: false,
      error: `ID ${id}인 할 일을 찾을 수 없습니다.`,
    });
  }

  res.json({ success: true, data: todo });
});

// POST /api/todos — 새 할 일 생성
app.post('/api/todos', (req, res) => {
  const { title, done } = req.body;

  // 유효성 검사 — title 필수
  if (!title || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'title 필드는 필수입니다.',
    });
  }

  // 새 할 일 객체 생성
  const newTodo = {
    id: nextId++,          // ID 자동 부여 후 증가
    title: title.trim(),   // 앞뒤 공백 제거
    done: done || false,   // done 기본값 false
  };

  todos.push(newTodo); // 배열에 추가

  // 201 Created: 생성 성공 시 사용하는 상태 코드
  res.status(201).json({
    success: true,
    message: '할 일이 생성되었습니다.',
    data: newTodo,
  });
});

// PUT /api/todos/:id — 할 일 전체 수정
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = findTodo(id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      error: `ID ${id}인 할 일을 찾을 수 없습니다.`,
    });
  }

  const { title, done } = req.body;

  // 유효성 검사
  if (!title || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'title 필드는 필수입니다.',
    });
  }

  // 기존 객체 수정 (전체 교체)
  todo.title = title.trim();
  todo.done = done !== undefined ? done : todo.done;

  res.json({
    success: true,
    message: '할 일이 수정되었습니다.',
    data: todo,
  });
});

// DELETE /api/todos/:id — 할 일 삭제
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id); // 인덱스 찾기

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `ID ${id}인 할 일을 찾을 수 없습니다.`,
    });
  }

  // splice로 배열에서 제거 (인덱스, 삭제 개수)
  const deleted = todos.splice(index, 1)[0];

  res.json({
    success: true,
    message: '할 일이 삭제되었습니다.',
    data: deleted,
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`할 일 REST API 서버: http://localhost:${PORT}`);
  console.log('\n=== 사용 가능한 엔드포인트 ===');
  console.log('GET    /api/todos       - 전체 조회');
  console.log('GET    /api/todos/:id   - 단건 조회');
  console.log('POST   /api/todos       - 생성');
  console.log('PUT    /api/todos/:id   - 수정');
  console.log('DELETE /api/todos/:id   - 삭제');
});
