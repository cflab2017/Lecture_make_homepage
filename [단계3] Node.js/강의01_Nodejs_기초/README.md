# 강의 01 — Node.js 기초

## 1. Node.js란?

Node.js는 **Chrome V8 엔진** 위에서 동작하는 서버 사이드 JavaScript 런타임입니다.
웹 브라우저 없이도 컴퓨터에서 직접 JavaScript 코드를 실행할 수 있습니다.

```
브라우저 환경: JavaScript → V8 엔진 → DOM/BOM API
Node.js 환경: JavaScript → V8 엔진 → Node.js API (fs, http, os ...)
```

---

## 2. 설치 확인

```bash
node --version    # Node.js 버전 확인 (v18 이상 권장)
npm --version     # npm 버전 확인
```

설치가 안 되어 있다면 [https://nodejs.org](https://nodejs.org) 에서 LTS 버전을 설치합니다.

---

## 3. REPL (Read-Eval-Print Loop)

터미널에 `node`를 입력하면 대화형 환경이 열립니다.

```bash
$ node
> 1 + 2
3
> 'Hello' + ' World'
'Hello World'
> Math.max(3, 7, 1)
7
> .exit    # 종료
```

---

## 4. 모듈 시스템

### CommonJS (기본, .js 파일)

```js
// 내보내기
module.exports = { add, subtract };

// 가져오기
const { add } = require('./math');
const fs = require('fs');       // 내장 모듈
const dayjs = require('dayjs'); // npm 패키지
```

### ESM (ES Modules, .mjs 또는 package.json에 "type":"module")

```js
// 내보내기
export function add(a, b) { return a + b; }

// 가져오기
import { add } from './math.js';
import fs from 'fs';
```

> 이 강의에서는 CommonJS를 기본으로 사용합니다.

---

## 5. 파일 실행

```bash
node app.js                   # 기본 실행
node app.js 홍길동             # 인수 전달
node app.js 10 + 20           # 여러 인수 전달
```

---

## 6. process 객체

Node.js의 전역 객체로, 현재 실행 중인 프로세스 정보를 담고 있습니다.

```js
process.argv       // 실행 인수 배열 (0: node 경로, 1: 파일 경로, 2~: 전달 인수)
process.env        // 환경 변수 객체
process.cwd()      // 현재 작업 디렉토리
process.exit(0)    // 프로세스 종료 (0: 정상, 1: 오류)
process.platform   // 운영체제 ('win32', 'darwin', 'linux')
```

### process.argv 예시

```bash
node app.js 홍길동
```

```js
console.log(process.argv);
// ['node경로', 'app.js경로', '홍길동']
// 인수는 index 2부터 시작
const name = process.argv[2]; // '홍길동'
```

---

## 학습 포인트 정리

| 개념 | 설명 |
|------|------|
| Node.js | 브라우저 밖에서 JS를 실행하는 런타임 |
| REPL | 터미널에서 JS를 즉시 실행하는 대화형 환경 |
| CommonJS | `require` / `module.exports` 방식 |
| ESM | `import` / `export` 방식 |
| process | 현재 Node 프로세스의 전역 정보 객체 |
