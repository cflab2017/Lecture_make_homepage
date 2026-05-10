# 강의 02 — 내장 모듈

## 1. fs 모듈 (File System)

파일을 읽고, 쓰고, 삭제하는 등 파일 시스템을 다루는 모듈입니다.

```js
const fs = require('fs');
```

### 동기 방식 (Sync) — 완료될 때까지 대기

```js
// 파일 읽기
const content = fs.readFileSync('data.txt', 'utf-8');
console.log(content);

// 파일 쓰기 (없으면 생성, 있으면 덮어씀)
fs.writeFileSync('output.txt', '저장할 내용', 'utf-8');

// 파일 존재 여부 확인
const exists = fs.existsSync('data.txt'); // true / false

// 디렉토리 파일 목록
const files = fs.readdirSync('./');
```

### 비동기 방식 (Async) — 콜백 또는 Promise

```js
// 콜백 방식
fs.readFile('data.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Promise 방식 (fs/promises)
const fs = require('fs/promises');
const data = await fs.readFile('data.txt', 'utf-8');
```

---

## 2. path 모듈

파일 경로를 안전하게 다루는 모듈입니다. OS마다 다른 경로 구분자(`/`, `\`)를 알아서 처리합니다.

```js
const path = require('path');

path.join('/users', 'john', 'file.txt')  // '/users/john/file.txt'
path.resolve('data', 'output.txt')       // 절대 경로로 변환
path.dirname('/users/john/file.txt')     // '/users/john'
path.basename('/users/john/file.txt')    // 'file.txt'
path.extname('readme.md')               // '.md'

// __dirname: 현재 파일이 있는 디렉토리의 절대 경로
const fullPath = path.join(__dirname, 'data', 'input.txt');
```

---

## 3. os 모듈

운영체제 관련 정보를 얻는 모듈입니다.

```js
const os = require('os');

os.platform()   // 'win32', 'darwin', 'linux'
os.homedir()    // '/Users/john' (홈 디렉토리)
os.hostname()   // 컴퓨터 이름
os.cpus()       // CPU 정보 배열
os.totalmem()   // 전체 메모리 (bytes)
os.freemem()    // 여유 메모리 (bytes)
```

---

## 4. events 모듈 (EventEmitter)

이벤트를 발생시키고 구독하는 패턴을 구현할 수 있습니다.

```js
const EventEmitter = require('events');

const emitter = new EventEmitter();

// 이벤트 구독 (리스너 등록)
emitter.on('data', (message) => {
  console.log('데이터 수신:', message);
});

// 이벤트 발생 (emit)
emitter.emit('data', '안녕하세요!');

// 한 번만 실행되는 리스너
emitter.once('connect', () => {
  console.log('최초 연결!');
});
```

---

## 학습 포인트 정리

| 모듈 | 주요 용도 | 자주 쓰는 메서드 |
|------|-----------|-----------------|
| `fs` | 파일 읽기/쓰기 | readFileSync, writeFileSync, readdirSync |
| `path` | 경로 처리 | join, resolve, dirname, extname |
| `os` | OS 정보 | platform, homedir, cpus |
| `events` | 이벤트 패턴 | on, emit, once |
