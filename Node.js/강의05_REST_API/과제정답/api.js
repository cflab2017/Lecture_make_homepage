// ===================================================
// 과제 05 정답 — 메모 REST API
// 실행: node api.js
// 테스트: http://localhost:3000/api/memos
// ===================================================

const express = require('express');
const app = express();
const PORT = 3000;

// JSON 요청 바디 파싱 미들웨어
app.use(express.json());

// ① 인메모리 메모 저장소 (초기 더미 데이터 포함)
let memos = [
  {
    id: Date.now() - 2000,                          // ID: 현재 시간 기반
    title: '첫 번째 메모',
    content: 'Node.js REST API 첫 번째 메모입니다.',
    createdAt: new Date(Date.now() - 2000).toISOString(), // 생성 시각 ISO 형식
  },
  {
    id: Date.now() - 1000,
    title: '두 번째 메모',
    content: 'Express로 REST API를 만드는 중입니다.',
    createdAt: new Date(Date.now() - 1000).toISOString(),
  },
];

// ② 헬퍼: 숫자 ID로 메모 찾기
const findMemo = (id) => memos.find((m) => m.id === id);

// ============================================================
// GET /api/memos — 전체 메모 조회 (검색 + 정렬 지원)
// ============================================================
app.get('/api/memos', (req, res) => {
  const { title, sort } = req.query;

  let result = [...memos]; // 원본 배열을 건드리지 않도록 복사

  // 제목 검색 필터: title 쿼리스트링이 있으면 포함 검색
  if (title) {
    result = result.filter((m) =>
      m.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  // 정렬: 기본값은 newest (최신순 = id 내림차순)
  if (sort === 'oldest') {
    result.sort((a, b) => a.id - b.id); // 오래된 순 (오름차순)
  } else {
    result.sort((a, b) => b.id - a.id); // 최신 순 (내림차순)
  }

  res.json({
    success: true,
    count: result.length,
    data: result,
  });
});

// ============================================================
// GET /api/memos/:id — 특정 메모 조회
// ============================================================
app.get('/api/memos/:id', (req, res) => {
  // URL 파라미터는 문자열 → 숫자로 변환 (Date.now()는 숫자)
  const id = Number(req.params.id);
  const memo = findMemo(id);

  if (!memo) {
    return res.status(404).json({
      success: false,
      error: `ID ${id}인 메모를 찾을 수 없습니다.`,
    });
  }

  res.json({ success: true, data: memo });
});

// ============================================================
// POST /api/memos — 새 메모 생성
// ============================================================
app.post('/api/memos', (req, res) => {
  const { title, content } = req.body;

  // title은 필수값 — 없으면 400 오류 반환
  if (!title || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'title 필드는 필수입니다.',
    });
  }

  // 새 메모 객체 생성
  const newMemo = {
    id: Date.now(),                    // 유닉스 타임스탬프를 ID로 사용
    title: title.trim(),              // 앞뒤 공백 제거
    content: (content || '').trim(), // content는 선택 사항
    createdAt: new Date().toISOString(), // 생성 시각 ISO 형식으로 저장
  };

  memos.push(newMemo); // 배열에 추가

  // 201 Created: 자원 생성 성공 시 사용
  res.status(201).json({
    success: true,
    message: '메모가 생성되었습니다.',
    data: newMemo,
  });
});

// ============================================================
// PUT /api/memos/:id — 메모 수정
// ============================================================
app.put('/api/memos/:id', (req, res) => {
  const id = Number(req.params.id);
  const memo = findMemo(id);

  // 해당 ID의 메모가 없으면 404 반환
  if (!memo) {
    return res.status(404).json({
      success: false,
      error: `ID ${id}인 메모를 찾을 수 없습니다.`,
    });
  }

  const { title, content } = req.body;

  // 수정 요청에도 title 필수
  if (!title || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'title 필드는 필수입니다.',
    });
  }

  // 기존 메모 직접 수정 (createdAt은 변경하지 않음)
  memo.title = title.trim();
  memo.content = content !== undefined ? content.trim() : memo.content;

  res.json({
    success: true,
    message: '메모가 수정되었습니다.',
    data: memo,
  });
});

// ============================================================
// DELETE /api/memos/:id — 메모 삭제
// ============================================================
app.delete('/api/memos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = memos.findIndex((m) => m.id === id); // 인덱스 찾기

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `ID ${id}인 메모를 찾을 수 없습니다.`,
    });
  }

  // splice(시작인덱스, 삭제개수) — 삭제된 요소를 반환
  const [deleted] = memos.splice(index, 1);

  res.json({
    success: true,
    message: '메모가 삭제되었습니다.',
    data: deleted,
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`메모 REST API 서버: http://localhost:${PORT}`);
  console.log('\n=== 엔드포인트 목록 ===');
  console.log('GET    /api/memos            - 전체 조회 (title=검색어, sort=oldest)');
  console.log('GET    /api/memos/:id        - 단건 조회');
  console.log('POST   /api/memos            - 생성 (body: title, content)');
  console.log('PUT    /api/memos/:id        - 수정 (body: title, content)');
  console.log('DELETE /api/memos/:id        - 삭제');
});
