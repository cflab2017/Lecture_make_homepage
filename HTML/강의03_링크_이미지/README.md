# 강의 03 - 링크와 이미지

> 웹 페이지를 연결하는 링크와 이미지를 삽입하는 방법을 배웁니다.

---

## 1. 링크 태그 (a - Anchor)

`<a>` 태그는 다른 페이지, 같은 페이지의 특정 위치, 파일, 이메일 등으로 이동하는 **하이퍼링크**를 만듭니다.

### 기본 사용법

```html
<a href="이동할 주소">링크 텍스트</a>
```

### href 속성 (Hypertext Reference)

```html
<!-- 외부 웹사이트 링크 -->
<a href="https://www.naver.com">네이버</a>

<!-- 같은 폴더의 다른 HTML 파일 -->
<a href="about.html">소개 페이지</a>

<!-- 상위 폴더의 파일 -->
<a href="../index.html">홈으로</a>

<!-- 페이지 내 특정 위치 (앵커 링크) -->
<a href="#section2">섹션 2로 이동</a>
<h2 id="section2">섹션 2</h2>

<!-- 이메일 링크 -->
<a href="mailto:hong@example.com">이메일 보내기</a>

<!-- 전화 링크 (모바일에서 클릭 시 전화 앱 실행) -->
<a href="tel:010-1234-5678">010-1234-5678</a>
```

### target 속성 - 링크 열기 방식

```html
<!-- 현재 탭에서 열기 (기본값) -->
<a href="https://www.google.com" target="_self">구글 (현재 탭)</a>

<!-- 새 탭에서 열기 -->
<a href="https://www.google.com" target="_blank">구글 (새 탭)</a>
```

### rel 속성 - 링크 관계 명시

```html
<!-- 새 탭에서 열 때 보안상 rel="noopener noreferrer" 추천 -->
<a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
  구글 (안전하게 새 탭에서 열기)
</a>
```

> **보안 주의**: `target="_blank"`를 사용할 때는 반드시 `rel="noopener noreferrer"`를 함께 사용하세요.  
> 이를 생략하면 열린 페이지에서 원래 페이지를 조작하는 보안 취약점이 생길 수 있습니다.

---

## 2. 이미지 태그 (img)

`<img>` 태그는 이미지를 삽입합니다. 닫는 태그가 없는 빈(void) 요소입니다.

### 기본 사용법

```html
<img src="이미지 경로" alt="이미지 설명">
```

### 주요 속성

```html
<!-- src: 이미지 파일 경로 (필수) -->
<!-- alt: 이미지를 설명하는 대체 텍스트 (필수) -->
<img src="photo.jpg" alt="서울 남산타워 사진">

<!-- width, height: 이미지 크기 (픽셀 또는 퍼센트) -->
<img src="logo.png" alt="회사 로고" width="200" height="100">

<!-- 가로만 지정하면 세로는 자동으로 비율에 맞게 조정됨 -->
<img src="banner.jpg" alt="배너 이미지" width="800">
```

### alt 속성이 중요한 이유

```html
<!-- alt는 세 가지 상황에서 중요합니다 -->

<!-- 1. 이미지 로딩 실패 시: alt 텍스트가 대신 표시됩니다 -->
<img src="없는파일.jpg" alt="사진 설명">

<!-- 2. 스크린리더: 시각장애인이 사용하는 도구가 alt 텍스트를 읽어줍니다 -->
<img src="chart.png" alt="2026년 1분기 매출 증가 그래프">

<!-- 3. SEO: 검색 엔진이 이미지의 내용을 alt로 파악합니다 -->

<!-- 순수 장식용 이미지는 alt를 비워두세요 -->
<img src="decoration.png" alt="">
```

---

## 3. 절대경로 vs 상대경로

### 절대경로 (Absolute Path)

```html
<!-- 인터넷 URL (외부 이미지) -->
<img src="https://www.example.com/images/photo.jpg" alt="외부 이미지">

<!-- 서버 루트부터 시작하는 경로 -->
<img src="/images/logo.png" alt="로고">
```

### 상대경로 (Relative Path)

현재 HTML 파일이 있는 위치를 기준으로 경로를 계산합니다.

```
프로젝트/
├── index.html          ← 현재 파일
├── about.html
├── images/
│   ├── logo.png
│   └── banner.jpg
└── pages/
    └── contact.html
```

```html
<!-- index.html에서 images 폴더의 이미지 -->
<img src="images/logo.png" alt="로고">
<img src="images/banner.jpg" alt="배너">

<!-- index.html에서 같은 폴더의 파일 -->
<a href="about.html">소개</a>

<!-- index.html에서 하위 폴더의 파일 -->
<a href="pages/contact.html">연락처</a>

<!-- pages/contact.html에서 상위 폴더의 이미지 -->
<img src="../images/logo.png" alt="로고">
<!-- ../ 는 상위 폴더를 의미합니다 -->
```

---

## 4. figure와 figcaption

이미지와 캡션(설명)을 의미 있게 묶는 태그입니다.

```html
<figure>
  <img src="https://picsum.photos/400/300" alt="랜덤 풍경 사진">
  <figcaption>사진 1: 자연의 아름다운 풍경 (출처: Lorem Picsum)</figcaption>
</figure>
```

```html
<!-- 여러 이미지를 하나의 figure로 묶을 수도 있습니다 -->
<figure>
  <img src="before.jpg" alt="수정 전">
  <img src="after.jpg" alt="수정 후">
  <figcaption>웹사이트 리디자인 전후 비교</figcaption>
</figure>

<!-- 코드도 figure로 묶을 수 있습니다 -->
<figure>
  <pre><code>
    function hello() {
      console.log("Hello!");
    }
  </code></pre>
  <figcaption>예제 1: JavaScript 함수 선언 예시</figcaption>
</figure>
```

---

## 5. 이미지 링크 만들기

`<a>` 태그 안에 `<img>`를 넣으면 클릭할 수 있는 이미지 링크가 됩니다.

```html
<!-- 이미지를 클릭하면 해당 페이지로 이동 -->
<a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
  <img src="google-logo.png" alt="구글 홈페이지로 이동">
</a>
```

---

## 정리

| 태그/속성 | 설명 |
|-----------|------|
| `<a>` | 하이퍼링크 |
| `href` | 이동할 주소 (URL, 파일경로, #id, mailto:, tel:) |
| `target="_blank"` | 새 탭에서 열기 |
| `rel="noopener noreferrer"` | 새 탭 보안 설정 |
| `<img>` | 이미지 삽입 (빈 요소) |
| `src` | 이미지 경로 |
| `alt` | 이미지 대체 텍스트 |
| `width`, `height` | 이미지 크기 |
| `<figure>` | 이미지/미디어 + 캡션 묶음 |
| `<figcaption>` | figure의 설명 |
| 절대경로 | `/` 또는 `https://`로 시작 |
| 상대경로 | 현재 파일 위치 기준 (`./`, `../`) |

---

## 다음 단계

- [예제 파일 보기](./예제/gallery.html) - 포트폴리오 갤러리 예제
- [과제 확인하기](./과제/과제.md) - 즐겨찾기 링크 모음 페이지 만들기
- [다음 강의: 테이블](../강의04_테이블/README.md)
