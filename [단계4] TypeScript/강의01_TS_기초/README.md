# 강의 01 — TypeScript 기초

## 1. TypeScript가 필요한 이유

### JavaScript의 한계 — 타입 오류는 런타임에만 발견됨

```js
// 문제 1: 함수 인수 타입 오류
function add(a, b) {
  return a + b;
}
add('10', 20); // '1020' — 의도와 다른 결과, 오류도 아님!

// 문제 2: 없는 프로퍼티 접근
const user = { name: '홍길동', age: 30 };
console.log(user.email.toUpperCase()); // 런타임 오류!
// TypeError: Cannot read properties of undefined

// 문제 3: null 참조
function greet(user) {
  return '안녕하세요, ' + user.name;
}
greet(null); // 런타임 오류!
```

### TypeScript로 해결

```ts
// 컴파일 시점에 바로 오류 발견!
function add(a: number, b: number): number {
  return a + b;
}
add('10', 20); // 오류: 'string'은 'number'에 할당할 수 없음

const user = { name: '홍길동', age: 30 };
console.log(user.email); // 오류: 'email' 프로퍼티가 존재하지 않음
```

---

## 2. TypeScript 설치

```bash
# 전역 설치
npm install -g typescript

# 버전 확인
tsc --version

# 또는 프로젝트 로컬 설치
npm install --save-dev typescript
npx tsc --version
```

---

## 3. tsc 컴파일

```bash
# .ts 파일 → .js 파일로 컴파일
tsc hello.ts
node hello.js  # 생성된 .js 파일 실행

# 감시 모드 (파일 변경 시 자동 컴파일)
tsc --watch hello.ts

# tsconfig.json이 있으면 그냥 tsc
tsc
```

---

## 4. tsconfig.json

TypeScript 컴파일 설정 파일입니다.

```bash
tsc --init  # tsconfig.json 자동 생성
```

```json
{
  "compilerOptions": {
    "target": "ES2020",       // 컴파일 대상 JS 버전
    "module": "commonjs",     // 모듈 시스템
    "outDir": "./dist",       // 컴파일 결과 폴더
    "rootDir": "./src",       // 소스 파일 폴더
    "strict": true,           // 엄격 모드 (권장)
    "esModuleInterop": true   // CommonJS 모듈 호환
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## 5. TS Playground

브라우저에서 바로 TypeScript를 실험할 수 있습니다.

- 주소: [https://www.typescriptlang.org/play](https://www.typescriptlang.org/play)
- 설치 없이 TypeScript 코드 작성 및 컴파일 결과 확인

---

## 6. 기본 타입

```ts
// 기본 타입 선언
let name: string = '홍길동';
let age: number = 30;
let isActive: boolean = true;

// any: 타입 검사를 건너뜀 (되도록 사용 자제)
let anything: any = '문자열';
anything = 42;       // 오류 없음
anything = true;     // 오류 없음

// unknown: any보다 안전한 버전
let input: unknown = '입력값';
// input.toUpperCase(); // 오류: 먼저 타입 확인 필요
if (typeof input === 'string') {
  input.toUpperCase(); // OK — 타입 확인 후 사용
}

// 배열
let numbers: number[] = [1, 2, 3];
let names: string[] = ['김철수', '이영희'];
let mixed: (string | number)[] = ['a', 1, 'b', 2];

// 튜플: 길이와 각 요소의 타입이 고정된 배열
let point: [number, number] = [10, 20];
let entry: [string, number] = ['나이', 25];

// null / undefined
let nullable: string | null = null;
let optional: number | undefined = undefined;
```

---

## 학습 포인트 정리

| 개념 | 설명 |
|------|------|
| TypeScript | JS에 타입을 추가한 언어, 컴파일 후 JS로 변환 |
| `tsc` | TypeScript 컴파일러 |
| `tsconfig.json` | 컴파일 옵션 설정 파일 |
| `string/number/boolean` | 기본 원시 타입 |
| `any` | 모든 타입 허용 (사용 자제) |
| `unknown` | 타입 확인 후 사용하는 안전한 any |
