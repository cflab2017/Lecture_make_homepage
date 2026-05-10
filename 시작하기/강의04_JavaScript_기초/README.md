# JavaScript로 내 홈페이지에 동작 넣기
> **대상:** 강의1~3을 완료한 수강생 (HTML/CSS 기본기, Git push 가능)
> **시간:** 1~2시간 특강
> **준비물:** 강의1에서 만든 `index.html`, VS Code, 브라우저 (Chrome 권장)
> **결과물:** 버튼을 누르면 반응하고, 실시간으로 바뀌는 **살아 있는 홈페이지**

---

## 강의 흐름 한눈에 보기

| 시간 | 단계 | 무엇을 배우나 |
|---|---|---|
| 0:00 ~ 0:15 | 1. JavaScript가 뭔가요? | HTML/CSS와의 차이 |
| 0:15 ~ 0:30 | 2. 첫 코드 — 콘솔과 alert | 실행 환경 |
| 0:30 ~ 0:55 | 3. 변수, 데이터 타입, 연산 | 기본 문법 |
| 0:55 ~ 1:20 | 4. 버튼 클릭 반응 (DOM 조작) | 진짜 인터랙션 |
| 1:20 ~ 1:45 | 5. 조건문, 반복문, 함수 | 흐름 제어 |
| 1:45 ~ 1:55 | 6. 실습: 다크모드 토글 | 종합 미니 프로젝트 |
| 1:55 ~ 2:00 | 7. 마무리 & 다음 단계 | 어디로 더 나아갈까 |

---

## 1. JavaScript가 뭔가요? (15분)

### HTML, CSS, JavaScript의 역할 분담

지금까지 만든 페이지를 **사람**에 비유하면:

| 기술 | 역할 | 비유 |
|---|---|---|
| HTML | 구조 | **뼈대** (몸의 골격) |
| CSS | 디자인 | **옷, 화장** (외모) |
| JavaScript | 동작 | **근육, 신경** (움직임) |

HTML/CSS만 있는 페이지는 **사진**이고, JavaScript가 들어가면 **영상**이 됩니다.

### JavaScript로 뭘 할 수 있나요?

- 버튼 클릭하면 메시지가 뜸
- 입력창에 글자 치면 실시간으로 미리보기
- 다크모드 토글
- 슬라이드 쇼, 캐러셀
- 서버에서 데이터 받아와 화면에 그리기 (날씨, 뉴스, SNS)
- 게임, 챗봇, 그림판...

요즘 웹의 거의 모든 동적 기능은 JavaScript입니다.

### 잠깐, "Java"랑 "JavaScript"가 같은 거 아니에요?

아닙니다. **완전히 다른 언어**입니다.

> 🍔 **유명한 비유**: "Java is to JavaScript as ham is to hamster" (햄과 햄스터의 차이만큼 다름)

Java는 1995년 Sun Microsystems가, JavaScript는 같은 해 Netscape이 만든 별개 언어입니다. 이름이 비슷한 건 마케팅 사고였습니다. 헷갈리지 마세요.

---

## 2. 첫 코드 — 콘솔과 alert (15분)

### 2-1. 브라우저 개발자 도구 열기

Chrome 브라우저에서 **`F12`** 키 (Mac은 `Cmd + Option + I`).
화면 한쪽에 패널이 열립니다. 상단 탭에서 **Console** 클릭.

> 💡 개발자 도구는 모든 웹사이트에서 작동합니다. 네이버, 구글 어디서든 F12.

### 2-2. 콘솔에서 첫 코드 치기

콘솔 입력창에:

```javascript
console.log("안녕, 자바스크립트!");
```

엔터. 회색 글자로 결과가 나옵니다. **방금 코드를 실행한 겁니다.** 컴파일도, 빌드도, 저장도 없습니다.

다른 것도 해보세요:

```javascript
1 + 1
"안녕" + "하세요"
2026 - 1995
```

### 2-3. alert — 화면에 팝업 띄우기

```javascript
alert("환영합니다!");
```

브라우저 상단에 팝업이 뜹니다.

### 2-4. HTML 파일에서 JavaScript 실행하기

콘솔은 연습용이고, 실제로는 **HTML에 끼워 넣어** 사용합니다.

`index.html`의 `</body>` 직전에 추가:

```html
    <script>
        console.log("페이지가 열렸습니다!");
        alert("어서 오세요");
    </script>
</body>
```

저장 후 브라우저 새로고침 — 팝업이 뜨고, 콘솔에도 메시지가 찍힙니다.

