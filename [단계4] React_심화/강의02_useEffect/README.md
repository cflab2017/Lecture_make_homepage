# 강의02 — useEffect

## 학습 목표

- Side Effect의 개념을 이해한다.
- `useEffect`의 기본 사용법과 의존성 배열의 역할을 안다.
- 클린업 함수가 필요한 상황을 구분할 수 있다.
- 데이터 fetch 패턴(로딩/에러/성공 상태)을 구현할 수 있다.
- 무한 루프가 발생하는 원인을 파악하고 방지할 수 있다.

---

## 1. Side Effect란?

**Side Effect(부수 효과)**란 렌더링 외에 컴포넌트가 외부 세계와 상호작용하는 모든 것을 말합니다.

| Side Effect 예시 | 설명 |
|-----------------|------|
| 데이터 fetch | API 서버에서 데이터 가져오기 |
| DOM 직접 조작 | document.title 변경, 스크롤 위치 설정 |
| 이벤트 리스너 | `addEventListener` 등록 |
| 타이머 | `setTimeout`, `setInterval` |
| 구독(subscription) | WebSocket, Firebase 리스너 |

React의 렌더링은 **순수해야 합니다** (같은 props → 항상 같은 JSX).  
Side Effect는 `useEffect` 안에서 처리해야 합니다.

---

## 2. useEffect 기본 사용법

```jsx
import { useEffect } from 'react';

useEffect(() => {
  // Side Effect 코드
}, [의존성 배열]);
```

---

## 3. 의존성 배열 — 3가지 패턴

### 패턴 1: 의존성 배열 없음 → 매 렌더링마다 실행

```jsx
useEffect(() => {
  console.log('렌더링될 때마다 실행');
});
// ⚠️ 거의 사용하지 않음 — state 변경 시 무한 루프 위험
```

### 패턴 2: 빈 배열 `[]` → 마운트 시 한 번만 실행

```jsx
useEffect(() => {
  console.log('컴포넌트가 처음 화면에 나타날 때 한 번만 실행');
  fetchInitialData();
}, []); // 빈 배열 — 의존성 없음
```

### 패턴 3: 값이 있는 배열 → 해당 값이 바뀔 때마다 실행

```jsx
useEffect(() => {
  console.log('userId가 바뀔 때마다 실행');
  fetchUser(userId);
}, [userId]); // userId가 변경될 때만 재실행
```

---

## 4. 클린업 함수

`useEffect`에서 반환하는 함수는 **클린업(cleanup)** 함수입니다.  
컴포넌트가 **언마운트**되거나 다음 effect 실행 **직전**에 호출됩니다.

```jsx
useEffect(() => {
  // 타이머 설정
  const timerId = setInterval(() => {
    console.log('1초마다 실행');
  }, 1000);

  // 클린업 — 컴포넌트가 사라지거나 effect가 재실행되기 전에 타이머 제거
  return () => {
    clearInterval(timerId);
    console.log('타이머 정리!');
  };
}, []);
```

### 클린업이 필요한 상황

| 상황 | 클린업 |
|------|--------|
| `setInterval` / `setTimeout` | `clearInterval` / `clearTimeout` |
| `addEventListener` | `removeEventListener` |
| WebSocket | `socket.close()` |
| fetch (취소) | `AbortController.abort()` |

---

## 5. 데이터 fetch 패턴

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // AbortController — 컴포넌트 언마운트 시 fetch 취소
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`,
          { signal: controller.signal } // 취소 신호 전달
        );

        if (!response.ok) {
          throw new Error('데이터를 불러오지 못했습니다.');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        // AbortError는 무시 (정상적인 취소)
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // 클린업 — userId가 바뀌거나 언마운트 시 이전 fetch 취소
    return () => controller.abort();
  }, [userId]); // userId가 바뀔 때마다 새로 fetch

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>오류: {error}</p>;
  return <p>{user?.name}</p>;
}
```

---

## 6. 무한 루프 주의

```jsx
// ❌ 무한 루프 — state 변경 → 재렌더링 → effect 재실행 → state 변경 → ...
useEffect(() => {
  setCount(count + 1); // 의존성에 count가 있으면 무한 루프!
}, [count]);

// ✅ 함수형 업데이트로 의존성 제거
useEffect(() => {
  setCount(prev => prev + 1); // count를 의존성에 넣지 않아도 됨
}, []); // 마운트 시 한 번만

// ❌ 객체/배열을 의존성에 넣으면 매번 새 참조 → 무한 루프
useEffect(() => {
  fetchData(options);
}, [options]); // options가 매 렌더링마다 새로 생성되면 무한 실행

// ✅ useMemo나 useCallback으로 참조 유지 (강의06에서 자세히)
```

---

## 핵심 정리

- Side Effect는 반드시 `useEffect` 안에서 처리한다.
- `[]` → 마운트 시 한 번, `[값]` → 값이 바뀔 때마다, 없음 → 항상.
- 타이머/구독/fetch는 클린업으로 반드시 정리한다.
- 객체/배열을 의존성에 직접 넣으면 무한 루프 위험이 있다.
