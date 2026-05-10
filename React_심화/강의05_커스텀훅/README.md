# 강의05 — 커스텀 훅 (Custom Hook)

## 학습 목표

- 커스텀 훅의 개념과 `use`로 시작해야 하는 이유를 이해한다.
- 공통 로직을 커스텀 훅으로 추출해 재사용할 수 있다.
- `useFetch`, `useLocalStorage`, `useDebounce`를 직접 구현할 수 있다.

---

## 1. 커스텀 훅이란?

**커스텀 훅(Custom Hook)**은 React 훅(`useState`, `useEffect` 등)을 활용하는 **일반 함수**입니다.  
반드시 `use`로 시작하는 이름을 가져야 합니다.

```jsx
// ✅ 커스텀 훅 — use로 시작
function useWindowSize() { ... }
function useFetch(url) { ... }
function useLocalStorage(key, initialValue) { ... }

// ❌ 커스텀 훅이 아님 — use로 시작하지 않음
function getWindowSize() { ... } // 내부에 훅을 사용해도 규칙 위반
```

### `use`로 시작해야 하는 이유

- React는 `use`로 시작하는 함수에서만 훅 규칙(최상위에서만 호출, 컴포넌트 안에서만 호출)을 검사합니다.
- ESLint의 `react-hooks/rules-of-hooks` 규칙이 제대로 동작합니다.
- 다른 개발자가 "이것은 훅이다"라고 즉시 인식할 수 있습니다.

---

## 2. 로직 추출의 이점

### 추출 전 — 중복 코드

```jsx
// ComponentA.jsx
function ComponentA() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setData).catch(setError).finally(() => setIsLoading(false));
  }, []);
  // ...
}

// ComponentB.jsx — 똑같은 로직 반복
function ComponentB() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // ... 똑같이 반복
}
```

### 추출 후 — useFetch 커스텀 훅

```jsx
// hooks/useFetch.js
function useFetch(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData).catch(setError).finally(() => setIsLoading(false));
  }, [url]);

  return { data, isLoading, error };
}

// ComponentA.jsx — 한 줄로 해결
function ComponentA() {
  const { data, isLoading, error } = useFetch('/api/users');
  // ...
}

// ComponentB.jsx — 역시 한 줄로 해결
function ComponentB() {
  const { data, isLoading, error } = useFetch('/api/products');
  // ...
}
```

---

## 3. 주요 커스텀 훅 구현 패턴

### useFetch

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    setIsLoading(true);

    fetch(url, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error('fetch 실패'); return r.json(); })
      .then(setData)
      .catch(err => { if (err.name !== 'AbortError') setError(err.message); })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, isLoading, error };
}
```

### useLocalStorage

```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue];
}
```

### useDebounce

```jsx
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // delay ms 후에 값을 업데이트
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 값이 바뀌면 이전 타이머를 취소하고 새 타이머 시작
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

---

## 핵심 정리

- 커스텀 훅은 `use`로 시작하는 일반 함수다.
- 여러 컴포넌트에서 같은 훅 로직이 반복되면 커스텀 훅으로 추출한다.
- 커스텀 훅은 상태(state)가 아닌 **로직**을 공유한다. (각 컴포넌트는 독립적인 state를 가짐)
- 반환값은 자유롭게 정할 수 있다 (배열, 객체, 단일 값 모두 가능).
