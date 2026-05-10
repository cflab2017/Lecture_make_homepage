# 강의 08 — 비동기 프로그래밍

## 학습 목표

- 동기 vs 비동기의 차이를 이해한다.
- `setTimeout`, `setInterval`을 사용할 수 있다.
- `Promise`의 `then`, `catch`를 사용할 수 있다.
- `async/await`으로 비동기 코드를 동기처럼 작성할 수 있다.
- `fetch` API로 외부 데이터를 가져올 수 있다.
- `try/catch`로 에러를 처리할 수 있다.

---

## 1. 동기 vs 비동기

```javascript
// 동기 (Synchronous): 한 줄씩 순서대로 실행
console.log("1번");
console.log("2번");
console.log("3번");
// 출력: 1번 → 2번 → 3번

// 비동기 (Asynchronous): 완료를 기다리지 않고 다음 코드 실행
console.log("1번");
setTimeout(() => console.log("2번 (1초 후)"), 1000);
console.log("3번");
// 출력: 1번 → 3번 → 2번 (1초 후)
```

---

## 2. setTimeout / setInterval

```javascript
// setTimeout: n밀리초 후 한 번 실행
const timerId = setTimeout(() => {
  console.log("3초 후 실행됩니다.");
}, 3000);

// 취소
clearTimeout(timerId);

// setInterval: n밀리초마다 반복 실행
const intervalId = setInterval(() => {
  console.log("1초마다 실행");
}, 1000);

// 5초 후 반복 중지
setTimeout(() => {
  clearInterval(intervalId);
  console.log("반복 종료");
}, 5000);
```

---

## 3. Promise

비동기 작업의 **성공** 또는 **실패**를 나타내는 객체입니다.

```javascript
// Promise 생성
const myPromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("성공!");   // 성공 시 값 전달
  } else {
    reject("실패!");    // 실패 시 에러 전달
  }
});

// Promise 사용 (.then / .catch)
myPromise
  .then(result => {
    console.log(result);  // "성공!"
    return result + " 처리 완료";
  })
  .then(result => {
    console.log(result);  // "성공! 처리 완료"
  })
  .catch(error => {
    console.error(error); // 에러 처리
  })
  .finally(() => {
    console.log("성공/실패 무관하게 항상 실행");
  });
```

---

## 4. async / await

`Promise`를 더 간결하게 작성하는 문법입니다.

```javascript
// async 함수 선언
async function fetchData() {
  // await: Promise가 완료될 때까지 대기
  const result = await someAsyncFunction();
  return result;
}

// 예시: 지연 함수
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log("시작");
  await delay(1000); // 1초 대기
  console.log("1초 후");
  await delay(1000); // 1초 대기
  console.log("2초 후");
}

main();
```

---

## 5. fetch API

웹에서 데이터를 가져오는 내장 API입니다.

```javascript
// 기본 fetch 사용 (Promise 방식)
fetch('https://api.example.com/data')
  .then(response => response.json()) // 응답을 JSON으로 파싱
  .then(data => console.log(data))
  .catch(error => console.error(error));

// async/await 방식 (더 권장)
async function loadData() {
  try {
    const response = await fetch('https://api.example.com/data');

    // 응답 상태 확인
    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.error("데이터 로드 실패:", error.message);
  }
}

loadData();
```

---

## 6. JSON.parse / JSON.stringify

```javascript
// 객체 → JSON 문자열 (직렬화)
const user = { name: "홍길동", age: 25 };
const json = JSON.stringify(user);
console.log(json);  // '{"name":"홍길동","age":25}'

// JSON 문자열 → 객체 (역직렬화)
const parsed = JSON.parse(json);
console.log(parsed.name); // "홍길동"

// localStorage와 함께 자주 사용
localStorage.setItem('user', JSON.stringify(user));
const savedUser = JSON.parse(localStorage.getItem('user'));
```

---

## 7. try / catch 에러 처리

```javascript
async function riskyOperation() {
  try {
    // 오류가 발생할 수 있는 코드
    const response = await fetch('https://invalid-url.xyz');
    if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
    const data = await response.json();
    return data;

  } catch (error) {
    // 오류 처리
    console.error("오류 발생:", error.message);
    return null; // 기본값 반환

  } finally {
    // 성공/실패 무관하게 항상 실행 (로딩 상태 해제 등)
    console.log("작업 완료");
  }
}
```

---

## 실습 파일

- [예제 보기](./예제/index.html)
- [과제 확인](./과제/과제.md)
- [과제 정답](./과제정답/index.html)
