// ============================================
// 강의06 예제: Mongoose 연결 + Express 서버
// ============================================
// 실행 전:
//   1. .env 파일에 MONGODB_URI 설정
//   2. npm install mongoose express dotenv
//   3. node server.js
// ============================================

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // .env 파일 로드

const app = express();
const PORT = process.env.PORT || 3000;

// JSON 요청 바디 파싱
app.use(express.json());

// ─────────────────────────────────────────
// 1. MongoDB 연결
//    MONGODB_URI는 .env 파일에서 읽어옴
// ─────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB 연결 성공!');
    })
    .catch((err) => {
        console.error('MongoDB 연결 실패:', err.message);
        process.exit(1); // 연결 실패 시 서버 종료
    });

// 연결 이벤트 모니터링
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB 연결 끊김');
});

// ─────────────────────────────────────────
// 2. 라우터 등록
// ─────────────────────────────────────────
const memoRouter = require('./routes/memo');
app.use('/memos', memoRouter); // /memos 경로에 메모 라우터 연결

// 기본 경로
app.get('/', (req, res) => {
    res.json({
        message: '메모 API 서버',
        endpoints: {
            'GET    /memos':            '전체 메모 목록',
            'GET    /memos?tag=태그':   '태그로 필터링',
            'GET    /memos/:id':        '단일 메모 조회',
            'POST   /memos':            '메모 생성',
            'PUT    /memos/:id':        '메모 수정',
            'DELETE /memos/:id':        '메모 삭제',
        },
    });
});

// ─────────────────────────────────────────
// 3. 서버 시작
// ─────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});
