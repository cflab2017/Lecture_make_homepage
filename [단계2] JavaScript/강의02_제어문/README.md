# 강의 02 — 제어문

## 학습 목표

- `if / else if / else`로 조건에 따라 코드를 분기할 수 있다.
- 비교 연산자(`===`, `!==`, `>`, `<` 등)와 논리 연산자(`&&`, `||`, `!`)를 올바르게 사용할 수 있다.
- `switch`문으로 다중 분기를 처리할 수 있다.
- `for`, `while` 반복문으로 반복 작업을 처리할 수 있다.
- `break`와 `continue`로 반복 흐름을 제어할 수 있다.

---

## 1. 조건문: if / else if / else

```javascript
const score = 85;

if (score >= 90) {
  console.log("A학점");
} else if (score >= 80) {
  console.log("B학점"); // ← 실행됨
} else if (score >= 70) {
  console.log("C학점");
} else if (score >= 60) {
  console.log("D학점");
} else {
  console.log("F학점");
}
```

### 삼항 연산자 (간단한 조건 처리)

```javascript
const age = 20;
const status = age >= 19 ? "성인" : "미성년자";
console.log(status); // "성인"
```

---

## 2. 비교 연산자

| 연산자 | 의미 | 예시 | 결과 |
|--------|------|------|------|
| `===` | 엄격한 같음 (값 + 타입) | `5 === "5"` | `false` |
| `!==` | 엄격한 다름 | `5 !== "5"` | `true` |
| `==` | 느슨한 같음 (타입 변환) | `5 == "5"` | `true` |
| `>` | 초과 | `10 > 5` | `true` |
| `<` | 미만 | `10 < 5` | `false` |
| `>=` | 이상 | `5 >= 5` | `true` |
| `<=` | 이하 | `4 <= 5` | `true` |

> **주의**: `==` 대신 항상 `===`를 사용하세요. 타입까지 비교하므로 더 안전합니다.

---

## 3. 논리 연산자

```javascript
// && (AND): 모두 true여야 true
const isAdult = true;
const hasTicket = true;
console.log(isAdult && hasTicket); // true

// || (OR): 하나라도 true이면 true
const isWeekend = false;
const isHoliday = true;
console.log(isWeekend || isHoliday); // true

// ! (NOT): true → false, false → true
const isLoggedIn = false;
console.log(!isLoggedIn); // true
```

### 단락 평가 (Short-circuit Evaluation)

```javascript
// && : 앞이 false이면 뒤를 평가하지 않음
false && console.log("실행 안 됨");

// || : 앞이 true이면 뒤를 평가하지 않음
true || console.log("실행 안 됨");

// 기본값 패턴 (||)
const username = "";
const displayName = username || "손님"; // "손님"

// 옵셔널 체이닝 패턴 (&&)
const user = { name: "홍길동" };
const name = user && user.name; // "홍길동"
```

---

## 4. switch 문

여러 값 중 일치하는 것을 찾아 실행합니다.

```javascript
const day = "월";

switch (day) {
  case "월":
  case "화":
  case "수":
  case "목":
  case "금":
    console.log("평일입니다.");
    break;
  case "토":
  case "일":
    console.log("주말입니다.");
    break;
  default:
    console.log("잘못된 입력입니다.");
}
```

> **주의**: 각 `case`마다 `break`를 빠뜨리면 다음 `case`까지 실행됩니다 (fall-through).

---

## 5. for 반복문

```javascript
// 기본 for 문
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// 배열 순회
const fruits = ["사과", "바나나", "딸기"];
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}

// for...of (값 순회, ES6+)
for (const fruit of fruits) {
  console.log(fruit);
}
```

---

## 6. while 반복문

```javascript
let count = 0;

while (count < 5) {
  console.log(count); // 0, 1, 2, 3, 4
  count++;
}

// do...while: 조건 확인 전에 최소 1회 실행
let num = 0;
do {
  console.log(num); // 0
  num++;
} while (num < 0); // 조건이 false여도 1회 실행됨
```

---

## 7. break / continue

```javascript
// break: 반복문 완전히 종료
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i); // 0, 1, 2, 3, 4
}

// continue: 현재 반복만 건너뜀
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue; // 짝수 건너뜀
  console.log(i); // 1, 3, 5, 7, 9
}
```

---

## 실습 파일

- [예제 보기](./예제/index.html)
- [과제 확인](./과제/과제.md)
- [과제 정답](./과제정답/index.html)
