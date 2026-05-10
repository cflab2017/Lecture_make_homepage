# 강의 04 — 배열

## 학습 목표

- 배열을 생성하고 인덱스로 요소에 접근할 수 있다.
- `push`, `pop`, `shift`, `unshift`, `splice`로 배열을 수정할 수 있다.
- `forEach`, `map`, `filter`, `find`, `includes`, `sort`로 배열을 다룰 수 있다.
- 전개 연산자(`...`)로 배열을 복사하거나 합칠 수 있다.

---

## 1. 배열 생성과 접근

```javascript
// 배열 리터럴로 생성
const fruits = ["사과", "바나나", "딸기", "포도"];

// 인덱스 접근 (0부터 시작)
console.log(fruits[0]); // "사과"
console.log(fruits[2]); // "딸기"

// 마지막 요소
console.log(fruits[fruits.length - 1]); // "포도"

// 다양한 타입 혼합 가능
const mixed = [1, "hello", true, null, { name: "홍길동" }];
```

---

## 2. 배열 수정 메서드

```javascript
const arr = ["A", "B", "C"];

// push: 맨 뒤에 추가 → 새 length 반환
arr.push("D");        // ["A", "B", "C", "D"]

// pop: 맨 뒤 제거 → 제거된 요소 반환
const last = arr.pop(); // last = "D", arr = ["A", "B", "C"]

// unshift: 맨 앞에 추가 → 새 length 반환
arr.unshift("Z");     // ["Z", "A", "B", "C"]

// shift: 맨 앞 제거 → 제거된 요소 반환
const first = arr.shift(); // first = "Z", arr = ["A", "B", "C"]

// splice(시작인덱스, 제거개수, ...추가할값)
arr.splice(1, 1);           // ["A", "C"] (인덱스 1에서 1개 제거)
arr.splice(1, 0, "B");      // ["A", "B", "C"] (인덱스 1에 "B" 삽입)
arr.splice(1, 1, "X", "Y"); // ["A", "X", "Y", "C"] (교체)
```

---

## 3. 고차 함수 (Higher-Order Functions)

배열의 각 요소에 함수를 적용하는 강력한 메서드들입니다.

### forEach — 각 요소에 작업 수행 (반환값 없음)

```javascript
const numbers = [1, 2, 3, 4, 5];

numbers.forEach((num, index) => {
  console.log(`${index}번째: ${num}`);
});
```

### map — 각 요소를 변환한 새 배열 반환

```javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

const names = ["alice", "bob", "charlie"];
const capitalized = names.map(name => name.toUpperCase());
// ["ALICE", "BOB", "CHARLIE"]
```

### filter — 조건을 만족하는 요소만 걸러 새 배열 반환

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4, 6, 8]

const users = [
  { name: "홍길동", age: 25 },
  { name: "이순신", age: 15 },
  { name: "강감찬", age: 30 },
];
const adults = users.filter(user => user.age >= 19);
// [{ name: "홍길동", age: 25 }, { name: "강감찬", age: 30 }]
```

### find — 조건을 만족하는 첫 번째 요소 반환

```javascript
const users = [
  { id: 1, name: "홍길동" },
  { id: 2, name: "이순신" },
];
const user = users.find(u => u.id === 2);
console.log(user); // { id: 2, name: "이순신" }
```

### includes — 특정 값 포함 여부 확인

```javascript
const fruits = ["사과", "바나나", "딸기"];
console.log(fruits.includes("바나나")); // true
console.log(fruits.includes("수박"));  // false
```

### sort — 배열 정렬 (원본 배열 변경)

```javascript
// 문자열 정렬 (기본값: 사전순)
const names = ["Charlie", "Alice", "Bob"];
names.sort();
console.log(names); // ["Alice", "Bob", "Charlie"]

// 숫자 정렬 (반드시 비교 함수 제공!)
const numbers = [10, 1, 100, 3, 20];
numbers.sort((a, b) => a - b);  // 오름차순
console.log(numbers); // [1, 3, 10, 20, 100]

numbers.sort((a, b) => b - a);  // 내림차순
console.log(numbers); // [100, 20, 10, 3, 1]
```

---

## 4. 전개 연산자 (Spread Operator)

```javascript
// 배열 복사 (원본과 독립)
const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
console.log(original); // [1, 2, 3] (영향 없음)

// 배열 합치기
const a = [1, 2, 3];
const b = [4, 5, 6];
const merged = [...a, ...b]; // [1, 2, 3, 4, 5, 6]

// 배열에 요소 추가
const withExtra = [0, ...a, 4]; // [0, 1, 2, 3, 4]
```

---

## 실습 파일

- [예제 보기](./예제/index.html)
- [과제 확인](./과제/과제.md)
- [과제 정답](./과제정답/index.html)
