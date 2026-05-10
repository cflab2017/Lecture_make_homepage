# 강의 02 — 타입 선언

## 1. 변수 타입 선언

```ts
// 명시적 타입 선언
let name: string = '홍길동';
let age: number = 30;
let active: boolean = true;

// 타입 추론 — 초기값으로 타입 자동 결정 (명시 불필요)
let city = '서울';  // string으로 추론
let score = 100;   // number로 추론
```

---

## 2. 함수 매개변수와 반환 타입

```ts
// 기본 형태
function 함수명(매개변수: 타입): 반환타입 {
  return 값;
}

// 예시
function add(a: number, b: number): number {
  return a + b;
}

// 화살표 함수
const multiply = (a: number, b: number): number => a * b;
```

---

## 3. 선택적 매개변수 (?)

`?`를 붙이면 호출 시 해당 인수를 생략할 수 있습니다.

```ts
function greet(name: string, title?: string): string {
  if (title) {
    return `안녕하세요, ${title} ${name}님!`;
  }
  return `안녕하세요, ${name}님!`;
}

greet('홍길동');          // OK
greet('홍길동', '선생님'); // OK
```

---

## 4. 기본값 매개변수

```ts
function createUser(name: string, role: string = 'user'): object {
  return { name, role };
}

createUser('홍길동');          // { name: '홍길동', role: 'user' }
createUser('관리자', 'admin'); // { name: '관리자', role: 'admin' }
```

---

## 5. void와 never

```ts
// void: 반환값이 없는 함수
function logMessage(msg: string): void {
  console.log(msg);
  // return; 이나 return undefined는 가능
}

// never: 절대 반환하지 않는 함수 (오류 던지기, 무한 루프)
function throwError(message: string): never {
  throw new Error(message); // 항상 오류를 던짐
}

function infiniteLoop(): never {
  while (true) {} // 무한 루프
}
```

---

## 6. 타입 추론

TypeScript는 값을 보고 타입을 자동으로 결정합니다.

```ts
let x = 10;          // number로 추론
let y = 'hello';     // string으로 추론
let z = true;        // boolean으로 추론
let arr = [1, 2, 3]; // number[]로 추론

// 함수 반환 타입도 추론됨
function double(n: number) {
  return n * 2; // 반환 타입: number로 추론
}
```

---

## 7. 타입 단언 (as)

TypeScript가 타입을 추론하지 못할 때, 개발자가 직접 타입을 지정합니다.

```ts
// HTML 요소 접근 시 자주 사용
const input = document.getElementById('username') as HTMLInputElement;
input.value = '홍길동'; // HTMLElement에는 value가 없지만 단언 후 사용 가능

// 다른 표현 방식 (JSX에서는 사용 불가)
const input2 = <HTMLInputElement>document.getElementById('username');

// unknown 타입 단언
let data: unknown = '문자열 데이터';
const str = data as string;
console.log(str.toUpperCase());
```

> 타입 단언은 실제 타입을 바꾸는 게 아닙니다. 오남용 주의!

---

## 학습 포인트 정리

| 개념 | 문법 | 설명 |
|------|------|------|
| 함수 타입 | `(a: T): R` | 매개변수와 반환 타입 |
| 선택적 매개변수 | `param?: T` | 생략 가능한 매개변수 |
| 기본값 | `param = value` | 생략 시 사용할 기본값 |
| `void` | `: void` | 반환값 없음 |
| `never` | `: never` | 절대 반환 안 함 |
| 타입 추론 | (자동) | 초기값으로 타입 결정 |
| 타입 단언 | `as T` | 개발자가 직접 타입 지정 |
