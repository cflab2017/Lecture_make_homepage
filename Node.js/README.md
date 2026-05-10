# Node.js 과목 소개

## Node.js란?

**Node.js**는 Chrome V8 JavaScript 엔진으로 빌드된 **서버 사이드 JavaScript 런타임**입니다.
브라우저 밖에서 JavaScript를 실행할 수 있게 해주며, 웹 서버, CLI 도구, API 서버 등 다양한 용도로 사용됩니다.

### 주요 특징

- **비동기 I/O**: 이벤트 루프 기반으로 동시에 많은 요청을 처리
- **단일 스레드**: 하나의 스레드로 효율적으로 작업 처리
- **NPM 생태계**: 100만 개 이상의 패키지 활용 가능
- **JavaScript 통일**: 프론트엔드와 동일한 언어로 백엔드 개발

### 선수 조건

- HTML/CSS 기초
- JavaScript 기초 (변수, 함수, 배열, 객체, 비동기)

---

## 강의 목록

| 강의 | 주제 | 주요 내용 |
|------|------|-----------|
| 강의 01 | Node.js 기초 | REPL, CommonJS, ESM, process 객체 |
| 강의 02 | 내장 모듈 | fs, path, os, events |
| 강의 03 | npm 패키지 | package.json, npm, nodemon, dayjs |
| 강의 04 | Express 기초 | 라우팅, 미들웨어, 정적 파일 |
| 강의 05 | REST API | HTTP 메서드, JSON 응답, 상태 코드 |
| 강의 06 | 파일 DB | JSON 파일 영속화, dotenv, 환경 변수 |

---

## 개발 환경 준비

```bash
# Node.js 설치 확인
node --version   # v18.x 이상 권장
npm --version

# VS Code 확장 추천
# - ESLint
# - Prettier
# - REST Client (또는 Thunder Client)
```

## 학습 목표

이 과목을 마치면 다음을 할 수 있습니다:

1. Node.js로 파일을 읽고 쓰는 CLI 도구 만들기
2. Express로 웹 서버와 REST API 구축
3. JSON 파일로 데이터를 영속적으로 저장
4. npm 패키지를 활용한 실용적인 서버 개발
