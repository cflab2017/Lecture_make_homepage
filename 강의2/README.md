# CSS로 내 홈페이지 예쁘게 꾸미기
> **대상:** 강의1을 완료한 수강생 (배포된 `index.html`이 있는 상태)
> **시간:** 1~2시간 특강
> **준비물:** 강의1에서 만든 GitHub 저장소, VS Code
> **결과물:** 색상·폰트·레이아웃이 적용된 나만의 스타일 홈페이지

---

## 강의 흐름 한눈에 보기

| 시간 | 단계 | 무엇을 배우나 |
|---|---|---|
| 0:00 ~ 0:10 | 1. CSS가 뭔가요? | 개념 잡기 |
| 0:10 ~ 0:30 | 2. CSS 기본 문법 | 선택자, 속성, 값 |
| 0:30 ~ 0:55 | 3. 자주 쓰는 CSS 속성 | 색상, 폰트, 여백, 테두리 |
| 0:55 ~ 1:20 | 4. Flexbox로 레이아웃 잡기 | 정렬의 핵심 |
| 1:20 ~ 1:40 | 5. 반응형 기초 | 핸드폰에서도 예쁘게 |
| 1:40 ~ 2:00 | 6. 실습 & 배포 | 꾸미고 GitHub에 올리기 |

---

## 1. CSS가 뭔가요? (10분)

### HTML과 CSS의 관계

강의1에서 HTML은 **"글자에 의미를 붙이는 것"** 이라고 했습니다.
CSS는 **"그 의미에 스타일을 입히는 것"** 입니다.

```
HTML = 뼈대 (구조)
CSS  = 옷, 화장 (스타일)
```

같은 HTML이어도 CSS에 따라 완전히 다른 페이지가 됩니다. 세상의 모든 웹사이트는 이 두 가지의 조합입니다.

### CSS를 적용하는 3가지 방법

**방법 1: 태그 안에 직접 (인라인)** — 비추천
```html
<h1 style="color: red;">제목</h1>
```

**방법 2: `<style>` 태그 안에** — 소규모에 적합 (강의1에서 쓴 방식)
```html
<head>
    <style>
        h1 { color: red; }
    </style>
</head>
```

**방법 3: 별도 `.css` 파일로 분리** — 실무 표준 ✅
```html
<head>
    <link rel="stylesheet" href="style.css">
</head>
```

오늘은 **방법 3**으로 진행합니다. HTML과 CSS를 파일로 분리하면 코드가 훨씬 깔끔해집니다.

---

## 2. CSS 기본 문법 (20분)

### 구조

```css
선택자 {
    속성: 값;
    속성: 값;
}
```

예시:
```css
h1 {
    color: blue;
    font-size: 32px;
}
```

- **선택자(selector)**: 어떤 HTML 요소에 적용할지 지정
- **속성(property)**: 무엇을 바꿀지
- **값(value)**: 어떻게 바꿀지
- 각 줄 끝에 반드시 **세미콜론(`;`)** — 빠뜨리면 아래 속성도 같이 안 먹힙니다

### 주요 선택자 3가지

**태그 선택자** — 해당 태그 전체에 적용
```css
p { color: gray; }
```

**클래스 선택자(`.`)** — `class="이름"` 붙은 요소에 적용
```css
.card { background: #f3f4f6; }
```
```html
<div class="card">내용</div>
```

**아이디 선택자(`#`)** — `id="이름"` 붙은 단 하나의 요소에 적용
```css
#header { background: #2563eb; }
```
```html
<div id="header">헤더</div>
```

> 💡 **실무 팁:** 아이디는 페이지에 딱 하나만 쓸 수 있습니다. 보통은 클래스를 더 많이 씁니다.

### `style.css` 파일 만들기

`index.html`과 **같은 폴더**에 `style.css` 파일을 만듭니다.

그리고 `index.html`의 `<head>` 안에 이 한 줄을 추가합니다:

```html
<link rel="stylesheet" href="style.css">
```

