# 접근성 점검 체크리스트 — 예시 답안

## 이미지 점검

### [x] 모든 `<img>`에 alt 속성 있는지

**점검 방법:** Lighthouse → "Image elements do not have [alt] attributes"

**발견 문제:**
```html
<!-- 수정 전: alt 없음 -->
<img src="product.jpg">
```

**해결 코드:**
```html
<!-- 수정 후: 구체적인 alt 텍스트 -->
<img src="product.jpg" alt="파란색 무선 마우스, 로지텍 MX Master 3">
```

---

### [x] 장식용 이미지는 alt="" 처리했는지

**점검 방법:** 이미지가 순수 장식인지 정보 전달인지 판단

**해결 코드:**
```html
<!-- 배경 장식 이미지: 스크린리더가 완전히 건너뜀 -->
<img src="wave-decoration.svg" alt="">
<img src="divider.png" alt="">

<!-- CSS로 처리하면 더 좋음 -->
<div class="wave-bg" aria-hidden="true"></div>
```

---

### [x] 정보 전달 이미지의 alt가 충분히 구체적인지

**나쁜 예:**
```html
<img src="chart.png" alt="그래프">
<img src="team.jpg" alt="사진">
```

**해결 코드:**
```html
<!-- 차트: 주요 수치와 추세를 텍스트로 -->
<figure>
    <img
        src="chart.png"
        alt="2024년 분기별 매출 차트"
        aria-describedby="chart-detail"
    >
    <figcaption id="chart-detail">
        1분기 800만원, 2분기 1,200만원, 3분기 1,500만원, 4분기 1,800만원.
        연간 전체 5,300만원으로 전년 대비 35% 성장.
    </figcaption>
</figure>

<!-- 팀 사진 -->
<img src="team.jpg" alt="개발팀 6명이 사무실에서 미소 짓고 있는 단체 사진">
```

---

### [x] 링크/버튼 이미지의 alt가 목적지/동작을 설명하는지

**나쁜 예:**
```html
<a href="/"><img src="logo.png" alt="로고 이미지"></a>
<button><img src="close.svg" alt="x"></button>
```

**해결 코드:**
```html
<!-- 링크 이미지: 이동 목적지 설명 -->
<a href="/"><img src="logo.png" alt="홈페이지로 이동"></a>

<!-- 버튼 이미지: 버튼의 동작 설명 -->
<button aria-label="모달 닫기">
    <img src="close.svg" alt="">  <!-- 버튼에 aria-label이 있으면 이미지는 alt="" -->
</button>
```

---

## 폼 점검

### [x] 모든 입력 필드에 label 또는 aria-label 있는지

**나쁜 예:**
```html
<input type="text" placeholder="이름">
```

**해결 코드:**
```html
<!-- 방법 1: label for/id 연결 -->
<label for="name">이름 <span aria-hidden="true">*</span></label>
<input type="text" id="name" required aria-required="true">

<!-- 방법 2: aria-label (레이블을 화면에 표시하지 않을 때) -->
<input type="search" aria-label="상품 검색" placeholder="검색어를 입력하세요">
```

---

### [x] 에러 메시지에 role="alert" 있는지

**나쁜 예:**
```html
<span class="error" id="error">필수 항목입니다.</span>
```

**해결 코드:**
```html
<!-- role="alert": 내용이 변경되면 스크린리더가 즉시 읽음 -->
<p id="name-error" role="alert" hidden>
    이름을 입력해주세요.
</p>

<!-- JavaScript에서 hidden 제거하여 활성화 -->
<script>
document.getElementById('name-error').removeAttribute('hidden');
// 스크린리더가 자동으로 "이름을 입력해주세요" 를 읽음
</script>
```

---

### [x] 에러 메시지와 입력 필드가 aria-describedby로 연결됐는지

**해결 코드:**
```html
<input
    type="email"
    id="email"
    aria-describedby="email-hint email-error"
    aria-invalid="true"
>
<p id="email-hint">예: user@example.com</p>
<p id="email-error" role="alert">올바른 이메일 형식을 입력해주세요.</p>
<!-- 스크린리더: "이메일 편집, 예: user@example.com, 올바른 이메일 형식을 입력해주세요" -->
```

---

### [x] 필수 필드에 aria-required="true" 있는지

**해결 코드:**
```html
<!-- HTML required + ARIA required 모두 사용 -->
<input
    type="text"
    required
    aria-required="true"
>
<!-- 스크린리더: "편집, 필수" -->

<!-- 레이블에 시각적 표시도 제공 (색상만으로 표시 금지) -->
<label for="email">
    이메일
    <span aria-hidden="true"> *</span> <!-- * 표시는 스크린리더 제외 -->
</label>
```

---

## 색상 대비 점검

### [x] 본문 텍스트 대비율 4.5:1 이상

**점검 도구:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

