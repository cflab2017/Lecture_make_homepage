# 강의 07 — 반응형 웹 디자인

반응형 웹(Responsive Web Design)은 모바일, 태블릿, PC 등  
다양한 화면 크기에서 최적의 레이아웃을 제공하는 웹 설계 방법입니다.

---

## 1. 뷰포트 메타 태그 (필수)

```html
<!-- HTML <head>에 반드시 포함 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- `width=device-width`: 뷰포트 너비를 기기 화면 너비와 동일하게
- `initial-scale=1.0`: 초기 확대/축소 배율 1배
- 이 태그 없이는 @media 쿼리가 제대로 동작하지 않습니다.

---

## 2. @media 쿼리

화면 너비(또는 다른 조건)에 따라 다른 CSS를 적용합니다.

```css
/* 기본: 모바일 스타일 */
.container {
  padding: 16px;
  font-size: 14px;
}

/* 태블릿 이상 (768px 이상) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    font-size: 16px;
  }
}

/* PC (1024px 이상) */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

## 3. Mobile-First vs Desktop-First

### Mobile-First (권장)

기본 스타일을 모바일로 작성하고, `min-width`로 더 큰 화면을 추가합니다.

```css
/* 기본 = 모바일 */
.cards { display: block; }

/* 태블릿 */
@media (min-width: 768px) {
  .cards { display: flex; flex-wrap: wrap; }
}

/* PC */
@media (min-width: 1024px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}
```

### Desktop-First

기본 스타일을 PC로 작성하고, `max-width`로 더 작은 화면을 처리합니다.

```css
/* 기본 = PC */
.cards { display: grid; grid-template-columns: repeat(3, 1fr); }

/* 태블릿 이하 */
@media (max-width: 1023px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}

/* 모바일 이하 */
@media (max-width: 767px) {
  .cards { display: block; }
}
```

> Mobile-First가 성능과 접근성 면에서 권장됩니다.

---

## 4. 주요 Breakpoint

| 이름 | 너비 | 대상 기기 |
|------|------|-----------|
| 소형 | ~ 480px | 작은 스마트폰 |
| 모바일 | 480px ~ 768px | 일반 스마트폰 |
| 태블릿 | 768px ~ 1024px | 태블릿, 작은 노트북 |
| 데스크탑 | 1024px ~ | PC, 큰 노트북 |

---

## 5. 반응형 단위

| 단위 | 설명 | 예시 |
|------|------|------|
| `px` | 고정 픽셀 | `font-size: 16px` |
| `%` | 부모 요소 기준 비율 | `width: 50%` |
| `em` | 현재 요소의 font-size 기준 | `padding: 1.5em` |
| `rem` | 루트(html) font-size 기준 | `font-size: 1rem` |
| `vw` | 뷰포트 너비의 % | `width: 100vw` |
| `vh` | 뷰포트 높이의 % | `height: 100vh` |

```css
/* rem 활용: html font-size 기준 */
html { font-size: 16px; } /* 기본값 */
h1 { font-size: 2rem; }   /* 16 × 2 = 32px */
p  { font-size: 1rem; }   /* 16 × 1 = 16px */
```

---

## 6. clamp() — 유동적 크기

`clamp(최솟값, 이상적인값, 최댓값)`으로 단계 없이 부드럽게 크기가 변합니다.

```css
h1 {
  /* 최소 1.5rem, 최대 3rem, 뷰포트 너비의 5% 기준 */
  font-size: clamp(1.5rem, 5vw, 3rem);
}

.container {
  /* 최소 300px, 최대 1200px */
  width: clamp(300px, 90%, 1200px);
}
```

---

## 예제 파일

`예제/` 폴더의 `responsive.html`을 브라우저로 열고  
창 너비를 조절하며 1열→2열→3열 변화를 확인하세요.

## 과제

`과제/과제.md`를 읽고 **포트폴리오 반응형 적용**을 완성하세요.
