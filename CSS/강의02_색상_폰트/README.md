# 강의 02 — 색상 & 폰트

CSS에서 색상을 표현하는 다양한 방법과 타이포그래피(글꼴, 크기, 간격)를 학습합니다.  
CSS 변수를 활용해 일관된 디자인 시스템을 구축하는 방법도 다룹니다.

---

## 1. 색상 표현법

CSS에서 색상을 지정하는 방식은 여러 가지입니다.

### 색상 이름 (Color Name)

```css
color: red;
color: blue;
color: tomato;
color: cornflowerblue;
```

- 직관적이지만 색상 종류가 제한적입니다.
- 실무에서는 거의 사용하지 않습니다.

### HEX 코드

```css
color: #ff0000;    /* 빨강 */
color: #333333;    /* 짙은 회색 */
color: #fff;       /* 흰색 (단축형) */
```

- `#RRGGBB` 형식으로 빨강/초록/파랑 각각 0~FF(0~255)
- 실무에서 가장 많이 사용합니다.

### RGB

```css
color: rgb(255, 0, 0);      /* 빨강 */
color: rgb(51, 51, 51);     /* 짙은 회색 */
```

- 각 채널이 0~255 범위입니다.

### RGBA (투명도 포함)

```css
color: rgba(0, 0, 0, 0.5);        /* 반투명 검정 */
background-color: rgba(52, 152, 219, 0.2); /* 연한 파랑 배경 */
```

- 네 번째 값(Alpha)이 투명도: 0(완전 투명) ~ 1(완전 불투명)

### HSL

```css
color: hsl(0, 100%, 50%);    /* 빨강 */
color: hsl(210, 50%, 50%);   /* 파랑 계열 */
```

- `hsl(색조, 채도, 명도)` 형식
- 색상 조정이 직관적이어서 디자이너가 선호합니다.

---

## 2. Google Fonts 연결

웹 폰트를 사용하면 사용자 컴퓨터에 해당 폰트가 없어도 표시됩니다.

```html
<!-- HTML <head>에 추가 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
```

```css
/* CSS에서 사용 */
body {
  font-family: 'Noto Sans KR', sans-serif;
}
```

> **Noto Sans KR**: 한국어 웹 폰트로 가장 널리 사용됩니다.

---

## 3. 폰트 관련 속성

```css
p {
  font-family: 'Noto Sans KR', sans-serif;  /* 글꼴 이름 */
  font-size: 16px;                           /* 글자 크기 */
  font-weight: 400;                          /* 굵기: 100~900, normal=400, bold=700 */
  font-style: italic;                        /* 기울임: normal, italic */
  line-height: 1.6;                          /* 줄 간격 (단위 없이 배수로 권장) */
  letter-spacing: 0.5px;                     /* 글자 사이 간격 */
  word-spacing: 2px;                         /* 단어 사이 간격 */
}
```

---

## 4. 텍스트 꾸미기

```css
p {
  text-decoration: underline;    /* 밑줄 */
  text-decoration: line-through; /* 취소선 */
  text-decoration: none;         /* 없음 (링크 기본 밑줄 제거 시 사용) */

  text-transform: uppercase;     /* 모두 대문자 */
  text-transform: lowercase;     /* 모두 소문자 */
  text-transform: capitalize;    /* 첫 글자만 대문자 */

  text-align: left;              /* 왼쪽 정렬 */
  text-align: center;            /* 가운데 정렬 */
  text-align: right;             /* 오른쪽 정렬 */
  text-align: justify;           /* 양쪽 정렬 */
}
```

---

## 5. CSS 변수 (Custom Properties)

`:root`에 변수를 선언하면 전체 파일에서 재사용할 수 있습니다.

```css
/* 변수 선언: 콜론 두 개로 시작 */
:root {
  --color-primary: #3498db;    /* 메인 색상 */
  --color-secondary: #2ecc71; /* 보조 색상 */
  --color-background: #f5f5f5; /* 배경색 */
  --font-size-base: 16px;      /* 기본 글자 크기 */
}

/* 변수 사용: var() 함수 */
h1 {
  color: var(--color-primary);
  font-size: var(--font-size-base);
}

button {
  background-color: var(--color-secondary);
}
```

**CSS 변수의 장점:**
- 색상을 한 곳에서 관리 → 변경이 쉽습니다.
- 브랜드 컬러, 디자인 토큰을 체계적으로 관리할 수 있습니다.

---

## 예제 파일

`예제/` 폴더의 `typography.html`을 브라우저로 열어 다양한 타이포그래피 스타일을 확인하세요.

## 과제

`과제/과제.md`를 읽고 **브랜드 색상 팔레트**를 만들어 보세요.
