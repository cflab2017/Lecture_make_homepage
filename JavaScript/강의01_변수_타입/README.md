# 강의 01 — 변수와 타입

## 학습 목표

- `var`, `let`, `const`의 차이를 이해하고 적절히 사용할 수 있다.
- JavaScript의 원시 타입 6가지를 구분할 수 있다.
- `typeof` 연산자로 타입을 확인할 수 있다.
- 명시적/암묵적 형변환을 이해한다.
- 템플릿 리터럴로 문자열을 작성할 수 있다.

---

## 1. 변수 선언: var / let / const

### var (구식, 사용 지양)

```javascript
var name = "홍길동";
var name = "이순신"; // 재선언 가능 → 예기치 못한 버그 발생 가능
name = "강감찬";     // 재할당 가능
```

- **함수 스코프**: 함수 안에서 선언하면 함수 내부에서만 유효
- **호이스팅**: 선언이 맨 위로 끌어올려짐 (값은 `undefined`)

### let (ES6+, 변수에 사용)

```javascript
let age = 25;
// let age = 30; // 재선언 불가 → 오류 발생
age = 30;        // 재할당 가능
```

- **블록 스코프**: `{}` 안에서 선언하면 그 블록 내부에서만 유효

### const (ES6+, 상수에 사용)

```javascript
const PI = 3.14159;
// PI = 3.14; // 재할당 불가 → 오류 발생

// 객체/배열의 경우 내부 값은 변경 가능
const user = { name: "홍길동" };
user.name = "이순신"; // 가능
```

### 비교 정리

| 구분 | 재선언 | 재할당 | 스코프 |
|------|--------|--------|--------|
| `var` | 가능 | 가능 | 함수 |
| `let` | 불가 | 가능 | 블록 |
| `const` | 불가 | 불가 | 블록 |

> **권장**: 기본적으로 `const` 사용, 값이 변경될 경우에만 `let` 사용. `var`는 사용하지 않는다.

---

## 2. 원시 타입 (Primitive Types)

JavaScript에는 6가지 원시 타입이 있습니다.

### string (문자열)

```javascript
const greeting = "안녕하세요";
const name = '홍길동';
const sentence = `제 이름은 ${name}입니다.`; // 템플릿 리터럴
```

### number (숫자)

```javascript
const integer = 42;
const float = 3.14;
const negative = -10;
const infinity = Infinity;     // 무한대
const notANumber = NaN;        // 숫자가 아님 (Not a Number)
```

### boolean (불리언)

```javascript
const isLoggedIn = true;
const isEmpty = false;
```

### null (의도적 빈 값)

```javascript
let selectedItem = null; // 아직 선택된 항목이 없음을 명시적으로 표현
```

### undefined (값이 할당되지 않음)

```javascript
let uninitializedVar;
console.log(uninitializedVar); // undefined
```

### symbol (고유 식별자, 고급 주제)

```javascript
const id = Symbol("id");
```

---

## 3. typeof 연산자

변수의 타입을 문자열로 반환합니다.

```javascript
typeof "안녕"        // "string"
typeof 42            // "number"
typeof true          // "boolean"
typeof undefined     // "undefined"
typeof null          // "object" ← JavaScript의 유명한 버그!
typeof {}            // "object"
typeof []            // "object"
typeof function(){}  // "function"
```

---

## 4. 형변환 (Type Conversion)

### 명시적 형변환 (직접 변환)

```javascript
// 숫자 → 문자열
String(42)        // "42"
(42).toString()   // "42"

// 문자열 → 숫자
Number("42")      // 42
Number("abc")     // NaN
parseInt("42px")  // 42  (정수 부분만 추출)
parseFloat("3.14abc") // 3.14

// 다른 타입 → 불리언
Boolean(0)        // false
Boolean("")       // false
Boolean(null)     // false
Boolean(undefined)// false
Boolean(NaN)      // false
Boolean("hello")  // true
Boolean(42)       // true
```

### 암묵적 형변환 (자동 변환)

```javascript
"5" + 3      // "53"  (숫자가 문자열로 변환)
"5" - 3      // 2     (문자열이 숫자로 변환)
"5" * "3"    // 15    (두 문자열이 숫자로 변환)
true + 1     // 2     (true → 1)
false + 1    // 1     (false → 0)
```

---

## 5. 템플릿 리터럴 (Template Literal)

백틱(`` ` ``)을 사용하여 문자열 안에 표현식을 삽입할 수 있습니다.

```javascript
const name = "홍길동";
const age = 25;

// 기존 방식
const message1 = "안녕하세요, " + name + "님! 나이는 " + age + "세입니다.";

// 템플릿 리터럴
const message2 = `안녕하세요, ${name}님! 나이는 ${age}세입니다.`;

// 여러 줄 문자열
const multiLine = `
  첫 번째 줄
  두 번째 줄
  세 번째 줄
`;

// 표현식 삽입
const result = `10 + 20 = ${10 + 20}`;  // "10 + 20 = 30"
```

---

## 실습 파일

- [예제 보기](./예제/index.html)
- [과제 확인](./과제/과제.md)
- [과제 정답](./과제정답/index.html)
