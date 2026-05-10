# 강의03 — useContext

## 학습 목표

- props drilling이 왜 문제인지 이해한다.
- `createContext` / `useContext` / `Provider` 를 사용할 수 있다.
- Context가 적합한 상황과 그렇지 않은 상황을 구분한다.
- 전역 테마(다크 모드) 패턴을 직접 구현할 수 있다.

---

## 1. props drilling 문제

**props drilling**이란 중간 컴포넌트들이 사용하지 않는 데이터를 아래로 내려 전달하는 현상입니다.

```
App (user 데이터 보유)
 └─ Page
     └─ Section
         └─ Header
             └─ UserAvatar  ← 여기서 user 사용
```

중간의 `Page`, `Section`, `Header`는 `user`를 사용하지 않지만,  
`UserAvatar`에 전달하기 위해 계속 받아서 넘겨야 합니다.

```jsx
// ❌ props drilling — 모든 중간 컴포넌트에 user를 전달해야 함
<App>
  <Page user={user}>
    <Section user={user}>
      <Header user={user}>
        <UserAvatar user={user} />
      </Header>
    </Section>
  </Page>
</App>
```

---

## 2. createContext / useContext

Context를 사용하면 Provider로 감싼 컴포넌트 트리 어디에서든  
props 없이 데이터에 접근할 수 있습니다.

```jsx
import { createContext, useContext, useState } from 'react';

// 1단계: Context 생성 — 기본값을 인자로 전달 (Provider 없을 때 사용)
const UserContext = createContext(null);

// 2단계: Provider — value prop으로 공유할 데이터 제공
function App() {
  const [user, setUser] = useState({ name: '김철수' });

  return (
    <UserContext.Provider value={user}>
      <Page />  {/* user props를 전달할 필요 없음 */}
    </UserContext.Provider>
  );
}

// 3단계: Consumer — useContext로 어디서든 접근
function UserAvatar() {
  const user = useContext(UserContext); // Provider의 value를 바로 가져옴
  return <img alt={user.name} />;
}
```

---

## 3. 커스텀 훅으로 Context 사용 편리하게 만들기

```jsx
// ✅ useContext를 커스텀 훅으로 감싸면 사용이 편리하고 오류를 잡기 쉬움
function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser는 UserProvider 안에서 사용해야 합니다.');
  }
  return context;
}

// 사용
function UserAvatar() {
  const user = useUser(); // 더 명시적이고 안전
  return <img alt={user.name} />;
}
```

---

## 4. Context를 언제 써야 할까?

| Context 적합 | Context 부적합 |
|-------------|--------------|
| 테마 (다크/라이트 모드) | 자주 변경되는 데이터 |
| 로그인한 사용자 정보 | 특정 컴포넌트만 사용하는 지역 상태 |
| 언어/지역 설정 | 성능이 중요한 데이터 (Context는 리렌더링 유발) |
| 전역 알림/토스트 | |

> **주의**: Context 값이 바뀌면 해당 Context를 구독하는 **모든 컴포넌트**가 리렌더링됩니다.  
> 자주 바뀌는 데이터는 Zustand 같은 상태 관리 라이브러리를 고려하세요.

---

## 5. 전역 테마 패턴

```jsx
const ThemeContext = createContext('light'); // 기본값: 'light'

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // value로 테마 값과 토글 함수를 함께 전달
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}
```

---

## 핵심 정리

- `createContext` → `Provider` → `useContext` 세 단계로 구성한다.
- Provider 안의 모든 컴포넌트가 value에 접근할 수 있다.
- Context는 전역이지만 값이 바뀌면 구독 컴포넌트 전체가 리렌더링된다.
- 커스텀 훅(`useSomething`)으로 감싸면 더 안전하고 사용하기 편하다.
