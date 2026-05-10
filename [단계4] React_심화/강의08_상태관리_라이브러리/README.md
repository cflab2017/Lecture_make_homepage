# 강의08 — 상태 관리 라이브러리

## 학습 목표

- 전역 상태가 필요한 시점을 판단할 수 있다.
- Zustand와 Redux의 차이를 이해하고 적합한 상황을 선택한다.
- Zustand를 설치하고 store를 만들어 컴포넌트에서 사용할 수 있다.
- slice 패턴으로 관심사를 분리한다.
- devtools 미들웨어로 상태 변화를 디버깅한다.

---

## 1. 전역 상태가 필요한 시점

| 상황 | 해결책 |
|------|--------|
| 컴포넌트 내부에서만 사용 | `useState` |
| 부모-자식 간 데이터 전달 | `props` |
| 2~3단계 이상의 props drilling | `useContext` |
| 여러 페이지/컴포넌트에서 같은 데이터 사용 | **전역 상태 관리** |
| 복잡한 비동기 로직 + 공유 상태 | **전역 상태 관리** |

> 장바구니, 로그인 사용자 정보, 알림, 언어 설정 등이 전형적인 전역 상태입니다.

---

## 2. Zustand vs Redux 비교

| 항목 | Zustand | Redux Toolkit |
|------|---------|--------------|
| 설치 크기 | 작음 (~1KB) | 큰 편 |
| 학습 곡선 | 낮음 | 높음 |
| 보일러플레이트 | 거의 없음 | 어느 정도 있음 |
| DevTools 지원 | 미들웨어로 지원 | 기본 내장 |
| 비동기 처리 | 자유롭게 처리 | `createAsyncThunk` |
| 규모 | 소~중규모 적합 | 대규모 팀 적합 |
| React 결합도 | 낮음 (React 없이도 사용 가능) | React 의존적 |

---

## 3. Zustand 설치 및 기본 사용

```bash
npm install zustand
```

```jsx
// store/counterStore.js
import { create } from 'zustand';

const useCounterStore = create((set) => ({
  // 상태
  count: 0,

  // 액션 — set()으로 상태 업데이트
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// 컴포넌트에서 사용
function Counter() {
  // useCounterStore 훅으로 상태와 액션 가져오기
  const { count, increment, decrement } = useCounterStore();

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

---

## 4. 선택적 구독 — 성능 최적화

Zustand의 강점 중 하나: **필요한 상태만 선택해 구독**할 수 있습니다.

```jsx
// count만 필요한 컴포넌트 — count가 바뀔 때만 리렌더링
function CountDisplay() {
  const count = useCounterStore((state) => state.count);
  return <p>{count}</p>;
}

// increment만 필요한 컴포넌트 — 절대 리렌더링 안 됨 (함수는 변하지 않음)
function IncrementButton() {
  const increment = useCounterStore((state) => state.increment);
  return <button onClick={increment}>+</button>;
}
```

---

## 5. slice 패턴 — 관심사 분리

관련 상태와 액션을 slice 함수로 묶고, 여러 slice를 합쳐 큰 store를 만듭니다.

```jsx
// store/slices/cartSlice.js
export const createCartSlice = (set, get) => ({
  cart: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(i => i.id !== id) })),
  getTotal: () => get().cart.reduce((sum, item) => sum + item.price, 0),
});

// store/useAppStore.js — 여러 slice 합치기
import { create } from 'zustand';
import { createCartSlice } from './slices/cartSlice';
import { createUserSlice } from './slices/userSlice';

const useAppStore = create((...args) => ({
  ...createCartSlice(...args),
  ...createUserSlice(...args),
}));
```

---

## 6. devtools 미들웨어

Redux DevTools 확장 프로그램과 연동해 상태 변화를 시각적으로 확인합니다.

```jsx
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }), false, 'increment'),
      //                                                                        ↑ 액션 이름
    }),
    { name: 'MyStore' } // DevTools에 표시되는 store 이름
  )
);
```

---

## 핵심 정리

- 여러 컴포넌트/페이지에서 같은 데이터가 필요할 때 전역 상태를 사용한다.
- Zustand는 `create`로 store를 만들고, 컴포넌트에서 훅처럼 사용한다.
- `set`으로 상태를 변경하고, `get`으로 현재 상태를 읽는다.
- 선택자(selector)로 필요한 상태만 구독해 성능을 최적화한다.
- 관련 상태는 slice로 묶어 관리한다.
