# 강의 05 — 객체

## 학습 목표

- 객체 리터럴로 데이터를 구조화할 수 있다.
- 점 표기법과 대괄호 표기법으로 속성에 접근할 수 있다.
- 메서드와 `this`를 이해한다.
- 객체 배열을 다룰 수 있다.
- 구조분해할당과 전개 연산자를 활용할 수 있다.
- JSON의 개념을 이해한다.

---

## 1. 객체 리터럴

```javascript
// 객체 생성
const person = {
  name: "홍길동",      // 속성 (key: value)
  age: 25,
  city: "서울",
  isStudent: false,
};
```

---

## 2. 속성 접근

### 점 표기법 (Dot Notation)

```javascript
console.log(person.name); // "홍길동"
console.log(person.age);  // 25

// 속성 추가 및 수정
person.email = "hong@example.com"; // 새 속성 추가
person.age = 26;                   // 기존 속성 수정

// 속성 삭제
delete person.isStudent;
```

### 대괄호 표기법 (Bracket Notation)

```javascript
// 동적으로 속성명을 사용할 때 유용
const key = "name";
console.log(person[key]); // "홍길동"

// 띄어쓰기가 있는 속성명
const obj = { "first name": "길동" };
console.log(obj["first name"]); // "길동"
```

---

## 3. 메서드와 this

객체 안에 정의된 함수를 **메서드(method)**라고 합니다.

```javascript
const person = {
  name: "홍길동",
  age: 25,

  // 메서드 정의
  greet: function() {
    return `안녕하세요, ${this.name}입니다!`; // this = 현재 객체
  },

  // 단축 메서드 문법 (ES6+)
  getInfo() {
    return `${this.name} (${this.age}세)`;
  },
};

console.log(person.greet());   // "안녕하세요, 홍길동입니다!"
console.log(person.getInfo()); // "홍길동 (25세)"
```

> **주의**: 화살표 함수는 자신만의 `this`를 갖지 않으므로 메서드에는 일반 함수를 사용합니다.

---

## 4. 객체 배열

실무에서 가장 많이 사용하는 패턴입니다.

```javascript
const students = [
  { id: 1, name: "김철수", grade: "A", score: 95 },
  { id: 2, name: "이영희", grade: "B", score: 82 },
  { id: 3, name: "박민준", grade: "A", score: 91 },
];

// 특정 학생 찾기
const student = students.find(s => s.id === 2);
console.log(student.name); // "이영희"

// A학점 학생만 추출
const aStudents = students.filter(s => s.grade === "A");

// 평균 점수 계산 (reduce 활용)
const avg = students.reduce((sum, s) => sum + s.score, 0) / students.length;
console.log(avg); // 89.33...
```

---

## 5. 구조분해할당 (Destructuring)

객체의 속성을 변수로 쉽게 추출합니다.

```javascript
const person = { name: "홍길동", age: 25, city: "서울" };

// 기존 방식
const name1 = person.name;
const age1 = person.age;

// 구조분해할당
const { name, age, city } = person;
console.log(name, age, city); // "홍길동" 25 "서울"

// 변수명 변경
const { name: userName, age: userAge } = person;
console.log(userName); // "홍길동"

// 기본값 설정
const { email = "없음" } = person;
console.log(email); // "없음" (속성이 없으면 기본값)

// 함수 매개변수에서 사용
function greet({ name, age }) {
  return `${name}님은 ${age}세입니다.`;
}
greet(person); // "홍길동님은 25세입니다."
```

---

## 6. 전개 연산자 (Spread Operator)

```javascript
const original = { name: "홍길동", age: 25 };

// 객체 복사 (얕은 복사)
const copy = { ...original };
copy.age = 30;
console.log(original.age); // 25 (원본 영향 없음)

// 객체 합치기 (뒤에 오는 것이 우선)
const extra = { city: "서울", age: 30 };
const merged = { ...original, ...extra };
// { name: "홍길동", age: 30, city: "서울" }

// 속성 추가/수정
const updated = { ...original, email: "hong@example.com", age: 26 };
```

---

## 7. JSON (JavaScript Object Notation)

데이터를 문자열로 주고받을 때 사용하는 형식입니다.

```javascript
const person = { name: "홍길동", age: 25 };

// 객체 → JSON 문자열 (직렬화)
const json = JSON.stringify(person);
console.log(json);        // '{"name":"홍길동","age":25}'
console.log(typeof json); // "string"

// JSON 문자열 → 객체 (역직렬화)
const parsed = JSON.parse(json);
console.log(parsed.name); // "홍길동"

// 보기 좋게 출력 (들여쓰기 2칸)
console.log(JSON.stringify(person, null, 2));
```

---

## 실습 파일

- [예제 보기](./예제/index.html)
- [과제 확인](./과제/과제.md)
- [과제 정답](./과제정답/index.html)
