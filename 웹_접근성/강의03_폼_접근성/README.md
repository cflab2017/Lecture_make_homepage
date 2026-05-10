# 강의03 — 폼 접근성

## 학습 목표

- label과 input을 올바르게 연결할 수 있다
- 에러 메시지를 접근성 있게 구현할 수 있다
- ARIA 속성으로 폼 상태를 전달할 수 있다
- 색상 대비와 포커스 스타일의 중요성을 이해한다

---

## 1. label과 input 연결

스크린리더는 `<input>`에 포커스가 이동하면 연결된 `<label>`을 읽습니다.

### 방법 1: for/id 연결 (권장)

```html
<label for="username">사용자 이름</label>
<input type="text" id="username" name="username">
```

### 방법 2: 감싸기 (암묵적 연결)

```html
<label>
    사용자 이름
    <input type="text" name="username">
</label>
```

### 방법 3: aria-label (레이블 텍스트를 화면에 표시하지 않을 때)

```html
<!-- 플레이스홀더만 있는 검색창 -->
<input type="search" aria-label="검색어 입력" placeholder="검색어를 입력하세요">
```

> **주의:** `placeholder`는 레이블 대체품이 아닙니다!  
> 사용자가 입력을 시작하면 사라지며, 대비가 낮아 저시력자에게 읽기 어렵습니다.

---

## 2. 에러 메시지 접근성

### role="alert" — 즉각적인 알림

```html
<!-- 에러 발생 시 동적으로 추가 →  스크린리더가 즉시 읽음 -->
<div role="alert">
    이메일 형식이 올바르지 않습니다. (예: user@example.com)
</div>
```

### aria-describedby — 에러를 입력 필드와 연결

```html
<label for="email">이메일</label>
<input
    type="email"
    id="email"
    aria-describedby="email-error"  <!-- 에러 메시지 요소와 연결 -->
    aria-invalid="true"              <!-- 현재 값이 유효하지 않음 -->
    required
>
<!-- 스크린리더가 "이메일 편집, 필수, 이메일 형식이 올바르지 않습니다" 라고 읽음 -->
<p id="email-error" role="alert">
    이메일 형식이 올바르지 않습니다. (예: user@example.com)
</p>
```

---

## 3. ARIA 폼 속성

### aria-required

```html
<!-- HTML의 required와 함께 사용 -->
<input
    type="text"
    required
    aria-required="true"
>
<!-- 스크린리더: "편집, 필수" -->
```

### aria-invalid

```html
<!-- 유효성 검사 통과 전 -->
<input aria-invalid="false">

<!-- 에러 발생 시 -->
<input aria-invalid="true" aria-describedby="error-msg">
<span id="error-msg">필수 입력 항목입니다.</span>
```

### aria-describedby — 도움말 텍스트 연결

```html
<label for="pw">비밀번호</label>
<input
    type="password"
    id="pw"
    aria-describedby="pw-hint pw-error"  <!-- 여러 요소 연결 가능 (공백 구분) -->
>
<p id="pw-hint">8자 이상, 대소문자 + 숫자 + 특수문자 포함</p>
<p id="pw-error" role="alert" hidden>비밀번호가 조건을 충족하지 않습니다.</p>
```

---

## 4. 색상만으로 정보 전달 금지

```html
<!-- 나쁜 예: 색상만으로 에러 표시 (색맹 사용자는 알 수 없음) -->
<input style="border-color: red">

<!-- 좋은 예: 색상 + 아이콘 + 텍스트 메시지 조합 -->
<div class="field-error">
    <input aria-invalid="true" aria-describedby="email-error">
    <span class="error-icon" aria-hidden="true">⚠</span>
    <p id="email-error" role="alert">
        이메일 형식이 올바르지 않습니다.
    </p>
</div>
```

---

## 5. 색상 대비 (Contrast Ratio)

WCAG AA 기준:
- **일반 텍스트:** 최소 **4.5:1**
- **큰 텍스트(18pt 이상):** 최소 **3:1**
- **UI 요소(입력 테두리, 아이콘):** 최소 **3:1**

```css
/* 나쁜 예: 대비율 2.3:1 */
input { border: 1px solid #cccccc; }  /* 회색 테두리, 배경이 흰색 */
label { color: #aaaaaa; }

/* 좋은 예: 대비율 4.5:1 이상 */
input { border: 2px solid #767676; }  /* 대비율 4.5:1 */
label { color: #1a1a1a; }             /* 검정에 가까운 색 */
```

대비율 확인: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## 6. 포커스 스타일 (절대 제거 금지!)

```css
/* 절대 하지 말 것! 키보드 사용자가 현재 위치를 알 수 없음 */
:focus { outline: none; }
*:focus { outline: 0; }

/* 올바른 방법 1: 기본 outline 개선 */
:focus-visible {
    outline: 3px solid #0066cc;
    outline-offset: 2px;
    border-radius: 2px;
}

/* 올바른 방법 2: 마우스 클릭 시엔 숨기고, 키보드 사용 시에만 표시 */
:focus { outline: none; }
:focus-visible { outline: 3px solid #0066cc; }
```

---

## 예제 파일

- `예제/accessible-form.html` — 완전한 접근성 회원가입 폼

---

## 다음 강의

강의04에서는 이미지, 비디오, 애니메이션의 접근성을 개선하는 방법을 배웁니다.