> ⚠️ `<script>` 태그는 **`</body>` 바로 위**에 두는 게 정석입니다. HTML이 먼저 다 그려진 다음 JavaScript가 실행되도록 하기 위해서.

---

## 3. 변수, 데이터 타입, 연산 (25분)

### 3-1. 변수 — 값에 이름 붙이기

```javascript
let name = "김지훈";
let age = 25;
let isStudent = true;

console.log(name);      // "김지훈"
console.log(age + 5);   // 30
```

`let`은 "변수를 만든다"는 키워드입니다. **= 는 같다는 뜻이 아니라 "넣는다"는 뜻**입니다.

```javascript
let count = 0;
count = count + 1;     // count는 이제 1
count = count + 1;     // count는 이제 2
```

### 3-2. 변하지 않는 값은 const

```javascript
const PI = 3.14;
const myName = "지훈";

PI = 4;  // ❌ 에러! const는 못 바꿈
```

> 💡 **실무 팁**: 일단 `const`로 쓰고, 정말 바꿔야 할 때만 `let`. 안전한 습관입니다.

### 3-3. 기본 데이터 타입

| 타입 | 예시 | 설명 |
|---|---|---|
| 숫자 (Number) | `25`, `3.14`, `-100` | 정수, 소수 모두 |
| 문자열 (String) | `"안녕"`, `'hello'` | 따옴표로 감쌈 |
| 불리언 (Boolean) | `true`, `false` | 참/거짓 |
| 배열 (Array) | `[1, 2, 3]`, `["사과", "배"]` | 여러 값 묶음 |
| 객체 (Object) | `{name: "지훈", age: 25}` | 키-값 쌍 |
| undefined | `undefined` | 값이 없음 |
| null | `null` | 의도적으로 비움 |

### 3-4. 연산자

```javascript
// 산술
10 + 3      // 13
10 - 3      // 7
10 * 3      // 30
10 / 3      // 3.333...
10 % 3      // 1 (나머지)

// 문자열 연결
"안녕" + " " + "지훈"   // "안녕 지훈"

// 비교 (true / false 반환)
5 > 3       // true
5 === 5     // true (엄격하게 같음)
5 !== 3     // true (다름)

// 논리
true && false   // false (AND)
true || false   // true (OR)
!true           // false (NOT)
```

> ⚠️ **중요**: 비교는 항상 `===` (등호 3개)를 쓰세요. `==` (등호 2개)는 타입 변환 때문에 함정이 많습니다.

### 3-5. 배열 다루기

```javascript
let fruits = ["사과", "배", "딸기"];

console.log(fruits[0]);         // "사과" (0부터 시작!)
console.log(fruits.length);     // 3
fruits.push("포도");             // 끝에 추가
console.log(fruits);             // ["사과", "배", "딸기", "포도"]
```

### 3-6. 객체 다루기

```javascript
let person = {
    name: "김지훈",
    age: 25,
    hobby: "코딩"
};

console.log(person.name);       // "김지훈"
console.log(person.age);        // 25
person.age = 26;                // 수정
person.email = "j@a.com";        // 새 속성 추가
```

---

## 4. 버튼 클릭 반응 — DOM 조작 (25분) ⭐ 하이라이트

이게 진짜 인터랙티브 웹의 시작입니다.

### 4-1. DOM이 뭔가요?

브라우저는 HTML을 읽고 **DOM(Document Object Model)** 이라는 **JavaScript에서 다룰 수 있는 객체 구조**로 변환합니다.

```html
<h1 id="title">안녕</h1>
```

이 HTML은 JavaScript에서 이렇게 다룹니다:

```javascript
const title = document.getElementById("title");
title.textContent = "반갑습니다";  // 글자 바뀜!
title.style.color = "red";        // 색깔도 바뀜!
```

### 4-2. 요소 찾기

```javascript
// id로 찾기 (가장 흔함)
document.getElementById("title")

// 클래스로 찾기 (여러 개)
document.querySelectorAll(".card")

// CSS 선택자로 첫 번째만 찾기
document.querySelector("h1")
document.querySelector(".card p")
```

### 4-3. 요소 변경하기

```javascript
const el = document.getElementById("title");

el.textContent = "새 글자";      // 글자 변경
el.innerHTML = "<b>굵게</b>";    // HTML 자체 변경
el.style.color = "blue";        // 인라인 스타일
el.classList.add("active");     // CSS 클래스 추가
el.classList.remove("hidden");
el.classList.toggle("dark");    // 있으면 빼고 없으면 넣기
```

### 4-4. 이벤트 — 사용자 동작에 반응

