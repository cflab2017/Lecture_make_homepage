# 강의 06 - 시맨틱 HTML

> 의미 있는 태그를 사용하여 접근성이 좋고 SEO에 강한 HTML을 작성하는 방법을 배웁니다.

---

## 1. 시맨틱(Semantic)이란?

**시맨틱(Semantic)** 은 "의미론적"이라는 뜻입니다.  
시맨틱 HTML은 **태그 이름 자체가 내용의 의미와 역할을 설명**하는 HTML을 말합니다.

### div vs 시맨틱 태그 비교

```html
<!-- 비시맨틱 방식 (나쁜 예) -->
<div id="header">...</div>
<div id="nav">...</div>
<div id="main">...</div>
<div id="sidebar">...</div>
<div id="footer">...</div>

<!-- 시맨틱 방식 (좋은 예) -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<aside>...</aside>
<footer>...</footer>
```

두 코드는 브라우저에서 똑같이 보일 수 있지만,  
시맨틱 방식은 **코드의 의미**가 훨씬 명확합니다.

---

## 2. 왜 시맨틱 HTML을 써야 할까?

### 1) SEO (검색 엔진 최적화)
- 검색 엔진(Google, Naver 등)이 페이지 내용을 더 잘 이해할 수 있습니다.
- `<h1>`~`<h6>`, `<article>`, `<section>` 등의 태그가 검색 순위에 영향을 줍니다.

### 2) 접근성 (Accessibility)
- 시각장애인이 사용하는 **스크린리더**가 페이지 구조를 올바르게 안내합니다.
- 예: "헤더로 이동", "내비게이션 메뉴", "주요 콘텐츠 시작" 등을 자동으로 알려줌

### 3) 코드 가독성
- 개발자들이 코드를 읽을 때 각 부분의 역할을 바로 이해할 수 있습니다.
- 유지보수와 협업이 훨씬 쉬워집니다.

---

## 3. 주요 시맨틱 태그

### header - 머리글

페이지 또는 섹션의 소개/머리글 영역입니다.

```html
<!-- 페이지 전체의 헤더 -->
<header>
  <h1>사이트 이름</h1>
  <p>사이트 설명 또는 슬로건</p>
  <nav>...</nav>
</header>

<!-- 특정 섹션의 헤더도 가능 -->
<article>
  <header>
    <h2>글 제목</h2>
    <p>작성일: 2026년 5월 10일</p>
  </header>
  <p>글 내용...</p>
</article>
```

### nav - 내비게이션

사이트의 주요 링크 모음(메뉴)을 나타냅니다.

```html
<nav>
  <ul>
    <li><a href="/">홈</a></li>
    <li><a href="/about">소개</a></li>
    <li><a href="/blog">블로그</a></li>
    <li><a href="/contact">연락처</a></li>
  </ul>
</nav>
```

> `<nav>` 는 사이트의 **주요 내비게이션**에만 사용합니다.  
> 본문 중간의 일반 링크에는 사용하지 않습니다.

### main - 주요 콘텐츠

페이지의 **핵심 내용**을 담는 영역입니다. **페이지에 하나만** 사용합니다.

```html
<main>
  <!-- 페이지의 주요 콘텐츠가 여기에 들어갑니다 -->
  <h1>오늘의 뉴스</h1>
  <article>...</article>
  <article>...</article>
</main>
```

### section - 섹션

문서의 독립적인 **섹션(구획)**을 나타냅니다.  
제목(`<h2>`~`<h6>`)을 포함하는 것을 권장합니다.

```html
<main>
  <section>
    <h2>최신 뉴스</h2>
    <article>...</article>
    <article>...</article>
  </section>

  <section>
    <h2>인기 기사</h2>
    <article>...</article>
  </section>
</main>
```

### article - 독립적인 콘텐츠

**그 자체로 독립적**으로 배포되거나 재사용될 수 있는 콘텐츠입니다.  
블로그 포스트, 뉴스 기사, 댓글, 제품 카드 등에 적합합니다.

```html
<article>
  <header>
    <h2>HTML이란 무엇인가?</h2>
    <p>작성자: 홍길동 | 2026년 5월 10일</p>
  </header>
  <p>HTML은 웹 페이지의 구조를 정의하는 언어입니다...</p>
  <footer>
    <p>태그: HTML, 웹 기초</p>
  </footer>
</article>
```

### section vs article

| 태그 | 독립성 | 사용 예 |
|------|--------|---------|
| `<section>` | 다른 섹션과 연관된 부분 구획 | 챕터, 탭 패널, 뉴스 카테고리 묶음 |
| `<article>` | 독립적으로 의미가 완결되는 콘텐츠 | 블로그 글, 뉴스 기사, 댓글 하나 |

### aside - 부가 콘텐츠

주요 콘텐츠와 **간접적으로 관련된 부가 정보**를 나타냅니다.  
사이드바, 광고, 관련 글 목록 등에 사용합니다.

```html
<div>
  <main>
    <article>
      <h1>기사 제목</h1>
      <p>기사 내용...</p>
    </article>
  </main>

  <aside>
    <h2>관련 기사</h2>
    <ul>
      <li><a href="#">관련 기사 1</a></li>
      <li><a href="#">관련 기사 2</a></li>
    </ul>

    <h2>광고</h2>
    <p>광고 내용...</p>
  </aside>
</div>
```

### footer - 바닥글

페이지 또는 섹션의 **바닥글** 영역입니다.  
저작권 정보, 연락처, 사이트맵 등을 포함합니다.

