# 강의 01 — CSS 기초

CSS(Cascading Style Sheets)는 HTML 요소의 **모양**을 결정하는 언어입니다.  
이 강의에서는 CSS를 HTML에 연결하는 방법, 선택자, 우선순위, 상속 개념을 학습합니다.

---

## 1. CSS 연결 방법

### 1-1. 인라인 (Inline)

HTML 태그의 `style` 속성에 직접 작성합니다.

```html
<p style="color: red; font-size: 18px;">인라인 스타일</p>
```

- 우선순위가 가장 높습니다.
- 재사용이 불가능하고 유지보수가 어렵습니다. **권장하지 않습니다.**

### 1-2. 내부 스타일 (Internal)

`<head>` 태그 안에 `<style>` 태그로 작성합니다.

```html
<head>
  <style>
    p { color: blue; }
  </style>
</head>
```

- 해당 HTML 파일에만 적용됩니다.
- 소규모 프로젝트나 테스트에 적합합니다.

### 1-3. 외부 스타일 (External) — 권장

별도의 `.css` 파일을 만들고 `<link>` 태그로 연결합니다.

```html
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

- 여러 HTML 파일에서 동일한 CSS를 재사용할 수 있습니다.
- 유지보수가 가장 쉽습니다. **실무에서 표준 방식입니다.**

---

## 2. 선택자 (Selector)

스타일을 적용할 HTML 요소를 지정하는 문법입니다.

| 선택자 종류 | 예시 | 설명 |
|------------|------|------|
| 태그 선택자 | `p { }` | 모든 `<p>` 태그 선택 |
| 클래스 선택자 | `.card { }` | `class="card"` 요소 선택 |
| ID 선택자 | `#header { }` | `id="header"` 요소 선택 |
| 자손 선택자 | `div p { }` | `div` 안의 모든 `p` 선택 |
| 자식 선택자 | `ul > li { }` | `ul`의 직계 자식 `li`만 선택 |
| 형제 선택자 | `h1 + p { }` | `h1` 바로 다음 `p` 선택 |
| 전체 선택자 | `* { }` | 모든 요소 선택 |

### 가상 클래스 선택자 (Pseudo-class)

```css
a:hover   { color: red; }    /* 마우스를 올렸을 때 */
a:visited { color: purple; } /* 방문한 링크 */
li:first-child { color: blue; } /* 첫 번째 자식 요소 */
li:last-child  { color: green; } /* 마지막 자식 요소 */
li:nth-child(2) { color: orange; } /* 두 번째 자식 요소 */
```

---

## 3. 우선순위 (Specificity)

같은 요소에 여러 스타일이 충돌하면, **우선순위**에 따라 하나가 적용됩니다.

```
인라인 스타일 > ID 선택자 > 클래스 선택자 > 태그 선택자
```

| 선택자 | 점수 |
|--------|------|
| 인라인 (`style=""`) | 1000점 |
| ID (`#id`) | 100점 |
| 클래스 (`.class`), 가상 클래스 (`:hover`) | 10점 |
| 태그 (`p`, `div`) | 1점 |

```css
/* 예시: 모두 같은 <p id="title" class="text"> 에 적용될 때 */
p           { color: black; }   /* 1점 */
.text       { color: blue; }    /* 10점 */
#title      { color: red; }     /* 100점 → 이 색이 적용됨 */
```

> `!important`를 사용하면 모든 우선순위를 무시하지만, 남용하면 유지보수가 어려워집니다.

---

## 4. 상속 (Inheritance)

부모 요소의 일부 CSS 속성은 자식 요소에 자동으로 **상속**됩니다.

```css
body {
  font-family: 'Arial', sans-serif; /* 모든 자식에게 상속 */
  color: #333;
}
```

**상속되는 속성:** `color`, `font-family`, `font-size`, `line-height`, `text-align` 등  
**상속되지 않는 속성:** `margin`, `padding`, `border`, `background`, `width` 등

---

## 5. 기본 텍스트 속성

```css
p {
  color: #333333;          /* 글자 색상 */
  font-size: 16px;         /* 글자 크기 */
  font-weight: bold;       /* 글자 굵기: normal, bold, 100~900 */
  text-align: center;      /* 정렬: left, center, right, justify */
  text-decoration: none;   /* 밑줄 제거 (링크에서 자주 사용) */
  line-height: 1.6;        /* 줄 간격 */
}
```

---

## 예제 파일

`예제/` 폴더의 `index.html`을 브라우저로 열어 다양한 선택자가 동작하는 모습을 확인하세요.

## 과제

`과제/과제.md`를 읽고 **나만의 배지 만들기**를 완성하세요.
