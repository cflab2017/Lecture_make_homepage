# 강의 05 — 제네릭

## 1. 제네릭이란?

타입을 매개변수처럼 사용하는 기능입니다. 다양한 타입에 동작하는 재사용 가능한 코드를 작성할 수 있습니다.

```ts
// 제네릭 없이 — 타입별로 함수를 따로 만들어야 함
function getFirstNumber(arr: number[]): number { return arr[0]; }
function getFirstString(arr: string[]): string { return arr[0]; }

// 제네릭 사용 — 하나의 함수로 모든 타입 처리
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

getFirst<number>([1, 2, 3]);    // T = number
getFirst<string>(['a', 'b']);   // T = string
getFirst([true, false]);        // T = boolean (타입 추론)
```

---

## 2. 제네릭 인터페이스

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// 사용 시 T에 실제 타입 지정
const userResponse: ApiResponse<User> = {
  success: true,
  data: { id: 1, name: '홍길동' },
  timestamp: new Date().toISOString(),
};

const listResponse: ApiResponse<Product[]> = {
  success: true,
  data: [...products],
  timestamp: new Date().toISOString(),
};
```

---

## 3. 제네릭 클래스

```ts
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop()); // 2

const stringStack = new Stack<string>();
stringStack.push('hello');
```

---

## 4. 제약 (extends)

`T extends SomeType`으로 제네릭 타입에 제약을 걸 수 있습니다.

```ts
// T는 반드시 { name: string }을 가져야 함
function printName<T extends { name: string }>(item: T): void {
  console.log(item.name);
}

printName({ name: '홍길동', age: 30 });   // OK
printName({ age: 30 });                  // 오류: name 없음
```

---

## 5. keyof

인터페이스의 키 타입을 추출합니다.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type UserKey = keyof User; // 'id' | 'name' | 'email'

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: '홍길동', email: 'hong@test.com' };
getProperty(user, 'name');  // '홍길동' (string)
getProperty(user, 'id');    // 1 (number)
// getProperty(user, 'age'); // 오류: 'age'는 User에 없음
```

---

## 6. 유틸리티 타입

TypeScript 내장 제네릭 타입들입니다.

```ts
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial<T> — 모든 프로퍼티를 선택적으로
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; password?: string; }

// Required<T> — 모든 프로퍼티를 필수로
type RequiredUser = Required<PartialUser>;

// Pick<T, K> — 특정 프로퍼티만 선택
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;
// { id: number; name: string; email: string; }

// Omit<T, K> — 특정 프로퍼티 제외
type SafeUser = Omit<User, 'password'>;

// Record<K, V> — 키-값 매핑
type RolePermissions = Record<'admin' | 'user' | 'guest', string[]>;

// ReturnType<T> — 함수 반환 타입 추출
function createUser() { return { id: 1, name: '홍길동' }; }
type CreatedUser = ReturnType<typeof createUser>; // { id: number; name: string; }
```

---

## 학습 포인트 정리

| 개념 | 문법 | 설명 |
|------|------|------|
| 제네릭 함수 | `function f<T>(x: T): T` | 타입을 매개변수처럼 |
| 제네릭 인터페이스 | `interface I<T> { data: T }` | 재사용 가능한 타입 구조 |
| 제네릭 클래스 | `class C<T> { }` | 타입 파라미터를 가진 클래스 |
| 제약 | `T extends U` | 특정 조건을 만족하는 타입만 허용 |
| `keyof` | `keyof T` | 객체 타입의 키를 유니온으로 |
| `Partial<T>` | 유틸 | 모든 프로퍼티를 선택적으로 |
| `Pick<T,K>` | 유틸 | 특정 프로퍼티만 선택 |
| `Omit<T,K>` | 유틸 | 특정 프로퍼티 제외 |
| `Record<K,V>` | 유틸 | 키-값 매핑 타입 |