강의1의 `<style>` 태그 안에 있던 내용은 `style.css`로 옮기고, `<style>` 태그는 삭제합니다.

---

## 3. 자주 쓰는 CSS 속성 (25분)

### 3-1. 색상 (color, background-color)

```css
h1 {
    color: #2563eb;           /* 글자 색 */
    background-color: #eff6ff; /* 배경 색 */
}
```

**색상을 표현하는 방법**
- 이름: `red`, `blue`, `white`, `black` — 간단하지만 종류가 적음
- HEX: `#2563eb` — 실무에서 가장 많이 씀
- RGB: `rgb(37, 99, 235)` — 숫자로 직접 지정

> 💡 색상 선택이 어렵다면 [https://coolors.co](https://coolors.co) 또는 [https://colorhunt.co](https://colorhunt.co) 에서 팔레트를 골라보세요.

### 3-2. 폰트 (font-family, font-size, font-weight)

```css
body {
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 16px;
    font-weight: 400; /* 굵기: 400=보통, 700=굵게 */
    line-height: 1.6; /* 줄 간격: 1.6배 */
}
```

**구글 폰트 사용하기** (무료, 한국어 지원)

`<head>` 안에 추가:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
```

그러면 `font-family: 'Noto Sans KR'` 사용 가능.

### 3-3. 여백 (margin, padding)

가장 헷갈리는 부분이지만 핵심입니다.

```
┌─────────────────────────────┐
│         margin (바깥 여백)    │
│  ┌───────────────────────┐  │
│  │  border (테두리)       │  │
│  │  ┌─────────────────┐  │  │
│  │  │ padding (안쪽 여백)│  │  │
│  │  │  ┌───────────┐  │  │  │
│  │  │  │  content  │  │  │  │
│  │  │  └───────────┘  │  │  │
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

```css
.card {
    margin: 20px;          /* 바깥 여백 전체 */
    margin-top: 20px;      /* 위쪽만 */
    padding: 20px;         /* 안쪽 여백 전체 */
    padding: 10px 20px;    /* 위아래 10px, 좌우 20px */
}
```

### 3-4. 테두리와 둥근 모서리

```css
.card {
    border: 1px solid #e5e7eb;  /* 두께 스타일 색상 */
    border-radius: 8px;          /* 모서리 둥글게 */
    box-shadow: 0 2px 8px rgba(0,0,0,0.1); /* 그림자 */
}
```

### 3-5. 너비와 높이

```css
.container {
    width: 600px;      /* 고정 너비 */
    max-width: 100%;   /* 최대 너비 (화면보다 커지지 않게) */
    height: 200px;     /* 고정 높이 */
}
```

---

## 4. Flexbox로 레이아웃 잡기 (25분)

### Flexbox가 왜 필요한가

CSS에서 가장 골치 아픈 게 **"이걸 가운데 정렬하고 싶다"** 입니다.
Flexbox는 이 문제를 깔끔하게 해결합니다.

### 기본 개념

```css
.container {
    display: flex;
}
```

이 한 줄로 자식 요소들이 **가로로 나란히** 배치됩니다.

```
[자식1] [자식2] [자식3]
```

### 주요 속성

**justify-content** — 가로 방향 정렬
```css
.container {
    display: flex;
    justify-content: center;        /* 가운데 */
    justify-content: space-between; /* 양 끝에 붙이고 사이 균등 */
    justify-content: flex-end;      /* 오른쪽 끝 */
}
```

**align-items** — 세로 방향 정렬
```css
.container {
    display: flex;
    align-items: center;  /* 세로 가운데 */
    align-items: stretch; /* 늘려서 맞추기 (기본값) */
}
```

**flex-direction** — 배치 방향
```css
.container {
    display: flex;
    flex-direction: row;    /* 가로 (기본값) */
    flex-direction: column; /* 세로로 쌓기 */
}
```

**flex-wrap** — 줄 바꿈
```css
.container {
    display: flex;
    flex-wrap: wrap; /* 자식이 넘치면 다음 줄로 */
}
```

### 실전 예시: 카드 3개 나란히 배치

```css
.cards {
    display: flex;
    gap: 20px;       /* 자식 사이 간격 */
    flex-wrap: wrap; /* 화면 좁으면 줄 바꿈 */
}

.card {
    flex: 1;         /* 남은 공간을 균등하게 나눠 가짐 */
    min-width: 200px;
}
```

```html
<div class="cards">
    <div class="card">카드 1</div>
    <div class="card">카드 2</div>
    <div class="card">카드 3</div>
</div>
```

### 자주 쓰는 패턴: 수평·수직 완전 가운데 정렬

```css
.center-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* 화면 전체 높이 */
}
```

---

## 5. 반응형 기초 (20분)

### 반응형이란?

화면 크기(데스크탑, 태블릿, 핸드폰)에 따라 레이아웃이 자동으로 바뀌는 것.

### viewport 메타 태그

`<head>` 안에 반드시 있어야 합니다. (강의1 예제에는 이미 있음)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

이게 없으면 핸드폰에서 데스크탑 화면을 축소한 것처럼 보입니다.

### 미디어 쿼리 (Media Query)

"화면 너비가 600px 이하일 때" 같은 조건을 CSS에 걸 수 있습니다.

```css
/* 기본 스타일: 데스크탑 */
.cards {
    display: flex;
    gap: 20px;
}

/* 화면 너비가 600px 이하일 때 */
@media (max-width: 600px) {
    .cards {
        flex-direction: column; /* 세로로 쌓기 */
    }
}
```

### 자주 쓰는 브레이크포인트

```css
/* 태블릿 */
@media (max-width: 768px) { ... }

/* 핸드폰 */
@media (max-width: 480px) { ... }
```

### 핸드폰에서 확인하는 법

브라우저에서 **F12** → 좌측 상단 **📱 아이콘** (Toggle device toolbar) 클릭 → 상단에서 기기 선택 (iPhone, Galaxy 등).

---

## 6. 실습 & 배포 (20분)

### 오늘의 완성 예제

`index.html`과 `style.css`를 분리한 구조로 완성합니다.

> 예제 파일: [`src/index.html`](src/index.html), [`src/style.css`](src/style.css)

### GitHub에 올리기

강의1에서 만든 `my-website` 저장소에 업로드합니다.

1. GitHub 저장소 → **Add file** → **Upload files**
2. `index.html`, `style.css` 둘 다 드래그
3. **Commit changes**

Vercel이 자동으로 감지해서 30초 내로 반영됩니다.

### 도전 과제 (난이도 순)

1. 🟢 구글 폰트 적용해보기 (Noto Sans KR 또는 원하는 폰트)
2. 🟢 `hover` 효과 추가 (`a:hover { color: red; }`)
3. 🟡 카드 레이아웃을 Flexbox로 가로 배치
4. 🟡 헤더 영역 만들기 (배경색 + 가운데 정렬)
5. 🔴 핸드폰에서 레이아웃이 바뀌도록 미디어 쿼리 적용

### 자주 막히는 지점

- **CSS가 안 먹힘**: `<link rel="stylesheet" href="style.css">` 경로가 맞는지 확인. 대소문자도 구분합니다.
- **여백이 이상함**: `margin`과 `padding` 헷갈리지 마세요. 개발자 도구(F12) → **Computed** 탭에서 박스 모델 확인 가능.
- **가운데 정렬이 안 됨**: `text-align: center`는 **텍스트**만 가운데, 블록 요소를 가운데 두려면 `margin: 0 auto` 또는 Flexbox.
- **Flexbox가 안 먹힘**: `display: flex`는 **부모**에 줘야 합니다. 자식에 주면 효과 없음.

---

## 7. 마무리 & 다음 단계 (10분)

### 오늘 배운 것

```
CSS 파일 분리 (style.css)
    ↓
선택자·속성·값 문법
    ↓
색상, 폰트, 여백, 테두리
    ↓
Flexbox 레이아웃
    ↓
미디어 쿼리로 반응형
    ↓
GitHub 업로드 → Vercel 자동 반영
```

### 다음에 배우면 좋은 것들

| 단계 | 무엇을 | 왜 |
|---|---|---|
| 다음주 | **Git 명령어** | 터미널로 직접 커밋·푸시 |
| 그 다음 | **JavaScript 기초** | 버튼 클릭, 동적 동작 추가 |
| 한 달 후 | **CSS 심화** | 애니메이션, Grid, 변수 |
| 두 달 후 | **React + Next.js** | 컴포넌트 기반 개발 |

### 추천 학습 자료 (모두 무료)

- **CSS Tricks - Flexbox Guide** ([https://css-tricks.com/snippets/css/a-guide-to-flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox)) — Flexbox 완벽 정리
- **MDN CSS 문서** ([https://developer.mozilla.org/ko/docs/Web/CSS](https://developer.mozilla.org/ko/docs/Web/CSS)) — 속성 사전
- **Flexbox Froggy** ([https://flexboxfroggy.com/#ko](https://flexboxfroggy.com/#ko)) — 게임으로 배우는 Flexbox

---

## 부록 A. 자주 묻는 질문 (FAQ)

**Q. CSS 파일이 적용이 안 돼요.**
`<link>` 태그의 `href` 경로가 맞는지 확인하세요. `style.css`와 `index.html`이 같은 폴더에 있어야 `href="style.css"`가 동작합니다. 다른 폴더면 `href="css/style.css"` 처럼 경로 조정.

**Q. 색상 코드는 어떻게 골라요?**
디자인 팔레트 사이트를 쓰는 게 가장 빠릅니다. [https://colorhunt.co](https://colorhunt.co) 추천. VS Code를 쓴다면 컬러 피커 확장도 편리합니다.

**Q. `px`, `em`, `rem`, `%` 차이가 뭐예요?**
- `px`: 절대 단위. 화면 픽셀 수.
- `%`: 부모 요소 기준 비율.
- `rem`: 루트(`html`) 폰트 크기 기준. 반응형에 유리.
- `em`: 현재 요소 폰트 크기 기준. 입문 단계에선 `px`과 `rem`만 써도 충분합니다.

**Q. Flexbox 말고 Grid는 언제 써요?**
Flexbox는 **1차원(가로 또는 세로)** 배치, Grid는 **2차원(가로+세로 동시)** 배치입니다. 카드 목록, 갤러리처럼 행과 열이 동시에 필요할 때 Grid가 편합니다. 입문 단계에서는 Flexbox만 잘 써도 충분합니다.

---

## 부록 B. 강사용 운영 팁

- **개발자 도구(F12)를 처음부터 열어두세요.** CSS는 결과가 바로 보이는 게 장점인데, 개발자 도구로 실시간으로 값 바꿔보면서 설명하면 이해가 훨씬 빠릅니다.
- **박스 모델 시각화가 핵심입니다.** F12 → Elements 탭 → 하단 박스 다이어그램을 보여주면서 margin/padding 설명하면 오해가 확 줄어듭니다.
- **Flexbox는 게임으로 마무리.** [https://flexboxfroggy.com/#ko](https://flexboxfroggy.com/#ko) 를 수업 중에 5분만 풀게 해도 기억에 오래 남습니다.
- **"왜 이렇게 생겼어요?" 질문이 많이 나옵니다.** 디자인 감각은 별도 영역임을 알려주고, 색상 팔레트 사이트를 바로 알려주는 게 효과적입니다.
- **반응형은 마지막에.** 반응형을 처음부터 신경 쓰면 너무 복잡해집니다. 먼저 데스크탑에서 완성하고, 마지막에 미디어 쿼리 한 블록 추가하는 순서로 진행하세요.

---

*문서 작성: 2026-05 / 라이선스: 자유롭게 수정·재배포 가능*
