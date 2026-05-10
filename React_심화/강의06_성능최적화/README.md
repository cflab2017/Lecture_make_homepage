# 강의06 — 성능 최적화

## 학습 목표

- 불필요한 리렌더링이 발생하는 원인을 이해한다.
- `React.memo`, `useMemo`, `useCallback`의 차이와 사용 시점을 안다.
- `useRef`를 렌더링 없이 값을 저장하는 데 사용할 수 있다.
- React DevTools Profiler로 성능 병목을 찾는 방법을 안다.

---

## 1. 불필요한 리렌더링 이해

React는 다음 상황에서 컴포넌트를 리렌더링합니다:

1. **state가 바뀔 때**
2. **props가 바뀔 때**
3. **부모 컴포넌트가 리렌더링될 때** — 자식도 함께 리렌더링

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+{count}</button>
      <Child /> {/* count와 무관하지만 Parent가 리렌더링될 때마다 함께 리렌더링 */}
    </>
  );
}
```

---

## 2. React.memo — 컴포넌트 메모이제이션

`React.memo`로 감싸면 props가 바뀌지 않는 한 리렌더링을 건너뜁니다.

```jsx
// ❌ 최적화 전 — 부모 리렌더링 시 항상 리렌더링
function ExpensiveChild({ data }) {
  console.log('ExpensiveChild 렌더링');
  return <div>{data}</div>;
}

// ✅ React.memo — props(data)가 동일하면 리렌더링 건너뜀
const ExpensiveChild = React.memo(function ExpensiveChild({ data }) {
  console.log('ExpensiveChild 렌더링');
  return <div>{data}</div>;
});
```

> **주의**: 모든 컴포넌트에 무조건 `React.memo`를 쓰면 안 됩니다.  
> memo 자체도 비교 비용이 있으므로, **렌더링 비용이 큰 컴포넌트**에만 사용하세요.

---

## 3. useMemo — 계산 결과 메모이제이션

비용이 큰 계산의 결과를 메모이제이션합니다. 의존성이 바뀌지 않으면 이전 결과를 재사용합니다.

```jsx
function ProductList({ products, filterKeyword }) {
  // ❌ 최적화 전 — 매 렌더링마다 필터링 실행
  const filteredProducts = products.filter(p =>
    p.name.includes(filterKeyword)
  );

  // ✅ useMemo — products나 filterKeyword가 바뀔 때만 필터링 실행
  const filteredProducts = useMemo(
    () => products.filter(p => p.name.includes(filterKeyword)),
    [products, filterKeyword] // 이 값이 바뀔 때만 재계산
  );

  return <ul>{filteredProducts.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

---

## 4. useCallback — 함수 메모이제이션

함수를 메모이제이션합니다. 의존성이 바뀌지 않으면 같은 함수 참조를 유지합니다.

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // ❌ 최적화 전 — 매 렌더링마다 새 함수 생성 → React.memo 무력화
  const handleClick = () => setCount(c => c + 1);

  // ✅ useCallback — 의존성이 없으므로 항상 같은 함수 참조
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // 의존성 없음

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      {/* handleClick이 변하지 않으므로 React.memo가 효과를 발휘 */}
      <MemoizedButton onClick={handleClick}>{count}</MemoizedButton>
    </>
  );
}

const MemoizedButton = React.memo(function Button({ onClick, children }) {
  console.log('Button 렌더링');
  return <button onClick={onClick}>{children}</button>;
});
```

---

## 5. useRef — 렌더링 없이 값 저장

`useRef`는 렌더링을 유발하지 않고 값을 저장하는 상자입니다.

```jsx
// 사용 1: DOM 요소에 직접 접근
function InputFocus() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus(); // DOM 메서드 직접 호출
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>포커스</button>
    </>
  );
}

// 사용 2: 렌더링 없이 이전 값 저장
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(0);

  useEffect(() => {
    prevCountRef.current = count; // ref 변경은 리렌더링 유발 안 함
  });

  return (
    <p>현재: {count}, 이전: {prevCountRef.current}</p>
  );
}
```

---

## 6. React DevTools Profiler

Chrome/Firefox 확장 프로그램 **React Developer Tools**의 Profiler 탭을 사용해 성능을 측정합니다.

1. React DevTools 설치
2. DevTools → Profiler 탭 열기
3. 녹화 시작(⏺) → 앱 조작 → 녹화 중지(⏹)
4. 어떤 컴포넌트가 얼마나 자주, 오래 렌더링되는지 확인
5. 불필요한 리렌더링을 `React.memo`, `useMemo`, `useCallback`으로 최적화

---

## 핵심 정리

| 도구 | 메모이제이션 대상 | 사용 시점 |
|------|-----------------|----------|
| `React.memo` | 컴포넌트 | 렌더링 비용이 크고 props가 자주 안 바뀔 때 |
| `useMemo` | 계산 결과(값) | 비용이 큰 계산이 반복될 때 |
| `useCallback` | 함수 | React.memo 컴포넌트에 함수를 prop으로 전달할 때 |
| `useRef` | DOM/값 | 렌더링 없이 값을 유지해야 할 때 |

> **성능 최적화는 문제가 생겼을 때 하세요.** 미리 최적화하면 코드만 복잡해집니다.
