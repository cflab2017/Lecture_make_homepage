# 강의04 — useReducer

## 학습 목표

- `useReducer`의 문법(action / dispatch / reducer)을 이해한다.
- `useState`와 `useReducer`의 차이를 알고 적절히 선택한다.
- immer 없이 불변성을 유지하며 상태를 업데이트한다.
- 복잡한 상태 로직을 reducer로 분리해 테스트 가능하게 만든다.

---

## 1. useReducer 문법

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

| 요소 | 역할 |
|------|------|
| `state` | 현재 상태 |
| `dispatch` | action을 보내는 함수 |
| `reducer` | `(state, action) => newState` 형태의 순수 함수 |
| `initialState` | 초기 상태 값 |

---

## 2. action / dispatch / reducer 패턴

```jsx
// 1. action 정의 — type 필드가 필수, payload는 선택
const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const CLEAR_CART = 'CLEAR_CART';

// 2. reducer 함수 — switch문으로 action type에 따라 처리
// 반드시 새 객체를 반환해야 함 (불변성 유지)
function cartReducer(state, action) {
  switch (action.type) {
    case ADD_ITEM:
      return {
        ...state, // 기존 상태 복사
        items: [...state.items, action.payload], // 새 배열 생성
      };

    case REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case CLEAR_CART:
      return { ...state, items: [] };

    default:
      // 알 수 없는 action은 현재 state를 그대로 반환
      return state;
  }
}

// 3. 컴포넌트에서 사용
function Cart() {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // dispatch로 action 전송
  const addItem = (product) => {
    dispatch({ type: ADD_ITEM, payload: product }); // payload에 데이터 포함
  };

  const removeItem = (id) => {
    dispatch({ type: REMOVE_ITEM, payload: id });
  };
}
```

---

## 3. useState vs useReducer 선택 기준

| 상황 | 권장 |
|------|------|
| 단순한 값 하나 (숫자, 문자열, boolean) | `useState` |
| 여러 state가 서로 연관된 경우 | `useReducer` |
| 다음 상태가 이전 상태에 의존하는 경우 | `useReducer` |
| 상태 업데이트 로직이 복잡한 경우 | `useReducer` |
| 상태 변경 로직을 외부로 분리하고 싶을 때 | `useReducer` |
| 테스트가 중요한 경우 (reducer는 순수 함수) | `useReducer` |

```jsx
// useState로 관리하면 복잡해지는 예
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);
const [discountRate, setDiscountRate] = useState(0);
const [appliedCoupon, setAppliedCoupon] = useState(null);

// useReducer로 관련 상태를 하나로 묶음
const [cartState, dispatch] = useReducer(cartReducer, {
  items: [],
  total: 0,
  discountRate: 0,
  appliedCoupon: null,
});
```

---

## 4. 불변성 유지 패턴

React 상태는 직접 변경(mutate)하면 안 됩니다. **항상 새 객체/배열을 반환**해야 합니다.

```jsx
// ❌ 불변성 위반 — 기존 배열을 직접 변경
case ADD_ITEM:
  state.items.push(action.payload); // 직접 push — 리렌더링 안 됨!
  return state;

// ✅ 새 배열 생성 — 스프레드 연산자 활용
case ADD_ITEM:
  return {
    ...state,
    items: [...state.items, action.payload], // 새 배열
  };

// ✅ 특정 항목 수정 — map으로 새 배열 생성
case UPDATE_QUANTITY:
  return {
    ...state,
    items: state.items.map(item =>
      item.id === action.payload.id
        ? { ...item, quantity: action.payload.quantity } // 해당 항목만 새 객체
        : item // 나머지는 그대로
    ),
  };

// ✅ 특정 항목 제거 — filter로 새 배열 생성
case REMOVE_ITEM:
  return {
    ...state,
    items: state.items.filter(item => item.id !== action.payload),
  };
```

---

## 핵심 정리

- `dispatch({ type: '...', payload: ... })`로 상태 변경을 요청한다.
- reducer는 순수 함수여야 한다 — 같은 입력 → 항상 같은 출력.
- 상태를 직접 수정하지 말고 **항상 새 객체/배열을 반환**한다.
- 관련된 여러 state는 useReducer로 묶어 관리한다.
