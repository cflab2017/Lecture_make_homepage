import React, { useReducer } from 'react';

// ─── action type 상수 ────────────────────────────────────────
// 문자열 오타를 방지하기 위해 상수로 정의
const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';

// ─── 초기 상태 ──────────────────────────────────────────────
const initialState = {
  items: [], // { id, name, price, quantity }[] 형태
};

// ─── 상품 목록 (더미 데이터) ─────────────────────────────────
const PRODUCTS = [
  { id: 1, name: '노트북 파우치', price: 25000 },
  { id: 2, name: '기계식 키보드', price: 89000 },
  { id: 3, name: '무선 마우스', price: 45000 },
  { id: 4, name: 'USB 허브', price: 32000 },
];

// ─── Reducer 함수 ────────────────────────────────────────────
/**
 * cartReducer — action에 따라 새로운 상태를 반환하는 순수 함수
 *
 * @param {object} state - 현재 장바구니 상태
 * @param {{ type: string, payload: any }} action - 발생한 action
 * @returns {object} 새로운 상태
 */
function cartReducer(state, action) {
  switch (action.type) {

    case ADD_ITEM: {
      // 이미 장바구니에 있는 상품인지 확인
      const existingItem = state.items.find((item) => item.id === action.payload.id);

      if (existingItem) {
        // 이미 있으면 수량만 증가 — map으로 새 배열 생성 (불변성 유지)
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 } // 해당 항목만 새 객체로 수량 증가
              : item // 나머지는 그대로
          ),
        };
      }

      // 없으면 새 항목 추가 — 스프레드로 새 배열 생성
      return {
        ...state,
        items: [
          ...state.items,
          { ...action.payload, quantity: 1 }, // 수량 1로 추가
        ],
      };
    }

    case REMOVE_ITEM:
      // filter로 해당 id를 제외한 새 배열 반환
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case UPDATE_QUANTITY: {
      // 수량이 0 이하면 목록에서 제거
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }

      // 해당 항목의 수량만 업데이트
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case CLEAR_CART:
      // 장바구니 전체 비우기
      return { ...state, items: [] };

    default:
      // 알 수 없는 action은 현재 상태 그대로 반환
      console.warn(`알 수 없는 action type: ${action.type}`);
      return state;
  }
}

// ─── 금액 포맷 함수 ──────────────────────────────────────────
const formatPrice = (price) => price.toLocaleString('ko-KR') + '원';

// ─── ShoppingCart 컴포넌트 ───────────────────────────────────
function ShoppingCart() {
  // useReducer — cartReducer와 initialState로 초기화
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // 총 금액 계산
  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 총 상품 수
  const totalCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
        🛒 장바구니
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* 상품 목록 */}
        <div>
          <h2 style={{ color: '#374151', fontSize: '16px', marginBottom: '12px' }}>상품 목록</h2>
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '8px',
                backgroundColor: '#f9fafb',
              }}
            >
              <div>
                <div style={{ fontWeight: '600', color: '#111827' }}>{product.name}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>{formatPrice(product.price)}</div>
              </div>

              {/* ADD_ITEM action dispatch */}
              <button
                onClick={() => dispatch({ type: ADD_ITEM, payload: product })}
                style={{
                  padding: '6px 14px',
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                + 담기
              </button>
            </div>
          ))}
        </div>

        {/* 장바구니 */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ color: '#374151', fontSize: '16px', margin: 0 }}>
              담은 상품 ({totalCount}개)
            </h2>

            {/* CLEAR_CART action dispatch */}
            {state.items.length > 0 && (
              <button
                onClick={() => dispatch({ type: CLEAR_CART })}
                style={{
                  padding: '4px 10px',
                  backgroundColor: '#fff',
                  color: '#ef4444',
                  border: '1px solid #ef4444',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                전체 삭제
              </button>
            )}
          </div>

          {/* 장바구니가 비어있을 때 */}
          {state.items.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#9ca3af',
              border: '2px dashed #e5e7eb',
              borderRadius: '8px',
            }}>
              장바구니가 비어있습니다.
            </div>
          )}

          {/* 장바구니 항목 */}
          {state.items.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '8px',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: '#111827' }}>{item.name}</strong>
                {/* REMOVE_ITEM action dispatch */}
                <button
                  onClick={() => dispatch({ type: REMOVE_ITEM, payload: item.id })}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  ×
                </button>
              </div>

              {/* 수량 조절 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* UPDATE_QUANTITY action — 수량 감소 */}
                <button
                  onClick={() =>
                    dispatch({
                      type: UPDATE_QUANTITY,
                      payload: { id: item.id, quantity: item.quantity - 1 },
                    })
                  }
                  style={{
                    width: '28px',
                    height: '28px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: '#f9fafb',
                  }}
                >
                  -
                </button>

                <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '600' }}>
                  {item.quantity}
                </span>

                {/* UPDATE_QUANTITY action — 수량 증가 */}
                <button
                  onClick={() =>
                    dispatch({
                      type: UPDATE_QUANTITY,
                      payload: { id: item.id, quantity: item.quantity + 1 },
                    })
                  }
                  style={{
                    width: '28px',
                    height: '28px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: '#f9fafb',
                  }}
                >
                  +
                </button>

                <span style={{ marginLeft: 'auto', color: '#374151', fontWeight: '600' }}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}

          {/* 합계 */}
          {state.items.length > 0 && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: '700',
              fontSize: '16px',
              color: '#1d4ed8',
            }}>
              <span>총 합계</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
