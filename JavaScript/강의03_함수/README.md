# 강의 03 — 함수

## 학습 목표

- 함수 선언식, 표현식, 화살표 함수의 차이를 이해한다.
- 매개변수와 반환값을 활용하여 재사용 가능한 함수를 작성할 수 있다.
- 스코프의 개념을 이해한다.
- 기본값 매개변수를 사용할 수 있다.
- 콜백 함수의 개념을 이해한다.

---

## 1. 함수 선언식 (Function Declaration)

```javascript
// 함수 선언식
function greet(name) {
  return `안녕하세요, ${name}님!`;
}

console.log(greet("홍길동")); // "안녕하세요, 홍길동님!"
```

- **호이스팅**: 함수 선언식은 코드 위치보다 먼저 호출할 수 있다.

```javascript
console.log(sayHi()); // 작동함 (호이스팅)

function sayHi() {
  return "안녕!";
}
```

---

## 2. 함수 표현식 (Function Expression)

```javascript
// 변수에 함수를 할당
const greet = function(name) {
  return `안녕하세요, ${name}님!`;
};

console.log(greet("홍길동")); // "안녕하세요, 홍길동님!"
```

- **호이스팅 없음**: 선언 전에 호출하면 오류 발생

---

## 3. 화살표 함수 (Arrow Function, ES6+)

```javascript
// 기본 형태
const greet = (name) => {
  return `안녕하세요, ${name}님!`;
};

// 매개변수가 하나일 때 괄호 생략 가능
const double = n => {
  return n * 2;
};

// 함수 본문이 한 줄일 때 중괄호와 return 생략 가능
const triple = n => n * 3;
const add = (a, b) => a + b;

console.log(double(5));  // 10
console.log(triple(5));  // 15
console.log(add(3, 4));  // 7
```

---

## 4. 매개변수와 반환값

```javascript
// 여러 매개변수
function calculateBMI(weight, height) {
  const bmi = weight / (height * height);
  return bmi.toFixed(1);
}

const myBMI = calculateBMI(70, 1.75);
console.log(`BMI: ${myBMI}`); // "BMI: 22.9"

// 반환값이 없는 함수 (void)
function logMessage(message) {
  console.log(`[LOG] ${message}`);
  // return 없음 → undefined 반환
}
```

---

## 5. 기본값 매개변수 (Default Parameter, ES6+)

```javascript
// 매개변수에 기본값 설정
function greet(name = "손님", lang = "ko") {
  if (lang === "ko") {
    return `안녕하세요, ${name}님!`;
  } else {
    return `Hello, ${name}!`;
  }
}

console.log(greet());                // "안녕하세요, 손님님!"
console.log(greet("홍길동"));        // "안녕하세요, 홍길동님!"
console.log(greet("John", "en"));   // "Hello, John!"
```

---

## 6. 스코프 (Scope)

```javascript
// 전역 스코프
const globalVar = "전역 변수";

function outer() {
  const outerVar = "outer 변수";

  function inner() {
    const innerVar = "inner 변수";
    console.log(globalVar); // 접근 가능
    console.log(outerVar);  // 접근 가능 (클로저)
    console.log(innerVar);  // 접근 가능
  }

  inner();
  // console.log(innerVar); // 오류! inner 스코프 밖에서 접근 불가
}

outer();
```

---

## 7. 콜백 함수 (Callback Function)

**콜백 함수**는 다른 함수의 인수로 전달되어, 나중에 호출되는 함수입니다.

```javascript
// 콜백 함수 예시
function doTask(task, callback) {
  console.log(`작업 시작: ${task}`);
  // 작업 완료 후 콜백 호출
  callback(task);
}

function onComplete(task) {
  console.log(`작업 완료: ${task}`);
}

doTask("파일 저장", onComplete);
// "작업 시작: 파일 저장"
// "작업 완료: 파일 저장"

// 화살표 함수로 인라인 콜백
doTask("데이터 전송", (task) => {
  console.log(`✅ ${task} 성공!`);
});
```

### 자주 쓰는 콜백 패턴

```javascript
// setTimeout: n밀리초 후 콜백 실행
setTimeout(() => {
  console.log("1초 후 실행");
}, 1000);

// 배열 메서드의 콜백 (강의 04에서 자세히)
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8, 10]
```

---

## 실습 파일

- [예제 보기](./예제/index.html)
- [과제 확인](./과제/과제.md)
- [과제 정답](./과제정답/index.html)