```html
<footer>
  <p>© 2026 홍길동. 모든 권리 보유.</p>
  <nav>
    <a href="/terms">이용약관</a>
    <a href="/privacy">개인정보처리방침</a>
    <a href="/contact">문의하기</a>
  </nav>
  <address>
    서울특별시 강남구 테헤란로 123 | 이메일: contact@example.com
  </address>
</footer>
```

### figure와 figcaption (복습)

```html
<figure>
  <img src="chart.png" alt="2026년 매출 증가 그래프">
  <figcaption>그림 1: 2026년 1분기 매출 현황 (단위: 억 원)</figcaption>
</figure>
```

### time - 날짜/시간

기계가 읽을 수 있는 형식으로 날짜/시간을 나타냅니다.

```html
<!-- datetime 속성에 기계가 읽을 수 있는 ISO 형식으로 작성 -->
<time datetime="2026-05-10">2026년 5월 10일</time>
<time datetime="2026-05-10T14:30">오후 2시 30분</time>
<time datetime="PT2H30M">2시간 30분</time>

<!-- 사용 예 -->
<article>
  <h2>최신 뉴스</h2>
  <p>작성: <time datetime="2026-05-10">2026년 5월 10일</time></p>
</article>
```

### address - 연락처 정보

```html
<address>
  <!-- 작성자나 조직의 연락처 정보 -->
  작성자: <a href="mailto:hong@example.com">홍길동</a><br>
  서울특별시 강남구 테헤란로 123
</address>
```

---

## 4. 전체 페이지 레이아웃 예시

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>블로그</title>
</head>
<body>

  <!-- 페이지 헤더: 로고, 사이트 이름, 메인 메뉴 -->
  <header>
    <h1>나의 웹 개발 블로그</h1>
    <nav>
      <ul>
        <li><a href="/">홈</a></li>
        <li><a href="/html">HTML</a></li>
        <li><a href="/css">CSS</a></li>
        <li><a href="/js">JavaScript</a></li>
      </ul>
    </nav>
  </header>

  <!-- 페이지 주요 콘텐츠 -->
  <main>

    <!-- 최신 글 섹션 -->
    <section>
      <h2>최신 글</h2>

      <!-- 개별 블로그 글 -->
      <article>
        <header>
          <h3>HTML 기초 완전 정복</h3>
          <time datetime="2026-05-10">2026년 5월 10일</time>
        </header>
        <p>HTML의 기본 구조와 주요 태그에 대해 알아봅니다...</p>
        <footer>
          <p>태그: HTML, 기초</p>
        </footer>
      </article>

      <article>
        <header>
          <h3>CSS 선택자 완벽 가이드</h3>
          <time datetime="2026-05-08">2026년 5월 8일</time>
        </header>
        <p>CSS 선택자의 모든 것을 정리했습니다...</p>
        <footer>
          <p>태그: CSS, 선택자</p>
        </footer>
      </article>

    </section>

  </main>

  <!-- 사이드바: 부가 정보 -->
  <aside>
    <section>
      <h2>카테고리</h2>
      <ul>
        <li><a href="/html">HTML (6편)</a></li>
        <li><a href="/css">CSS (4편)</a></li>
        <li><a href="/js">JavaScript (2편)</a></li>
      </ul>
    </section>

    <section>
      <h2>최근 댓글</h2>
      <p>잘 보고 갑니다! - 김철수</p>
    </section>
  </aside>

  <!-- 페이지 푸터 -->
  <footer>
    <p>© 2026 홍길동의 웹 개발 블로그</p>
    <address>
      문의: <a href="mailto:hong@example.com">hong@example.com</a>
    </address>
  </footer>

</body>
</html>
```

---

## 5. div와 span은 언제 쓰나요?

시맨틱 태그로 대체할 수 없을 때 `<div>`와 `<span>`을 사용합니다.

```html
<!-- 스타일 적용을 위해 묶을 때 (의미적 역할 없음) -->
<div class="card-grid">
  <article>...</article>
  <article>...</article>
  <article>...</article>
</div>

<!-- 텍스트 일부에 스타일 적용 -->
<p>가격: <span class="price">35,000원</span> (부가세 포함)</p>
```

---

## 정리

| 태그 | 역할 | 개수 제한 |
|------|------|----------|
| `<header>` | 페이지/섹션 머리글 | 여러 개 가능 |
| `<nav>` | 주요 내비게이션 | 여러 개 가능 |
| `<main>` | 페이지 주요 콘텐츠 | **페이지당 하나** |
| `<section>` | 연관된 콘텐츠 구획 | 여러 개 가능 |
| `<article>` | 독립적인 콘텐츠 단위 | 여러 개 가능 |
| `<aside>` | 부가적 관련 콘텐츠 | 여러 개 가능 |
| `<footer>` | 페이지/섹션 바닥글 | 여러 개 가능 |
| `<figure>` | 이미지/미디어+캡션 묶음 | 여러 개 가능 |
| `<figcaption>` | figure의 설명 | figure당 하나 |
| `<time>` | 날짜/시간 | 여러 개 가능 |
| `<address>` | 연락처 정보 | 여러 개 가능 |

---

## 다음 단계

- [예제 파일 보기](./예제/blog.html) - 시맨틱 태그로 구성된 블로그 레이아웃
- [과제 확인하기](./과제/과제.md) - 포트폴리오 페이지 시맨틱 구조 잡기
- HTML 과목 완료! 다음은 **CSS**를 배워 멋진 스타일을 입혀보세요!
