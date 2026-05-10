# 강의 05 — Flexbox

Flexbox는 **1차원 레이아웃** (가로 또는 세로 한 방향)을 쉽게 만드는 CSS 기술입니다.  
네비게이션, 카드 목록, 중앙 정렬 등 대부분의 UI 레이아웃에 활용됩니다.

---

## 1. Flexbox 기본 개념

```css
.container {
  display: flex; /* 자식 요소들이 flex item이 됨 */
}
```

- **Flex Container**: `display: flex`가 적용된 부모 요소
- **Flex Item**: Flex Container의 직계 자식 요소들

```
[Container]
  ┌─────────────────────────────────────────┐
  │  [Item 1]  [Item 2]  [Item 3]          │
  └─────────────────────────────────────────┘
        → 주축 (Main Axis, 기본: 가로)
```

---

## 2. 방향 (flex-direction)

```css
.container {
  flex-direction: row;            /* 기본값: 가로 (왼 → 오) */
  flex-direction: row-reverse;    /* 가로 역방향 (오 → 왼) */
  flex-direction: column;         /* 세로 (위 → 아래) */
  flex-direction: column-reverse; /* 세로 역방향 (아래 → 위) */
}
```

---

## 3. 주축 정렬 (justify-content)

주축(Main Axis) 방향으로 아이템들을 정렬합니다.

```css
.container {
  justify-content: flex-start;    /* 기본값: 시작점 정렬 */
  justify-content: flex-end;      /* 끝점 정렬 */
  justify-content: center;        /* 가운데 정렬 */
  justify-content: space-between; /* 첫/끝 고정, 나머지 균등 */
  justify-content: space-around;  /* 각 아이템 양쪽 균등 */
  justify-content: space-evenly;  /* 모든 간격 동일 */
}
```

---

## 4. 교차축 정렬 (align-items)

교차축(Cross Axis) 방향으로 아이템들을 정렬합니다.

```css
.container {
  align-items: stretch;     /* 기본값: 교차축 방향 꽉 채움 */
  align-items: flex-start;  /* 시작점 정렬 */
  align-items: flex-end;    /* 끝점 정렬 */
  align-items: center;      /* 중앙 정렬 (수직 중앙 정렬에 자주 사용) */
  align-items: baseline;    /* 텍스트 기준선 정렬 */
}
```

---

## 5. 줄 바꿈 (flex-wrap)

```css
.container {
  flex-wrap: nowrap;   /* 기본값: 줄바꿈 없음 (삐져나올 수 있음) */
  flex-wrap: wrap;     /* 넘치면 다음 줄로 */
  flex-wrap: wrap-reverse; /* 다음 줄이 위로 */
}
```

---

## 6. 간격 (gap)

```css
.container {
  gap: 16px;          /* 행과 열 간격 동일 */
  gap: 20px 10px;     /* 행 간격 20px, 열 간격 10px */
  row-gap: 20px;      /* 행 간격만 */
  column-gap: 10px;   /* 열 간격만 */
}
```

---

## 7. Flex Item 속성

### flex-grow / flex-shrink / flex-basis

```css
.item {
  flex-grow: 1;    /* 남은 공간을 차지하는 비율 (기본: 0) */
  flex-shrink: 1;  /* 공간이 부족할 때 줄어드는 비율 (기본: 1) */
  flex-basis: auto; /* 기본 크기 (기본: auto) */

  /* 단축 속성 */
  flex: 1;         /* flex-grow: 1, flex-shrink: 1, flex-basis: 0 */
  flex: 0 0 200px; /* 고정 크기 200px (늘지도 줄지도 않음) */
}
```

### order

```css
.item-1 { order: 2; } /* 두 번째로 표시 */
.item-2 { order: 1; } /* 첫 번째로 표시 */
.item-3 { order: 3; } /* 세 번째로 표시 */
```

### align-self

```css
.item {
  align-self: center;     /* 이 아이템만 교차축 중앙 */
  align-self: flex-end;   /* 이 아이템만 교차축 끝 */
}
```

---

## 8. 자주 쓰는 패턴

### 완전 중앙 정렬

```css
.center {
  display: flex;
  justify-content: center; /* 가로 중앙 */
  align-items: center;     /* 세로 중앙 */
  height: 100vh;
}
```

### 네비게이션 바

```css
.navbar {
  display: flex;
  justify-content: space-between; /* 로고 왼쪽, 메뉴 오른쪽 */
  align-items: center;
  padding: 0 20px;
}
```

---

## 예제 파일

`예제/` 폴더의 `flexbox.html`을 열어 네비게이션 바, 카드 3열 배치, 세로 중앙 정렬을 확인하세요.

## 과제

`과제/과제.md`를 읽고 **반응형 카드 목록**을 만들어 보세요.
