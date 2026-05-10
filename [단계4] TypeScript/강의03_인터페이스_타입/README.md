# 강의 03 — 인터페이스와 타입

## 1. interface vs type alias

두 가지 모두 타입을 정의하는 방법입니다.

### interface

```ts
interface User {
  id: number;
  name: string;
  email: string;
}
```

### type alias

```ts
type User = {
  id: number;
  name: string;
  email: string;
};
```

### 주요 차이점

| 기능 | interface | type |
|------|-----------|------|
| 선언 병합 | O | X |
| 확장 | `extends` | `&` (교차 타입) |
| 유니온 정의 | X | O |
| 원시 타입 별칭 | X | O |

> **일반적 관례**: 객체 형태는 `interface`, 유니온/교차/원시 별칭은 `type`

---

## 2. 선택적 프로퍼티 (?)

```ts
interface Product {
  id: number;
  name: string;
  price: number;
  description?: string; // 있어도, 없어도 됨
  imageUrl?: string;    // 있어도, 없어도 됨
}

const product: Product = {
  id: 1,
  name: '노트북',
  price: 1500000,
  // description, imageUrl 없어도 OK
};
```

---

## 3. readonly

값을 한 번 설정하면 변경할 수 없습니다.

```ts
interface Config {
  readonly apiKey: string;
  readonly baseUrl: string;
  timeout: number;
}

const config: Config = {
  apiKey: 'abc123',
  baseUrl: 'https://api.example.com',
  timeout: 3000,
};

config.timeout = 5000;  // OK
config.apiKey = 'xyz'; // 오류: readonly 프로퍼티는 수정 불가
```

---

## 4. 인터페이스 확장 (extends)

```ts
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;  // Animal의 모든 필드 + breed 추가
}

const dog: Dog = {
  name: '멍멍이',
  age: 3,
  breed: '진돗개',
};
```

---

## 5. 유니온 타입 (|)

여러 타입 중 하나일 수 있음을 표현합니다.

```ts
type ID = string | number;  // 문자열 또는 숫자 ID

type Status = 'pending' | 'active' | 'inactive'; // 리터럴 유니온

let userId: ID = 123;
userId = 'user_abc'; // OK

let status: Status = 'active';
status = 'deleted'; // 오류: 'deleted'는 Status에 없음
```

---

## 6. 교차 타입 (&)

여러 타입을 합칩니다. (AND 조건)

```ts
type Admin = User & {
  permissions: string[];
  level: number;
};

const admin: Admin = {
  id: 1,
  name: '관리자',
  email: 'admin@example.com',
  permissions: ['read', 'write', 'delete'],
  level: 5,
};
```

---

## 7. 인덱스 시그니처

키와 값의 타입만 정해두고, 어떤 키든 받을 수 있습니다.

```ts
interface StringMap {
  [key: string]: string; // 키: string, 값: string
}

const translations: StringMap = {
  hello: '안녕하세요',
  goodbye: '안녕히 가세요',
  thanks: '감사합니다',
};

// 어떤 키든 추가 가능
translations.welcome = '환영합니다';
```

---

## 학습 포인트 정리

| 개념 | 설명 |
|------|------|
| `interface` | 객체 구조 정의 (확장, 병합 가능) |
| `type` | 유니온, 교차, 원시 별칭 등 |
| `?` | 선택적 프로퍼티 |
| `readonly` | 변경 불가 프로퍼티 |
| `extends` | 인터페이스 확장 |
| `|` | 유니온 타입 (또는) |
| `&` | 교차 타입 (그리고) |
| 인덱스 시그니처 | `[key: T]: V` 동적 키 |
