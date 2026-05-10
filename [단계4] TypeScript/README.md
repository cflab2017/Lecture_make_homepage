# TypeScript 과목 소개

## TypeScript란?

**TypeScript**는 Microsoft가 개발한 **JavaScript의 상위 집합(Superset)** 언어입니다.
JavaScript에 **정적 타입 시스템**을 추가하여, 컴파일 시점에 타입 오류를 발견할 수 있습니다.

```
TypeScript(.ts) → tsc 컴파일 → JavaScript(.js) → 브라우저 / Node.js 실행
```

### 왜 TypeScript를 사용하나요?

```js
// JavaScript — 런타임에 오류 발생 (실행해봐야 앎)
function greet(name) {
  return '안녕하세요, ' + name.toUpperCase();
}
greet(42); // 런타임 오류: name.toUpperCase is not a function
```

```ts
// TypeScript — 컴파일 시점에 오류 발견
function greet(name: string): string {
  return '안녕하세요, ' + name.toUpperCase();
}
greet(42); // 컴파일 오류: number는 string에 할당할 수 없음
```

### 주요 장점

- **버그 조기 발견**: 실행 전에 타입 오류 검출
- **IDE 지원 강화**: 자동 완성, 리팩토링 도구 향상
- **코드 문서화**: 타입이 곧 문서
- **대규모 프로젝트**: 팀 협업 시 코드 안정성 향상

---

## 선수 조건

- HTML/CSS 기초
- JavaScript 기초 (변수, 함수, 배열, 객체)
- Node.js 모듈 완료 (권장)

---

## 강의 목록

| 강의 | 주제 | 주요 내용 |
|------|------|-----------|
| 강의 01 | TS 기초 | 설치, tsc, tsconfig, 기본 타입 |
| 강의 02 | 타입 선언 | 함수 타입, void, never, 타입 추론 |
| 강의 03 | 인터페이스/타입 | interface, type alias, 유니온, 교차 |
| 강의 04 | 클래스 | 접근 제어자, 상속, 추상 클래스 |
| 강의 05 | 제네릭 | 제네릭 함수/클래스, 유틸리티 타입 |
| 강의 06 | React + TypeScript | Props 타입, useState, 이벤트 타입 |

---

## 개발 환경 준비

```bash
# TypeScript 전역 설치
npm install -g typescript

# 버전 확인
tsc --version

# VS Code 확장 추천
# - TypeScript Hero
# - Pretty TypeScript Errors
# - Error Lens
```

## 학습 목표

이 과목을 마치면 다음을 할 수 있습니다:

1. 기존 JavaScript 코드에 TypeScript 타입 추가
2. 인터페이스와 타입으로 데이터 구조 명확하게 정의
3. 제네릭으로 재사용 가능한 타입 안전 함수 작성
4. React 컴포넌트에 TypeScript 완전 적용
