// ============================================
// 강의04 예제: Express 보안 헤더 미들웨어
// ============================================
// 실행:
//   npm install express dotenv helmet
//   cp .env.example .env
//   node security-headers.js
// ============================================

require('dotenv').config(); // .env 파일 로드 (최상단에 위치해야 함)

const express = require('express');
const app     = express();

const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────
// 1. 환경변수 검증
//    필수 환경변수가 없으면 서버 시작 거부
// ─────────────────────────────────────────
const REQUIRED_ENV = ['JWT_SECRET', 'SESSION_SECRET'];

const missing = REQUIRED_ENV.filter(key => !process.env[key]);
if (missing.length > 0) {
    console.error(`[필수 환경변수 누락] ${missing.join(', ')}`);
    console.error('.env 파일을 확인하세요. (.env.example 참조)');
    process.exit(1); // 시크릿 없으면 서버 시작 거부
}

// ─────────────────────────────────────────
// 2. 보안 헤더 미들웨어 (직접 구현 버전)
//    실제 프로젝트에서는 helmet 라이브러리 사용 권장
// ─────────────────────────────────────────
function securityHeaders(req, res, next) {
    // HSTS (HTTP Strict Transport Security)
    // 브라우저에게 이 사이트는 항상 HTTPS로 접근하라고 지시
    // 개발 환경에서는 주석 처리 (localhost는 HTTPS 불필요)
    // res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    // X-Frame-Options: 클릭재킹(Clickjacking) 방지
    // SAMEORIGIN: 같은 도메인의 iframe에서만 허용
    // DENY: 모든 iframe 금지
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    // X-Content-Type-Options: MIME 타입 스니핑 방지
    // 브라우저가 Content-Type을 무시하고 파일 내용으로 타입을 추측하는 것 방지
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Referrer-Policy: 링크 클릭 시 이전 URL 노출 제한
    // strict-origin-when-cross-origin: 같은 도메인은 전체 URL, 다른 도메인은 출처만
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // X-XSS-Protection: 오래된 브라우저의 내장 XSS 필터 활성화
    // 최신 브라우저에서는 CSP가 대체
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Permissions-Policy: 브라우저 기능 접근 제어
    // geolocation, camera, microphone 등의 권한 제한
    res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');

    // Content-Security-Policy: 리소스 출처 제한 (XSS 방어 핵심)
    // 개발 환경용 (프로덕션에서는 더 엄격하게 설정)
    res.setHeader('Content-Security-Policy', [
        "default-src 'self'",           // 기본: 같은 도메인만 허용
        "script-src 'self'",            // 스크립트: 같은 도메인만
        "style-src 'self' 'unsafe-inline'", // CSS: 인라인 허용 (가능하면 제거)
        "img-src 'self' data: https:",  // 이미지: 같은 도메인 + data URL + HTTPS
        "font-src 'self'",              // 폰트: 같은 도메인만
        "connect-src 'self'",           // AJAX/WebSocket: 같은 도메인만
        "frame-ancestors 'self'",       // iframe으로 포함 허용: 같은 도메인만
    ].join('; '));

    // Server 헤더 제거: 서버 소프트웨어 정보 노출 방지
    res.removeHeader('X-Powered-By'); // Express 기본 헤더 제거

    next();
}

// 모든 요청에 보안 헤더 적용
app.use(securityHeaders);

// ─────────────────────────────────────────
// 3. 라우트
// ─────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        message: '보안 헤더가 적용된 서버입니다.',
        hint:    'Chrome DevTools → Network → 응답 헤더를 확인하세요.',
        headers: {
            'X-Frame-Options':       res.getHeader('X-Frame-Options'),
            'X-Content-Type-Options':res.getHeader('X-Content-Type-Options'),
            'Referrer-Policy':       res.getHeader('Referrer-Policy'),
        },
    });
});

// 환경변수 테스트 (시크릿은 절대 응답에 포함하지 않음)
app.get('/config', (req, res) => {
    res.json({
        env:     process.env.NODE_ENV || 'development',
        port:    PORT,
        // JWT_SECRET: process.env.JWT_SECRET  ← 절대 이렇게 노출하면 안 됨!
        hasJwtSecret:     !!process.env.JWT_SECRET,     // 존재 여부만 반환
        hasSessionSecret: !!process.env.SESSION_SECRET, // 값은 절대 반환 금지
    });
});

// ─────────────────────────────────────────
// 4. 서버 시작
// ─────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`보안 헤더 예제 서버: http://localhost:${PORT}`);
    console.log('Chrome DevTools > Network > 응답 헤더 확인');
});
