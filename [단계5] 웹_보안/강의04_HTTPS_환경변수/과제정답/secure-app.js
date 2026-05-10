// ============================================
// 과제04 정답: 환경변수로 시크릿 분리
// ============================================
// 실행 전:
//   1. npm install express dotenv
//   2. cp .env.example .env
//   3. .env 파일에 실제 값 입력
//   4. node secure-app.js
// ============================================

// dotenv: .env 파일의 내용을 process.env에 로드
// 반드시 다른 require보다 먼저 호출해야 함
require('dotenv').config();

const express = require('express');
const app = express();

// ─────────────────────────────────────────
// 1. 필수 환경변수 검증 함수
//    시크릿이 설정되지 않으면 서버 시작을 거부
//    빈 문자열도 허용하지 않음
// ─────────────────────────────────────────
function validateEnv() {
    const required = [
        'MONGODB_URI',    // DB 연결 문자열
        'JWT_SECRET',     // JWT 서명 키
        'SESSION_SECRET', // 세션 암호화 키
    ];

    const missing = required.filter(key => !process.env[key] || process.env[key].trim() === '');

    if (missing.length > 0) {
        console.error('');
        console.error('══════════════════════════════════════════');
        console.error('  [오류] 필수 환경변수가 설정되지 않았습니다');
        console.error('══════════════════════════════════════════');
        console.error('  누락된 변수:', missing.join(', '));
        console.error('  .env.example을 복사하여 .env 파일을 만들고');
        console.error('  실제 값으로 교체하세요.');
        console.error('══════════════════════════════════════════');
        console.error('');
        process.exit(1); // 환경변수 없으면 서버 시작 거부
    }

    // JWT 시크릿 길이 검증 (최소 32자)
    if (process.env.JWT_SECRET.length < 32) {
        console.error('[경고] JWT_SECRET이 너무 짧습니다. 최소 32자 이상을 권장합니다.');
        process.exit(1);
    }

    console.log('환경변수 검증 통과');
}

// 서버 시작 전 검증 실행
validateEnv();

// ─────────────────────────────────────────
// 2. 환경변수에서 설정값 읽기
//    process.env 직접 사용 대신 별도 변수에 저장
//    → 타입 변환, 기본값 처리를 한 곳에서 관리
// ─────────────────────────────────────────
const config = {
    port:           parseInt(process.env.PORT) || 3000,   // 숫자로 변환, 기본값 3000
    nodeEnv:        process.env.NODE_ENV || 'development',
    mongodbUri:     process.env.MONGODB_URI,              // DB 연결 문자열
    jwtSecret:      process.env.JWT_SECRET,               // JWT 서명 키
    sessionSecret:  process.env.SESSION_SECRET,           // 세션 키
    apiKey:         process.env.EXTERNAL_API_KEY,         // 외부 API 키 (선택)
};

// 설정 요약 출력 (값은 숨기고 존재 여부만)
console.log('서버 설정:');
console.log('  환경:', config.nodeEnv);
console.log('  포트:', config.port);
console.log('  DB 연결:', config.mongodbUri ? '설정됨' : '미설정');
console.log('  JWT 시크릿:', config.jwtSecret ? '설정됨' : '미설정');

// ─────────────────────────────────────────
// 3. Express 앱 설정
// ─────────────────────────────────────────
app.use(express.json());

// ─────────────────────────────────────────
// 4. 라우트
// ─────────────────────────────────────────

// GET / — 서버 상태 확인
app.get('/', (req, res) => {
    res.json({
        status:  'OK',
        env:     config.nodeEnv,
        message: '환경변수가 올바르게 설정되어 있습니다.',

        // ✓ 환경변수 값은 절대 응답에 포함하지 않음!
        // jwtSecret: config.jwtSecret  ← 절대 금지
        // mongodbUri: config.mongodbUri ← 절대 금지

        // 존재 여부만 반환 (값은 숨김)
        configured: {
            database:      !!config.mongodbUri,
            jwtSecret:     !!config.jwtSecret,
            sessionSecret: !!config.sessionSecret,
            externalApi:   !!config.apiKey,
        },
    });
});

// GET /data — 외부 API 호출 예시 (환경변수에서 키 사용)
app.get('/data', async (req, res) => {
    if (!config.apiKey) {
        return res.status(503).json({
            error: '외부 API 키가 설정되지 않았습니다. .env 파일을 확인하세요.',
        });
    }

    try {
        // 환경변수에서 API 키를 가져와 헤더에 포함
        // 코드에 키를 직접 쓰지 않음
        const response = await fetch('https://api.example.com/data', {
            headers: { 'Authorization': `Bearer ${config.apiKey}` }
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('[API 에러]', err.message); // 로그에는 상세 기록
        res.status(500).json({ error: '외부 서비스 연결에 실패했습니다.' });
    }
});

// ─────────────────────────────────────────
// 5. 서버 시작
// ─────────────────────────────────────────
app.listen(config.port, () => {
    console.log(`서버 실행: http://localhost:${config.port}`);
});
