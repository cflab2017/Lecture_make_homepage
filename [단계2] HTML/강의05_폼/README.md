# 강의 05 - 폼 (Form)

> 사용자로부터 데이터를 입력받는 폼(입력 양식)을 만드는 방법을 배웁니다.

---

## 1. 폼(Form)이란?

HTML 폼은 **사용자가 데이터를 입력하고 서버로 전송**하는 인터페이스입니다.  
회원가입, 로그인, 검색, 설문조사 등 거의 모든 웹 서비스에서 사용됩니다.

---

## 2. form 태그

```html
<form action="처리할 URL" method="get 또는 post">
  <!-- 입력 요소들 -->
</form>
```

### 주요 속성

| 속성 | 설명 | 값 |
|------|------|-----|
| `action` | 폼 데이터를 전송할 서버 URL | URL 주소 |
| `method` | 데이터 전송 방식 | `get` 또는 `post` |

```html
<!-- GET: URL에 데이터가 노출됨. 검색 등에 사용 -->
<form action="/search" method="get">
  <input type="text" name="query">
  <button type="submit">검색</button>
</form>
<!-- 제출 시 URL: /search?query=입력값 -->

<!-- POST: URL에 데이터가 노출되지 않음. 회원가입, 로그인 등에 사용 -->
<form action="/login" method="post">
  <input type="email" name="email">
  <input type="password" name="password">
  <button type="submit">로그인</button>
</form>
```

---

## 3. input 태그 - 다양한 type

`<input>` 은 빈(void) 요소로 닫는 태그가 없습니다.

### text - 텍스트 입력

```html
<input type="text" name="username" placeholder="이름을 입력하세요" maxlength="20">
```

### email - 이메일 입력

```html
<input type="email" name="email" placeholder="example@email.com">
<!-- 이메일 형식(@가 포함된)이 아니면 자동으로 오류 표시 -->
```

### password - 비밀번호 입력

```html
<input type="password" name="password" minlength="8">
<!-- 입력한 내용이 •••로 가려집니다 -->
```

### number - 숫자 입력

```html
<input type="number" name="age" min="0" max="150" step="1" value="20">
<!-- min: 최솟값, max: 최댓값, step: 증감 단위 -->
```

### checkbox - 체크박스

```html
<!-- 여러 개 선택 가능 -->
<input type="checkbox" name="hobby" value="reading" id="hobby-reading">
<label for="hobby-reading">독서</label>

<input type="checkbox" name="hobby" value="coding" id="hobby-coding" checked>
<label for="hobby-coding">코딩</label>
<!-- checked: 기본으로 체크된 상태 -->
```

### radio - 라디오 버튼

```html
<!-- 같은 name 그룹에서 하나만 선택 가능 -->
<input type="radio" name="gender" value="male" id="male">
<label for="male">남성</label>

<input type="radio" name="gender" value="female" id="female">
<label for="female">여성</label>

<input type="radio" name="gender" value="prefer-not-to-say" id="prefer">
<label for="prefer">선택 안 함</label>
```

### file - 파일 업로드

```html
<!-- 이미지 파일만 허용 -->
<input type="file" name="profile-img" accept="image/*">

<!-- 여러 파일 선택 허용 -->
<input type="file" name="documents" accept=".pdf,.doc,.docx" multiple>
```

### date - 날짜 선택

```html
<input type="date" name="birthday" min="1900-01-01" max="2026-12-31">
```

### range - 슬라이더

```html
<input type="range" name="satisfaction" min="1" max="10" value="5">
```

### hidden - 숨겨진 값

```html
<!-- 사용자에게 보이지 않지만 폼과 함께 전송되는 데이터 -->
<input type="hidden" name="user_id" value="12345">
```

### 기타 input 타입

```html
<input type="tel" placeholder="010-0000-0000">          <!-- 전화번호 -->
<input type="url" placeholder="https://example.com">    <!-- URL -->
<input type="color">                                     <!-- 색상 선택 -->
<input type="search" placeholder="검색어 입력">          <!-- 검색 -->
```

---

## 4. label 태그

`<label>` 은 입력 요소와 설명 텍스트를 연결합니다.

```html
<!-- 방법 1: for 속성과 id로 연결 (권장) -->
<label for="username">이름:</label>
<input type="text" id="username" name="username">

<!-- 방법 2: label이 input을 감싸는 방식 -->
<label>
  이름:
  <input type="text" name="username">
</label>
```

> **label이 중요한 이유**: 라벨을 클릭하면 연결된 입력 요소가 포커스됩니다.  
> 스크린리더도 label을 읽어주므로 접근성에 필수입니다.

---

## 5. select - 드롭다운 선택

