# 접근성 감사 보고서 — 예시 답안

## 점검한 페이지

- 파일명: `index.html` (간단한 쇼핑몰 페이지)
- Lighthouse 접근성 점수: **62점** (주황)

---

## 발견한 문제점

### 문제 1: 이미지 alt 텍스트 누락

**Lighthouse 항목:** `Image elements do not have [alt] attributes`

**발견 위치:** 상품 이미지 태그

**문제 설명:**
`alt` 속성이 없는 이미지는 스크린리더가 파일명을 그대로 읽습니다.  
예: "product_img_001.jpg" — 사용자는 이미지가 무엇인지 알 수 없음.

**현재 코드:**
```html
<img src="product_img_001.jpg">
```

**해결 방법:**
```html
<!-- 정보를 전달하는 이미지: 구체적인 alt 텍스트 작성 -->
<img src="product_img_001.jpg" alt="파란색 무선 마우스, 로지텍 MX Master 3">

<!-- 장식용 이미지: alt="" (빈 문자열) → 스크린리더가 무시 -->
<img src="decoration.png" alt="">
```

---

### 문제 2: 폼 입력 필드에 레이블 없음

**Lighthouse 항목:** `Form elements do not have associated labels`

**발견 위치:** 검색 폼

**문제 설명:**
`<input>`에 `<label>`이 연결되어 있지 않으면 스크린리더가 "편집 텍스트"라고만 읽습니다.  
사용자는 이 입력 필드가 무엇을 위한 것인지 알 수 없습니다.

**현재 코드:**
```html
<input type="text" placeholder="검색어를 입력하세요">
<button>검색</button>
```

**해결 방법:**
```html
<!-- 방법 1: label 태그로 연결 (for-id 매칭) -->
<label for="search-input">상품 검색</label>
<input type="text" id="search-input" placeholder="검색어를 입력하세요">

<!-- 방법 2: aria-label (레이블 텍스트를 화면에 표시하지 않을 때) -->
<input type="text" aria-label="상품 검색" placeholder="검색어를 입력하세요">

<!-- 방법 3: 시각적으로 숨기되 스크린리더에는 읽히게 -->
<label for="search-input" class="sr-only">상품 검색</label>
<input type="text" id="search-input">
```

```css
/* 시각적으로 숨기는 클래스 */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

---

### 문제 3: 색상 대비 부족

**Lighthouse 항목:** `Background and foreground colors do not have a sufficient contrast ratio`

**발견 위치:** 상품 가격 텍스트 (연한 회색 텍스트)

**문제 설명:**
저시력자나 밝은 환경에서 화면을 볼 때 텍스트와 배경의 대비가 충분하지 않으면 읽기 어렵습니다.  
WCAG 기준: 일반 텍스트 최소 **4.5:1**, 큰 텍스트 최소 **3:1**

**현재 코드:**
```css
/* 대비율 2.3:1 → 기준 미달 */
.price {
    color: #aaaaaa;      /* 연한 회색 텍스트 */
    background: #ffffff; /* 흰 배경 */
}
```

**해결 방법:**
```css
/* 대비율 7:1 → 기준 충족 */
.price {
    color: #595959;      /* 진한 회색 텍스트 (대비율 7:1) */
    background: #ffffff;
}

/* 대비율 확인 도구:
   https://webaim.org/resources/contrastchecker/
   Chrome DevTools → Elements → 색상 클릭 → 대비율 표시
*/
```

---

## 총평

62점에서 출발했지만 위 3가지 문제를 수정하면 약 **85~90점**까지 향상될 것으로 예상됩니다.

**우선 수정 순서:**
1. 이미지 alt 텍스트 — 가장 빠르고 효과가 큼
2. 폼 레이블 — 실제 사용성에 직결
3. 색상 대비 — CSS 수정으로 간단히 해결

접근성 개선은 장애인뿐 아니라 SEO, 모바일 환경, 저사양 기기 사용자 모두에게 이득이 됩니다.