| 수정 전 | 수정 후 |
|---------|---------|
| `color: #aaa` (대비 2.3:1 — 미달) | `color: #595959` (대비 7:1 — 충족) |
| `color: #999` (대비 2.8:1 — 미달) | `color: #767676` (대비 4.5:1 — 충족) |

```css
/* 수정 후 */
body { color: #1a1a1a; }        /* 대비율 16:1 */
p    { color: #333333; }        /* 대비율 12:1 */
.secondary { color: #595959; }  /* 대비율 7:1  */
```

---

### [x] 버튼과 입력창 테두리 대비율 3:1 이상

```css
/* 수정 전: 대비 1.6:1 — 미달 */
input { border: 1px solid #dddddd; }

/* 수정 후: 대비 3.1:1 — 충족 */
input { border: 2px solid #949494; }

/* 버튼 배경: blue(#0000ff) 위의 흰 글씨 = 8.6:1 — 충족 */
button { background: #0055aa; color: white; }
```

---

### [x] 색상만으로 정보를 전달하는 곳은 없는지

**나쁜 예:**
```html
<!-- 빨강 = 오류, 초록 = 성공 — 색맹 사용자는 구분 불가 -->
<p style="color: red">오류가 발생했습니다.</p>
<p style="color: green">성공했습니다.</p>
```

**해결 코드:**
```html
<!-- 색상 + 아이콘 + 텍스트 조합 -->
<p class="error">
    <span aria-hidden="true">✗ </span>오류가 발생했습니다.
</p>
<p class="success">
    <span aria-hidden="true">✓ </span>성공했습니다.
</p>

<!-- 그래프에서 색상으로만 구분 금지: 패턴이나 레이블 추가 -->
```

---

### [x] Color Oracle로 색맹 시뮬레이션 테스트

1. Color Oracle(colororacle.org) 설치
2. 적록 색맹(Deuteranopia) 모드 적용
3. 빨강/녹색 요소가 여전히 구별 가능한지 확인
4. 색상 차이에만 의존한 부분 → 패턴, 아이콘, 텍스트 추가

---

## 키보드 탐색 점검

### [x] Tab으로 모든 인터랙티브 요소 접근 가능한지

**테스트 방법:**
1. 마우스를 사용하지 않고 Tab 키만으로 페이지 탐색
2. 모든 링크, 버튼, 입력 필드에 도달하는지 확인

**발견 문제:**
```html
<!-- div로 만든 버튼: Tab으로 접근 불가 -->
<div class="btn" onclick="doSomething()">클릭</div>
```

**해결 코드:**
```html
<!-- button 또는 a 태그 사용 -->
<button onclick="doSomething()">클릭</button>

<!-- 부득이 div를 써야 한다면 tabindex="0" + role + 키보드 핸들러 추가 -->
<div
    role="button"
    tabindex="0"
    onclick="doSomething()"
    onkeydown="if(e.key==='Enter'||e.key===' ') doSomething()"
>
    클릭
</div>
```

---

### [x] 포커스 표시(outline)가 명확한지

**나쁜 예:**
```css
/* 절대 금지! */
:focus { outline: none; }
* { outline: 0; }
```

**해결 코드:**
```css
/* 방법 1: 기본 outline 강화 */
:focus-visible {
    outline: 3px solid #0066cc;
    outline-offset: 2px;
    border-radius: 2px;
}

/* 방법 2: 마우스 클릭엔 숨기고 키보드에만 표시 */
:focus         { outline: none; }
:focus-visible { outline: 3px solid #0066cc; }
```

---

### [x] 모달/드롭다운이 Escape로 닫히는지

**해결 코드:**
```js
// 모달이 열려있을 때 Escape 키 처리
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
        closeModal();
        triggerButton.focus(); // 열었던 버튼으로 포커스 복귀
    }
});
```

---

### [x] Skip Navigation 링크가 있는지

**해결 코드:**
```html
<!-- <body> 최상단에 위치 -->
<a href="#main-content" class="skip-link">본문 바로가기</a>

<nav>... (긴 내비게이션) ...</nav>

<main id="main-content" tabindex="-1">
    <h1>페이지 제목</h1>
</main>
```

```css
.skip-link {
    position: absolute;
    top: -100%;
    left: 0;
    padding: 10px 20px;
    background: #000;
    color: #fff;
    text-decoration: none;
    z-index: 9999;
}
.skip-link:focus { top: 0; }
```

---

## 종합 결과

| 영역 | 통과 | 미통과 |
|------|------|--------|
| 이미지 | 4/4 | 0/4 |
| 폼 | 4/4 | 0/4 |
| 색상 대비 | 4/4 | 0/4 |
| 키보드 | 4/4 | 0/4 |
| **합계** | **16/16** | **0/16** |

**개선 전 Lighthouse 점수:** 62점  
**개선 후 Lighthouse 점수:** 97점
