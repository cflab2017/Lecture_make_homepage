# 강의 03 — 박스 모델

CSS에서 모든 요소는 **박스(Box)** 형태로 렌더링됩니다.  
박스 모델의 4단계 구조를 이해하면 레이아웃 문제를 정확하게 해결할 수 있습니다.

---

## 1. 박스 모델의 4단계

```
┌─────────────────────────────────┐
│           margin (바깥 여백)     │
│  ┌───────────────────────────┐  │
│  │      border (테두리)       │  │
│  │  ┌─────────────────────┐  │  │
│  │  │   padding (안쪽 여백) │  │  │
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │  content (내용) │  │  │  │
│  │  │  └───────────────┘  │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

| 영역 | 설명 |
|------|------|
| **content** | 실제 내용(텍스트, 이미지)이 들어가는 영역 |
| **padding** | content와 border 사이의 내부 여백 |
| **border** | 요소를 감싸는 테두리 |
| **margin** | 요소 바깥의 다른 요소와의 여백 |

```css
div {
  /* 내용 */
  width: 200px;
  height: 100px;

  /* 안쪽 여백 (상 우 하 좌 순서) */
  padding: 10px 20px 10px 20px;
  padding: 10px 20px;      /* 상하 10px, 좌우 20px */
  padding: 10px;           /* 네 방향 모두 10px */
  padding-top: 10px;       /* 방향별 개별 설정 */

  /* 테두리 */
  border: 2px solid #333;  /* 두께 스타일 색상 */
  border-radius: 8px;      /* 모서리 둥글게 */

  /* 바깥 여백 */
  margin: 20px auto;       /* 상하 20px, 좌우 auto(중앙 정렬) */
}
```

---

## 2. box-sizing: border-box

기본적으로 `width`는 **content 영역만**의 크기입니다.  
padding과 border를 추가하면 실제 요소가 더 커집니다.

```css
/* 기본값: width = content만 */
/* 실제 크기 = 200 + 40(padding) + 4(border) = 244px */
.default {
  width: 200px;
  padding: 20px;
  border: 2px solid black;
  box-sizing: content-box; /* 기본값 */
}

/* border-box: width = content + padding + border */
/* 실제 크기 = 항상 200px */
.better {
  width: 200px;
  padding: 20px;
  border: 2px solid black;
  box-sizing: border-box;  /* 권장 */
}
```

> 실무에서는 `* { box-sizing: border-box; }`로 전체 적용합니다.

---

## 3. width, height, max-width

```css
.container {
  width: 100%;             /* 부모의 100% 너비 */
  max-width: 1200px;       /* 최대 너비 제한 (반응형 필수) */
  height: auto;            /* 내용에 따라 자동 */
  min-height: 100vh;       /* 최소 높이: 뷰포트 높이 */
}
```

---

## 4. overflow

내용이 요소보다 클 때 처리 방법을 지정합니다.

```css
.box {
  overflow: visible; /* 기본: 밖으로 튀어나옴 */
  overflow: hidden;  /* 잘라냄 (이미지 자르기에 활용) */
  overflow: scroll;  /* 항상 스크롤바 표시 */
  overflow: auto;    /* 필요할 때만 스크롤바 표시 (권장) */
}
```

---

## 5. display 속성

```css
/* 블록 요소: 줄을 독차지, width/height 설정 가능 */
display: block;         /* div, p, h1~h6, section 기본값 */

/* 인라인 요소: 텍스트처럼 흐름, width/height 설정 불가 */
display: inline;        /* span, a, strong 기본값 */

/* 인라인 블록: 텍스트처럼 흐르지만 width/height 설정 가능 */
display: inline-block;  /* img, button 기본값 */

/* 숨김 */
display: none;          /* 화면에서 완전히 제거 */
```

---

## 6. margin 겹침 현상 (Margin Collapse)

**세로 방향** 인접한 두 요소의 margin은 더해지지 않고, **더 큰 쪽만** 적용됩니다.

```css
.first  { margin-bottom: 30px; }
.second { margin-top: 20px; }
/* 실제 간격: 30px (30 + 20 = 50px 이 아님!) */
```

**해결 방법:**
- `padding`으로 대체
- 부모에 `overflow: hidden` 또는 `padding: 1px` 적용
- Flexbox/Grid 사용 (겹침 현상 없음)

---

## 예제 파일

`예제/` 폴더의 `box-model.html`을 열어 각 영역이 색상으로 구분된 시각화 데모를 확인하세요.

## 과제

`과제/과제.md`를 읽고 **카드 컴포넌트**를 만들어 보세요.
