# React 심화 과목

## 과목 소개

Next.js 기초(강의05) 이후 단계로, React의 핵심 훅과 패턴을 심화 학습하는 과목입니다.  
`useState`를 넘어 `useEffect`, `useContext`, `useReducer`, 커스텀 훅, 성능 최적화, React Router, 전역 상태 관리 라이브러리까지 다룹니다.

## 선수 조건

- **시작하기 모듈 강의05 완료** (Next.js 기초)
- React의 기본 개념(컴포넌트, props, state, JSX) 이해
- JavaScript ES6+ 문법 숙지

## 강의 목록

| 강의 | 주제 | 핵심 키워드 |
|------|------|------------|
| 강의01 | 컴포넌트 심화 | 단일 책임, props 패턴, 컴포넌트 합성 |
| 강의02 | useEffect | Side Effect, 의존성 배열, 클린업 |
| 강의03 | useContext | props drilling, Provider, 전역 테마 |
| 강의04 | useReducer | action, dispatch, reducer |
| 강의05 | 커스텀 훅 | useFetch, useLocalStorage, useDebounce |
| 강의06 | 성능 최적화 | React.memo, useMemo, useCallback |
| 강의07 | React Router | 라우팅, useParams, Outlet |
| 강의08 | 상태 관리 라이브러리 | Zustand, 전역 상태, slice 패턴 |

## 개발 환경 설정

```bash
# Create React App으로 프로젝트 생성
npx create-react-app my-react-app
cd my-react-app
npm start

# 또는 Vite 사용 (권장)
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

## 학습 방법

1. 각 강의의 `README.md`를 먼저 읽고 개념을 이해합니다.
2. `예제/` 폴더의 코드를 직접 실행해봅니다.
3. `과제/과제.md`를 읽고 스스로 구현해봅니다.
4. 막히면 `과제정답/`을 참고하되, 주석을 꼼꼼히 읽으세요.
