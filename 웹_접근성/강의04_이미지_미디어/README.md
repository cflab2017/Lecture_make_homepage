# 강의04 — 이미지와 미디어 접근성

## 학습 목표

- alt 텍스트를 상황에 맞게 올바르게 작성할 수 있다
- 비디오에 자막(WebVTT)을 추가할 수 있다
- 색맹을 고려한 배색을 적용할 수 있다
- prefers-reduced-motion으로 움직임 민감 사용자를 배려할 수 있다

---

## 1. alt 텍스트 작성 원칙

### 장식용 이미지: `alt=""`

```html
<!-- 순수 장식 이미지는 alt를 빈 문자열로 →  스크린리더가 완전히 무시 -->
<img src="decoration-wave.svg" alt="">
<img src="spacer.gif" alt="">
```

### 정보 전달 이미지: 구체적인 설명

```html
<!-- 나쁜 예: 파일명이나 "이미지"라고 쓰지 말 것 -->
<img src="chart.png" alt="차트">
<img src="photo.jpg" alt="사진">

<!-- 좋은 예: 이미지가 전달하는 정보를 텍스트로 -->
<img src="sales-chart.png" alt="2024년 1분기 매출: 1월 800만원, 2월 950만원, 3월 1,200만원. 전분기 대비 50% 성장.">
<img src="profile.jpg" alt="김철수, 개발팀 시니어 엔지니어">
```

### 링크 이미지: 목적지 설명

```html
<!-- 나쁜 예: 이미지 설명 -->
<a href="/home"><img src="logo.png" alt="파란색 로고"></a>

<!-- 좋은 예: 링크의 목적지 설명 -->
<a href="/home"><img src="logo.png" alt="메인 페이지로 이동"></a>
```

### 버튼 이미지

```html
<!-- 나쁜 예 -->
<button><img src="close.svg" alt="X"></button>

<!-- 좋은 예: 버튼의 동작 설명 -->
<button><img src="close.svg" alt="닫기"></button>

<!-- 또는 aria-label 활용 -->
<button aria-label="닫기"><img src="close.svg" alt=""></button>
```

### 복잡한 이미지: aria-describedby

```html
<!-- 복잡한 차트나 다이어그램 -->
<figure>
    <img
        src="complex-chart.png"
        alt="월별 판매 추이 차트"
        aria-describedby="chart-desc"
    >
    <figcaption id="chart-desc">
        2024년 1~6월 판매 데이터. 1월 800, 2월 950, 3월 1200, 
        4월 1100, 5월 1350, 6월 1500건. 전반적 상승 추세.
    </figcaption>
</figure>
```

---

## 2. 비디오 자막 (WebVTT)

### `<track>` 태그

```html
<video controls>
    <source src="lecture.mp4" type="video/mp4">
    <!-- kind="captions": 청각 장애인용 (말소리 + 음향 효과 포함) -->
    <!-- kind="subtitles": 외국어 자막 (말소리만) -->
    <track
        kind="captions"
        src="lecture-ko.vtt"
        srclang="ko"
        label="한국어 자막"
        default
    >
</video>
```

### WebVTT 파일 형식 (`.vtt`)

```
WEBVTT

00:00:00.000 --> 00:00:03.500
안녕하세요. 오늘은 웹 접근성에 대해 알아봅니다.

00:00:03.500 --> 00:00:07.000
첫 번째 주제는 이미지 alt 텍스트입니다.

00:00:07.000 --> 00:00:10.500
[화면 전환음]
alt 속성은 이미지를 텍스트로 설명합니다.
```

---

## 3. 색맹을 고려한 배색

약 8%(남성 기준)가 색각 이상을 가지고 있습니다.

### 색맹 유형

| 유형 | 증상 |
|------|------|
| 적록 색맹 (이색형) | 빨강/녹색 구분 어려움 (가장 흔함) |
| 청황 색맹 | 파랑/노랑 구분 어려움 |
| 전색맹 | 색상 전혀 구분 불가 |

### 색만으로 정보 전달 금지

```html
<!-- 나쁜 예: 색상만으로 에러/성공 구분 -->
<p style="color: red">오류가 발생했습니다.</p>
<p style="color: green">성공했습니다.</p>

<!-- 좋은 예: 색상 + 아이콘 + 텍스트 -->
<p class="error">
    <span aria-hidden="true">✗</span>
    오류가 발생했습니다.
</p>
<p class="success">
    <span aria-hidden="true">✓</span>
    성공했습니다.
</p>
```

### Color Oracle 도구 사용

1. [colororacle.org](https://colororacle.org) 에서 설치
2. 실행 후 색맹 유형 선택
3. 화면 전체를 색맹 시뮬레이션으로 볼 수 있음

---

## 4. prefers-reduced-motion

전정기관 장애, 간질 등으로 움직임에 민감한 사용자가 있습니다.

```css
/* 기본: 애니메이션 있음 */
.spinner {
    animation: spin 1s linear infinite;
}

.slide {
    transition: transform 0.3s ease;
}

/* 움직임 감소 선호 시: 애니메이션 제거 또는 최소화 */
@media (prefers-reduced-motion: reduce) {
    .spinner {
        animation: none; /* 회전 제거 */
    }

    .slide {
        transition: none; /* 슬라이드 대신 즉시 변경 */
    }

    /* 자동 재생 영상 멈춤 */
    video[autoplay] {
        animation: none;
    }
}
```

### JavaScript에서 확인

```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    // 애니메이션 실행
    element.classList.add('animate');
}
```

---

## 예제 파일

- `예제/accessible-gallery.html` — 접근성 개선된 이미지 갤러리

---

## 과제

강의04 과제를 통해 전체 포트폴리오 접근성을 점검해봅니다.
