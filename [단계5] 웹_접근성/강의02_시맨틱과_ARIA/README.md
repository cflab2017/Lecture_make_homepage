# 강의02 — 시맨틱 HTML과 ARIA

## 학습 목표

- 시맨틱 HTML이 접근성에 미치는 영향을 이해한다
- ARIA 속성을 올바르게 사용할 수 있다
- 키보드 내비게이션을 올바르게 구현할 수 있다
- 모달에서 focus trap을 구현할 수 있다

---

## 1. 시맨틱 HTML의 접근성 이점

시맨틱 태그는 **의미를 가진 태그**입니다. 스크린리더는 이를 활용하여 사용자에게 맥락을 전달합니다.

### 비시맨틱 vs 시맨틱 비교

```html
<!-- 나쁜 예: 의미 없는 div/span -->
<div class="header">
    <div class="nav">
        <div onclick="go('/')">홈</div>
    </div>
</div>
<div class="main-content">
    <div class="article">
        <div class="title">제목</div>
    </div>
</div>

<!-- 좋은 예: 시맨틱 태그 -->
<header>
    <nav>
        <a href="/">홈</a>
    </nav>
</header>
<main>
    <article>
        <h1>제목</h1>
    </article>
</main>
```

### 스크린리더가 인식하는 랜드마크

| 태그 | ARIA 역할 | 스크린리더 안내 |
|------|----------|---------------|
| `<header>` | banner | "배너 영역" |
| `<nav>` | navigation | "탐색 영역" |
| `<main>` | main | "주요 콘텐츠" |
| `<aside>` | complementary | "보완 영역" |
| `<footer>` | contentinfo | "콘텐츠 정보" |
| `<section>` | region | 섹션 |
| `<article>` | article | 독립적인 콘텐츠 |

---

## 2. ARIA (Accessible Rich Internet Applications)

ARIA는 시맨틱 HTML이 표현할 수 없는 **동적 콘텐츠와 복잡한 UI**의 접근성을 보완합니다.

### 황금 규칙

> "No ARIA is better than Bad ARIA"  
> 잘못된 ARIA는 없는 것보다 나쁩니다. 시맨틱 HTML로 해결할 수 있다면 ARIA를 쓰지 마세요.

---

### role — 요소의 역할 정의

```html
<!-- 버튼 역할이지만 div를 사용해야 할 때 -->
<div role="button" tabindex="0" onclick="..." onkeydown="...">
    클릭하세요
</div>

<!-- 탭 UI -->
<div role="tablist">
    <button role="tab" aria-selected="true" aria-controls="panel1">탭1</button>
    <button role="tab" aria-selected="false" aria-controls="panel2">탭2</button>
</div>
<div role="tabpanel" id="panel1">탭1 내용</div>
<div role="tabpanel" id="panel2" hidden>탭2 내용</div>
```

---

### aria-label — 레이블 직접 지정

```html
<!-- 텍스트가 없는 버튼 -->
<button aria-label="메뉴 닫기">
    <svg aria-hidden="true">...</svg>
</button>

<!-- 여러 검색창이 있을 때 구분 -->
<input type="search" aria-label="상품 검색">
<input type="search" aria-label="블로그 검색">
```

### aria-labelledby — 다른 요소를 레이블로 참조

```html
<h2 id="section-title">최신 상품</h2>
<ul aria-labelledby="section-title">
    <li>...</li>
</ul>

<!-- 모달 제목 연결 -->
<div role="dialog" aria-labelledby="modal-title" aria-modal="true">
    <h2 id="modal-title">주문 확인</h2>
    <p>주문을 완료하시겠습니까?</p>
</div>
```

### aria-describedby — 추가 설명 연결

```html
<input
    type="password"
    id="pw"
    aria-describedby="pw-hint"
>
<p id="pw-hint">8자 이상, 대소문자 + 숫자 + 특수문자 포함</p>
```

### aria-expanded — 열림/닫힘 상태

```html
<button
    aria-expanded="false"
    aria-controls="menu"
    onclick="toggleMenu()"
>
    메뉴 열기
</button>
<ul id="menu" hidden>...</ul>

<script>
function toggleMenu() {
    const btn = document.querySelector('button');
    const menu = document.getElementById('menu');
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    btn.setAttribute('aria-expanded', !isOpen);
    menu.hidden = isOpen;
    btn.textContent = isOpen ? '메뉴 열기' : '메뉴 닫기';
}
</script>
```

### aria-hidden — 스크린리더에서 숨기기

```html
<!-- 장식용 아이콘은 스크린리더에서 제외 -->
<button>
    <svg aria-hidden="true" focusable="false">...</svg>
    저장
</button>
```

---

## 3. 키보드 내비게이션

### 기본 규칙

| 키 | 동작 |
|----|------|
| Tab | 다음 포커스 가능 요소로 이동 |
| Shift+Tab | 이전 요소로 이동 |
| Enter | 링크 활성화, 버튼 클릭 |
| Space | 버튼 토글, 체크박스 |
| 화살표 | 라디오 그룹, 탭, 슬라이더 |
| Escape | 모달/팝업 닫기 |

### tabindex 속성

```html
<!-- tabindex="0": Tab으로 접근 가능 (자연스러운 순서) -->
<div role="button" tabindex="0">클릭 가능</div>

<!-- tabindex="-1": Tab으로 접근 불가, 하지만 JS로 focus() 가능 -->
<!-- 모달이 열릴 때 첫 번째 요소에 포커스를 이동할 때 사용 -->
<div id="modal" tabindex="-1">...</div>

<!-- tabindex="1" 이상: 사용 금지! 자연 순서를 깨뜨림 -->
```

---

## 4. Skip Navigation Link

페이지 반복 내비게이션을 건너뛰는 링크입니다.

```html
<!-- <body> 최상단에 위치 -->
<a href="#main-content" class="skip-link">본문 바로가기</a>

<nav>... (긴 내비게이션) ...</nav>

<main id="main-content">
    <!-- 포커스를 받을 수 있도록 tabindex="-1" 추가 -->
    <h1 tabindex="-1">페이지 제목</h1>
</main>
```

```css
.skip-link {
    position: absolute;
    top: -100%;          /* 평소에는 화면 밖에 위치 */
    left: 0;
    padding: 8px 16px;
    background: #000;
    color: #fff;
    z-index: 9999;
    text-decoration: none;
}

.skip-link:focus {
    top: 0;              /* 포커스 받으면 화면에 표시 */
}
```

---

## 예제 파일

- `예제/accessible-nav.html` — 접근성 완전한 네비게이션

---

## 다음 강의

강의03에서는 폼의 접근성을 개선하는 방법을 학습합니다.