```javascript
const button = document.getElementById("myButton");

button.addEventListener("click", function() {
    alert("버튼이 눌렸어요!");
});
```

`addEventListener("click", ...)` = **"이 버튼이 클릭되면 이 함수를 실행해"**

자주 쓰는 이벤트:

| 이벤트 | 언제 발생 |
|---|---|
| `click` | 클릭했을 때 |
| `mouseover` | 마우스가 위에 올라갔을 때 |
| `mouseout` | 마우스가 빠져나갔을 때 |
| `keydown` | 키를 눌렀을 때 |
| `input` | 입력창에 글자 입력 |
| `submit` | 폼 제출 |

### 4-5. 실습: 클릭 카운터

`index.html`에 추가:

```html
<div class="card">
    <h2>클릭 카운터</h2>
    <p>버튼을 누른 횟수: <span id="count">0</span></p>
    <button id="clickBtn">눌러보세요</button>
</div>

<script>
    let count = 0;
    const btn = document.getElementById("clickBtn");
    const display = document.getElementById("count");

    btn.addEventListener("click", function() {
        count = count + 1;
        display.textContent = count;
    });
</script>
```

저장 → 새로고침 → 버튼 눌러보기. **숫자가 올라갑니다!** 🎉

여러분의 페이지가 처음으로 **반응**했습니다.

---

## 5. 조건문, 반복문, 함수 (25분)

### 5-1. if 조건문

```javascript
const age = 20;

if (age >= 18) {
    console.log("성인입니다");
} else {
    console.log("미성년자입니다");
}
```

여러 조건:

```javascript
const score = 85;

if (score >= 90) {
    console.log("A");
} else if (score >= 80) {
    console.log("B");
} else if (score >= 70) {
    console.log("C");
} else {
    console.log("F");
}
```

### 5-2. for 반복문

```javascript
for (let i = 0; i < 5; i++) {
    console.log("반복 " + i);
}
// 반복 0
// 반복 1
// 반복 2
// 반복 3
// 반복 4
```

배열 순회:

```javascript
const fruits = ["사과", "배", "딸기"];

for (const fruit of fruits) {
    console.log(fruit);
}
```

### 5-3. 함수 — 코드 묶기

같은 코드를 여러 번 쓰지 않으려면 **함수**로 묶습니다.

```javascript
function greet(name) {
    return "안녕, " + name + "!";
}

console.log(greet("지훈"));      // "안녕, 지훈!"
console.log(greet("민수"));      // "안녕, 민수!"
```

화살표 함수 (요즘 더 흔함):

```javascript
const greet = (name) => {
    return "안녕, " + name + "!";
};
```

### 5-4. 종합 예시

```javascript
function calculateGrade(score) {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    return "F";
}

const scores = [95, 82, 71, 60];
for (const s of scores) {
    console.log(s + "점 → " + calculateGrade(s));
}
```

---

## 6. 미니 프로젝트: 다크모드 토글 (10분)

지금까지 배운 걸 다 써먹는 작은 프로젝트입니다.

### 6-1. HTML 추가

`<body>` 안 적당한 위치에:

```html
<button id="darkBtn">🌙 다크모드</button>
```

### 6-2. CSS 추가 (`<style>` 안에)

```css
body.dark {
    background: #1a1a1a;
    color: #f3f4f6;
}
body.dark .card {
    background: #2a2a2a;
}
body.dark h1 {
    color: #93c5fd;
}
```

### 6-3. JavaScript 추가 (`<script>` 안에)

```javascript
const darkBtn = document.getElementById("darkBtn");

darkBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        darkBtn.textContent = "☀️ 라이트모드";
    } else {
        darkBtn.textContent = "🌙 다크모드";
    }
});
```

저장 → 새로고침 → 버튼 클릭 → **순식간에 페이지 전체가 바뀝니다.**

### 6-4. 푸시하면 끝

```bash
git add .
git commit -m "다크모드 토글 추가"
git push
```

Vercel이 자동으로 배포합니다. 친구한테 링크 보내고 "버튼 한번 눌러봐" 해보세요.

---

## 7. 마무리 & 다음 단계 (5분)

### 오늘 익힌 것

```
변수 (let, const)
   ↓
타입 (숫자, 문자열, 배열, 객체)
   ↓
DOM 조작 (getElementById, textContent, classList)
   ↓
이벤트 (addEventListener)
   ↓
조건문 / 반복문 / 함수
   ↓
미니 프로젝트 (다크모드 토글)
```

