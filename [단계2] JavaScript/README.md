# JavaScript 강의 과목 소개

## 과목 개요

이 과목은 웹 개발의 핵심 언어인 **JavaScript**를 기초부터 실전까지 체계적으로 학습합니다.  
변수와 타입부터 시작하여 비동기 프로그래밍까지, 총 8개 강의로 구성되어 있습니다.

---

## 선수 조건

이 과목을 수강하기 전에 아래 내용을 먼저 학습해 주세요.

- **HTML 기초**: 태그 구조, 시맨틱 요소, 폼 요소
- **CSS 기초**: 선택자, 박스 모델, 기본 레이아웃
- 텍스트 에디터 사용법 (VS Code 권장)
- 웹 브라우저 개발자 도구 (F12) 기본 사용법

---

## 강의 목록

| 강의 | 제목 | 주요 내용 |
|------|------|-----------|
| 강의 01 | [변수와 타입](./강의01_변수_타입/README.md) | var/let/const, 원시 타입, typeof, 형변환, 템플릿 리터럴 |
| 강의 02 | [제어문](./강의02_제어문/README.md) | if/else, switch, for, while, break/continue |
| 강의 03 | [함수](./강의03_함수/README.md) | 함수 선언/표현식/화살표함수, 스코프, 콜백 |
| 강의 04 | [배열](./강의04_배열/README.md) | 배열 메서드, forEach/map/filter, 전개연산자 |
| 강의 05 | [객체](./강의05_객체/README.md) | 객체 리터럴, 메서드, this, 구조분해할당, JSON |
| 강의 06 | [DOM 조작](./강의06_DOM_조작/README.md) | querySelector, createElement, classList, dataset |
| 강의 07 | [이벤트](./강의07_이벤트/README.md) | addEventListener, 이벤트 객체, 버블링, 이벤트 위임 |
| 강의 08 | [비동기](./강의08_비동기/README.md) | Promise, async/await, fetch API, 에러 처리 |

---

## 학습 방법

1. 각 강의의 `README.md`를 읽으며 개념을 이해합니다.
2. `예제/index.html`을 브라우저에서 직접 열어 실행해 봅니다.
3. 개발자 도구(F12 → Console)를 열어 동작을 확인합니다.
4. `과제/과제.md`를 읽고 스스로 구현해 봅니다.
5. 막히면 `과제정답/index.html`을 참고합니다.

---

## 개발 환경 설정

```bash
# VS Code 설치 후 확장 프로그램 설치 권장
- Live Server       # HTML 파일을 로컬 서버로 실행
- Prettier          # 코드 자동 정렬
- ESLint            # 코드 오류 감지
```

---

## 참고 자료

- [MDN Web Docs - JavaScript](https://developer.mozilla.org/ko/docs/Web/JavaScript)
- [JavaScript.info](https://ko.javascript.info/)
- [Can I use](https://caniuse.com/) — 브라우저 호환성 확인
