# 강의 06 — CSS Grid

CSS Grid는 **2차원 레이아웃**(가로와 세로 동시)을 만드는 강력한 CSS 기술입니다.  
잡지 레이아웃, 대시보드, 복잡한 페이지 구조를 만들 때 Flexbox보다 적합합니다.

---

## 1. Grid 기본 설정

```css
.container {
  display: grid;

  /* 열(column) 정의 */
  grid-template-columns: 200px 1fr 1fr; /* 고정 200px + 균등 2열 */
  grid-template-columns: repeat(3, 1fr); /* 3열 균등 */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* 반응형 */

  /* 행(row) 정의 */
  grid-template-rows: auto 1fr auto; /* 위/중간/아래 */
  grid-template-rows: 80px 1fr 60px;

  /* 간격 */
  gap: 20px;
  row-gap: 16px;
  column-gap: 24px;
}
```

---

## 2. fr 단위

`fr`은 **남은 공간의 비율**을 나타냅니다.

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  /* 전체를 4등분: 첫 열 1/4, 둘째 열 2/4(절반), 셋째 열 1/4 */
}
```

---

## 3. 아이템 배치 (grid-column, grid-row)

```css
/* 아이템이 몇 번째 라인에서 시작/끝날지 지정 */
.item {
  grid-column: 1 / 3;    /* 1번 라인에서 시작, 3번 라인에서 끝 (2열 차지) */
  grid-column: 1 / -1;   /* 첫 라인 ~ 마지막 라인 (전체 너비) */
  grid-column: span 2;   /* 2열 차지 (현재 위치에서) */

  grid-row: 1 / 3;       /* 2행 차지 */
  grid-row: span 2;
}
```

---

## 4. grid-template-areas

이름으로 레이아웃을 시각적으로 정의합니다.

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

---

## 5. auto-fill vs auto-fit

```css
/* auto-fill: 가능한 한 많은 열을 만듦, 빈 열이 생길 수 있음 */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

/* auto-fit: 아이템에 맞게 열을 채움, 빈 열은 0으로 */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```

---

## 6. 정렬

```css
.container {
  justify-items: start | center | end | stretch;   /* 셀 안에서 가로 정렬 */
  align-items: start | center | end | stretch;     /* 셀 안에서 세로 정렬 */
  justify-content: start | center | space-between; /* 그리드 전체 가로 정렬 */
  align-content: start | center | space-between;   /* 그리드 전체 세로 정렬 */
}

.item {
  justify-self: center;  /* 이 아이템만 가로 중앙 */
  align-self: end;       /* 이 아이템만 세로 끝 */
}
```

---

## 7. Flexbox vs Grid — 선택 기준

| 상황 | 권장 |
|------|------|
| 한 방향(가로 또는 세로)만 정렬 | Flexbox |
| 두 방향 동시 제어 필요 | Grid |
| 아이템 크기가 불규칙 | Flexbox |
| 정해진 행/열 레이아웃 | Grid |
| 네비게이션, 버튼 그룹 | Flexbox |
| 페이지 전체 레이아웃, 대시보드 | Grid |

> 실무에서는 Grid로 전체 레이아웃을 잡고, 내부 컴포넌트는 Flexbox로 구현하는 패턴이 많습니다.

---

## 예제 파일

`예제/` 폴더의 `grid-layout.html`을 열어 잡지 레이아웃을 확인하세요.

## 과제

`과제/과제.md`를 읽고 **대시보드 레이아웃**을 만들어 보세요.