```html
<label for="city">거주 도시:</label>
<select name="city" id="city">
  <option value="">-- 선택하세요 --</option>   <!-- 기본 선택 없음 표시 -->
  <option value="seoul" selected>서울</option>   <!-- selected: 기본 선택값 -->
  <option value="busan">부산</option>
  <option value="incheon">인천</option>
  <option value="daegu">대구</option>
</select>

<!-- optgroup으로 그룹화 -->
<select name="job">
  <optgroup label="IT 분야">
    <option value="dev">개발자</option>
    <option value="design">디자이너</option>
  </optgroup>
  <optgroup label="일반 분야">
    <option value="sales">영업</option>
    <option value="marketing">마케팅</option>
  </optgroup>
</select>

<!-- multiple: 여러 개 선택 가능 (Ctrl/Cmd 키와 함께) -->
<select name="skills" multiple size="4">
  <option value="html">HTML</option>
  <option value="css">CSS</option>
  <option value="js">JavaScript</option>
  <option value="python">Python</option>
</select>
```

---

## 6. textarea - 여러 줄 텍스트 입력

```html
<label for="message">메시지:</label>
<textarea
  id="message"
  name="message"
  rows="5"
  cols="40"
  placeholder="여기에 메시지를 입력하세요..."
  maxlength="500"
></textarea>
<!-- rows: 표시할 행 수, cols: 표시할 열 수 -->
```

---

## 7. button 태그

```html
<!-- type="submit": 폼 전송 버튼 (기본값) -->
<button type="submit">제출하기</button>

<!-- type="reset": 폼 초기화 버튼 -->
<button type="reset">다시 작성</button>

<!-- type="button": 일반 버튼 (JavaScript와 함께 사용) -->
<button type="button" onclick="alert('클릭!')">클릭</button>
```

---

## 8. fieldset과 legend - 폼 그룹화

관련 있는 입력 요소들을 그룹으로 묶습니다.

```html
<form>
  <fieldset>
    <legend>개인 정보</legend>   <!-- fieldset의 제목 -->
    <label for="name">이름:</label>
    <input type="text" id="name" name="name"><br>
    <label for="email">이메일:</label>
    <input type="email" id="email" name="email">
  </fieldset>

  <fieldset>
    <legend>계정 정보</legend>
    <label for="pw">비밀번호:</label>
    <input type="password" id="pw" name="password"><br>
    <label for="pw2">비밀번호 확인:</label>
    <input type="password" id="pw2" name="password_confirm">
  </fieldset>

  <button type="submit">가입하기</button>
</form>
```

---

## 9. 입력 검증 속성

```html
<!-- required: 필수 입력 항목 (비어 있으면 제출 불가) -->
<input type="text" name="name" required>

<!-- placeholder: 입력 전 회색으로 표시되는 힌트 텍스트 -->
<input type="text" name="name" placeholder="홍길동">

<!-- disabled: 비활성화 (입력 및 제출 불가) -->
<input type="text" name="name" disabled>

<!-- readonly: 읽기 전용 (입력 불가, 제출은 가능) -->
<input type="text" name="name" value="홍길동" readonly>

<!-- minlength, maxlength: 텍스트 최소/최대 길이 -->
<input type="text" name="username" minlength="2" maxlength="20">

<!-- min, max: 숫자 최솟값/최댓값 -->
<input type="number" name="age" min="1" max="150">

<!-- pattern: 정규식으로 입력 형식 검증 -->
<input type="text" name="phone" pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}" placeholder="010-1234-5678">
```

---

## 정리

| 태그/속성 | 설명 |
|-----------|------|
| `<form>` | 폼 컨테이너 |
| `action` | 데이터 전송 URL |
| `method` | 전송 방식 (get/post) |
| `<input type="text">` | 텍스트 입력 |
| `<input type="email">` | 이메일 입력 (형식 검증) |
| `<input type="password">` | 비밀번호 (가려짐) |
| `<input type="number">` | 숫자 입력 |
| `<input type="checkbox">` | 다중 선택 |
| `<input type="radio">` | 단일 선택 |
| `<input type="file">` | 파일 업로드 |
| `<input type="date">` | 날짜 선택 |
| `<select>` | 드롭다운 선택 |
| `<textarea>` | 여러 줄 텍스트 |
| `<button>` | 버튼 |
| `<label>` | 입력 레이블 |
| `<fieldset>` | 폼 그룹 |
| `<legend>` | fieldset 제목 |
| `required` | 필수 입력 |
| `placeholder` | 힌트 텍스트 |
| `disabled` | 비활성화 |

---

## 다음 단계

- [예제 파일 보기](./예제/signup.html) - 회원가입 폼 예제
- [과제 확인하기](./과제/과제.md) - 설문조사 페이지 만들기
- [다음 강의: 시맨틱 HTML](../강의06_시맨틱_HTML/README.md)