이 정도가 머리에 들어왔다면, **간단한 인터랙션은 거의 다 만들 수 있습니다.**
- 입력 폼 검증
- 할 일 목록 (Todo)
- 계산기
- 간단한 게임 (틱택토 정도)

다 도전 가능합니다.

### 다음에 배우면 좋은 것들

| 단계 | 무엇을 | 왜 |
|---|---|---|
| 다음주 | **fetch / API 호출** | 서버에서 데이터 받아오기 (날씨, 뉴스) |
| 그 다음 | **localStorage** | 새로고침해도 유지되는 저장소 |
| 한 달 후 | **React / Next.js** | 큰 앱을 체계적으로 만들기 |
| 두 달 후 | **TypeScript** | 안전한 자바스크립트 |

### 추천 학습 자료 (모두 무료)

- **MDN JavaScript 가이드** ([https://developer.mozilla.org/ko/docs/Web/JavaScript](https://developer.mozilla.org/ko/docs/Web/JavaScript)) — 공식 사전
- **모던 자바스크립트 튜토리얼** ([https://ko.javascript.info](https://ko.javascript.info)) — 한국어, 매우 친절
- **노마드코더 무료 강의** ([https://nomadcoders.co](https://nomadcoders.co)) — 영상 강의

### 마지막 한 마디

JavaScript는 **세상에서 가장 많이 쓰이는 언어**입니다. 웹은 물론 모바일 앱(React Native), 데스크탑 앱(Electron), 서버(Node.js), 심지어 우주선 제어까지.

오늘 배운 문법은 **앞으로 나올 모든 자바스크립트의 시작점**입니다. 한 번에 다 외우려 하지 말고, **만들고 싶은 게 생길 때마다 검색하면서 익히세요.** 그게 가장 빠른 길입니다.

코드는 머리로 외우는 게 아니라 **손으로 외우는** 겁니다. 🎉

---

## 부록 A. 자주 묻는 질문 (FAQ)

**Q. `let`이랑 `const`랑 `var` 차이가 뭐예요?**
- `var`는 옛날 키워드, 쓰지 마세요.
- `let`은 값이 바뀔 수 있는 변수.
- `const`는 한 번 정하면 못 바꿈.
기본은 `const`, 필요할 때만 `let`.

**Q. 콘솔에 빨간 에러가 떴어요. 어떻게 해요?**
에러 메시지를 **그대로 복사해서 구글이나 ChatGPT에 검색**하세요. 99%는 누군가 이미 같은 문제를 겪었습니다. 메시지 첫 줄이 가장 중요합니다.

**Q. 코드를 따로 파일로 분리하고 싶어요.**
`script.js` 파일을 만들고:
```html
<script src="script.js"></script>
```
`<script>` 태그 안에 직접 쓰지 말고 외부 파일로 분리하면 코드가 길어졌을 때 관리가 쉬워집니다.

**Q. JavaScript는 보안상 위험하지 않나요?**
브라우저는 JS가 사용자 컴퓨터의 파일을 직접 읽지 못하도록 **샌드박스**에 가둡니다. 일반적인 사용에서는 안전합니다. 다만 **외부 라이브러리**를 쓸 때는 출처를 확인하세요.

**Q. jQuery라는 게 있던데 그건 뭐예요?**
2010년대 초반에 유명했던 JavaScript 라이브러리. 지금은 모던 JavaScript가 충분히 좋아져서 신규 프로젝트에서는 잘 안 씁니다. 배울 필요 거의 없어요.

---

## 부록 B. 강사용 운영 팁

- **콘솔 사용을 첫 시간부터 권장하세요.** "코드 실행 = 새로고침"이라고 잘못 학습하면 나중에 디버깅이 어렵습니다.
- **에러 메시지를 두려워하지 않게** 하세요. 일부러 오타 내서 에러 띄워보고, 메시지 읽는 법을 시연하면 좋습니다.
- **DOM 개념은 한 번에 이해 안 됩니다.** "HTML이 객체로 변환된 것"이라는 비유를 여러 번 반복하세요.
- **`addEventListener`의 콜백 함수**는 입문자에게 가장 어려운 개념입니다. "함수를 변수처럼 넘긴다"는 점을 설명하세요.
- **마지막 다크모드 실습이 만족도의 핵심입니다.** 시간이 부족해도 이건 꼭 같이 따라하게 하세요. 결과물이 즉각적이라 동기부여가 큽니다.
- **"이거 React로 하면 더 쉬운데..."** 같은 언급은 자제하세요. 입문자에게 혼란만 줍니다.

---

*문서 작성: 2026-05 / 라이선스: 자유롭게 수정·재배포 가능*
