# 강의 04 — 배경 & 테두리

요소의 배경, 테두리, 그림자, 그리고 기본 전환 효과를 학습합니다.  
이 강의에서 다루는 속성들은 버튼, 카드, 배너 등 UI 컴포넌트에 필수적입니다.

---

## 1. 배경 (Background)

### 배경색

```css
.box {
  background-color: #3498db;
  background-color: rgba(52, 152, 219, 0.5); /* 반투명 */
}
```

### 배경 이미지

```css
.hero {
  background-image: url('image.jpg');
  background-size: cover;      /* 요소를 꽉 채움 (잘릴 수 있음) */
  background-size: contain;    /* 이미지 전체가 보임 (여백 생길 수 있음) */
  background-position: center; /* 중앙 기준 */
  background-position: top right; /* 오른쪽 위 기준 */
  background-repeat: no-repeat; /* 반복 없음 */
  background-repeat: repeat;    /* 반복 (기본값) */
}
```

### 그라데이션 배경

```css
.gradient {
  /* 선형 그라데이션 */
  background: linear-gradient(to right, #667eea, #764ba2);
  background: linear-gradient(135deg, #f093fb, #f5576c);

  /* 방사형 그라데이션 */
  background: radial-gradient(circle, #f093fb, #f5576c);
}
```

### 배경 단축 속성

```css
.hero {
  background: url('image.jpg') center/cover no-repeat;
  /* url  position/size  repeat */
}
```

---

## 2. 테두리 (Border)

```css
.box {
  border: 2px solid #333;          /* 두께 스타일 색상 */
  border-style: solid;             /* solid, dashed, dotted, double */
  border-width: 1px 2px 1px 2px;  /* 상 우 하 좌 */
  border-color: #3498db;
  border-top: 3px dashed red;      /* 방향별 설정 */

  border-radius: 8px;              /* 네 모서리 동일 */
  border-radius: 50%;              /* 원 만들기 (width == height일 때) */
  border-radius: 10px 0 10px 0;   /* 모서리별 다르게 */
}
```

---

## 3. 그림자 (Box Shadow)

```css
.card {
  /* offset-x | offset-y | blur | color */
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);

  /* offset-x | offset-y | blur | spread | color */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

  /* 안쪽 그림자 */
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.15);

  /* 여러 그림자 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1);
}
```

---

## 4. outline

`border`와 달리 요소의 크기에 영향을 주지 않습니다.  
주로 접근성(포커스 표시)에 활용됩니다.

```css
button:focus {
  outline: 3px solid #3498db;
  outline-offset: 2px; /* outline과 요소 사이 간격 */
}

/* 포커스 링 제거 (접근성에 주의) */
button:focus {
  outline: none;
}
```

---

## 5. opacity & cursor

```css
.dim {
  opacity: 0.5;         /* 0(완전 투명) ~ 1(완전 불투명) */
}

.clickable {
  cursor: pointer;      /* 손 모양 커서 */
  cursor: not-allowed;  /* 금지 모양 */
  cursor: crosshair;    /* 십자 모양 */
}
```

---

## 6. transition (전환 효과)

`transition`은 CSS 속성이 변할 때 부드럽게 애니메이션되도록 합니다.

```css
.button {
  background-color: #3498db;
  /* property | duration | timing-function | delay */
  transition: background-color 0.3s ease;
  transition: all 0.3s ease;        /* 모든 속성에 적용 */
  transition: transform 0.2s ease-out, box-shadow 0.2s ease;
}

.button:hover {
  background-color: #2980b9; /* 0.3초 동안 부드럽게 변함 */
}
```

**timing-function 종류:**
- `ease` — 천천히 시작, 빠르게, 천천히 끝 (기본값)
- `linear` — 일정한 속도
- `ease-in` — 천천히 시작
- `ease-out` — 천천히 끝
- `ease-in-out` — 천천히 시작, 천천히 끝

---

## 예제 파일

`예제/` 폴더의 `button-styles.html`을 열어 다양한 버튼 스타일을 확인하세요.

## 과제

`과제/과제.md`를 읽고 **이미지 카드 갤러리**를 만들어 보세요.
