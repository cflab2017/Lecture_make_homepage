# HTML 과목 강의 자료

> 웹 페이지의 뼈대를 만드는 언어, HTML을 처음부터 차근차근 배웁니다.

---

## 과목 소개

HTML(HyperText Markup Language)은 웹 페이지의 **구조와 내용**을 정의하는 마크업 언어입니다.  
이 과목에서는 HTML의 기본 문법부터 시맨틱 태그까지, 실습 중심으로 학습합니다.

- **대상**: 웹 개발 입문자, HTML을 처음 배우는 분
- **선수 지식**: 없음 (컴퓨터 기본 조작 가능하면 됩니다)
- **학습 방식**: 강의 README 읽기 → 예제 파일 실행 → 과제 수행 → 정답 확인

---

## 학습 목표

이 과목을 마치면 다음을 할 수 있습니다:

1. HTML 문서의 기본 구조를 이해하고 작성할 수 있다
2. 텍스트, 링크, 이미지 등 핵심 태그를 올바르게 사용할 수 있다
3. 표(테이블)와 폼(입력 양식)을 구현할 수 있다
4. 시맨틱 HTML을 활용하여 의미 있는 문서 구조를 설계할 수 있다
5. 브라우저에서 바로 동작하는 HTML 파일을 스스로 만들 수 있다

---

## 강의 목록

| 강의 번호 | 강의명 | 핵심 태그 / 개념 | 난이도 |
|-----------|--------|-----------------|--------|
| 강의 01 | [HTML 기초](./강의01_HTML_기초/README.md) | DOCTYPE, html, head, body, h1~h6, p, div, span, ul, ol, li | ⭐ |
| 강의 02 | [텍스트 요소](./강의02_텍스트_요소/README.md) | strong, em, blockquote, code, pre, br, hr, sup, sub | ⭐ |
| 강의 03 | [링크와 이미지](./강의03_링크_이미지/README.md) | a, img, 절대경로, 상대경로, figure, figcaption | ⭐⭐ |
| 강의 04 | [테이블](./강의04_테이블/README.md) | table, thead, tbody, tfoot, tr, th, td, colspan, rowspan | ⭐⭐ |
| 강의 05 | [폼](./강의05_폼/README.md) | form, input, select, textarea, button, label, fieldset | ⭐⭐⭐ |
| 강의 06 | [시맨틱 HTML](./강의06_시맨틱_HTML/README.md) | header, nav, main, section, article, aside, footer | ⭐⭐⭐ |

---

## 각 강의 구성

```
강의XX_주제명/
├── README.md         ← 개념 설명 + 코드 예제 (여기부터 시작하세요)
├── 예제/             ← 바로 실행해볼 수 있는 완성 예제 파일
├── 과제/
│   └── 과제.md       ← 스스로 해볼 과제 (요구사항 + 힌트)
└── 과제정답/         ← 과제 정답 (먼저 스스로 해보고 확인하세요!)
```

---

## 학습 순서 안내

```
강의01 → 강의02 → 강의03 → 강의04 → 강의05 → 강의06
```

앞 강의의 내용이 뒤 강의의 기초가 되므로, **순서대로** 학습하는 것을 권장합니다.

---

## 개발 환경 설정

### 필요한 도구
1. **텍스트 에디터**: [VS Code](https://code.visualstudio.com/) 추천
2. **웹 브라우저**: Chrome, Firefox, Edge 중 하나

### VS Code 추천 확장 프로그램
- **Live Server**: HTML 파일을 저장할 때마다 브라우저가 자동으로 새로고침됩니다
- **HTML CSS Support**: HTML 자동완성 기능을 강화합니다

### HTML 파일 여는 방법
- 파일 탐색기에서 `.html` 파일을 **더블클릭** 하면 브라우저로 열립니다
- VS Code에서 열었다면 `Live Server` 확장의 **Go Live** 버튼을 클릭합니다

---

## 참고 자료

- [MDN Web Docs - HTML](https://developer.mozilla.org/ko/docs/Web/HTML) : 가장 신뢰할 수 있는 HTML 레퍼런스 (한국어 지원)
- [W3Schools HTML Tutorial](https://www.w3schools.com/html/) : 간단한 예제와 함께 빠르게 확인하기 좋은 사이트
- [HTML Validator](https://validator.w3.org/) : 내가 작성한 HTML이 올바른지 검사하는 도구

---

> 질문이 있거나 이해가 안 되는 부분이 있으면 언제든지 질문하세요!  
> 가장 좋은 학습법은 **직접 코드를 쳐보는 것**입니다. 예제를 그냥 읽지 말고 꼭 따라쳐보세요!
