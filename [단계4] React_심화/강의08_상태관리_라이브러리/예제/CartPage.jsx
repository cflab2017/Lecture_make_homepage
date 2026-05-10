/**
 * CartPage.jsx — Zustand cartStore를 사용하는 장바구니 페이지
 *
 * useCartStore를 여러 컴포넌트에서 사용해도
 * 모두 같은 전역 상태를 공유합니다.
 * Context Provider 없이도 동작합니다.
 */

import React from 'react';
import useCartStore from './store/cartStore';

// 더미 상품 목록
const PRODUCTS = [
  { id: 1, name: '노트북 파우치', price: 25000 },
  { id: 2, name: '기계식 키보드', price: 89000 },
  { id: 3, name: '무선 마우스', price: 45000 },
  { id: 4, name: 'USB 허브', price: 32000 },
  { id: 5, name: '모니터 받침대', price: 38000 },
];

const formatPrice = (price) => price.toLocaleString('ko-KR') + '원';

// ─── 장바구니 아이콘 (헤더용) ────────────────────────────────
/**
 * CartIcon — 현재 장바구니의 상품 수를 배지로 표시
 * 선택자로 totalCount만 구독 — items가 바뀌어도 count가 바뀔 때만 리렌더링
 */
function CartIcon() {
  // 선택자(selector)로 필요한 계산 함수만 구독
  const getTotalCount = useCartStore((state) => state.getTotalCount);
  const totalCount = getTotalCount(); // 계산 함수 호출

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ fontSize: '24px' }}>🛒</span>
      {totalCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          backgroundColor: '#ef4444',
          color: '#fff',
          borderRadius: '50%',
          width: '18px',
          height: '18px',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
        }}>
          {totalCount}
        </span>
      )}
    </div>
  );
}

// ─── 상품 목록 섹션 ──────────────────────────────────────────
/**
 * ProductList — 상품 목록을 표시하고 장바구니에 추가하는 섹션
 * addItem 액션만 구독 — 함수는 변하지 않으므로 리렌더링 없음
 */
function ProductList() {
  // 선택자로 addItem 액션만 가져옴
  const addItem = useCartStore((state) => state.addItem);
  // 현재 장바구니 items — 담기 버튼 활성화/비활성화를 위해 구독
  const cartItems = useCartStore((state) => state.items);

  // 특정 상품이 장바구니에 있는지 확인하는 함수
  const getItemQuantity = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div>
      <h2 style={{ color: '#1e293b', marginBottom: '16px' }}>상품 목록</h2>
      {PRODUCTS.map((product) => {
        const quantity = getItemQuantity(product.id);

        return (
          <div
            key={product.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              marginBottom: '8px',
              backgroundColor: '#fff',
            }}
          >
            <div>
              <div style={{ fontWeight: '600', color: '#111827' }}>{product.name}</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{formatPrice(product.price)}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* 현재 담긴 수량 표시 */}
              {quantity > 0 && (
                <span style={{ fontSize: '13px', color: '#3b82f6', fontWeight: '600' }}>
                  {quantity}개 담김
                </span>
              )}

              {/* addItem 액션 dispatch */}
              <button
                onClick={() => addItem(product)} // Zustand store의 addItem 호출
                style={{
                  padding: '7px 16px',
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
          </div>
        );
      })}
    </div>
  );
}

// ─── 장바구니 섹션 ───────────────────────────────────────────
/**
 * CartSection — 장바구니 항목 표시 및 수량 조절
 * items, removeItem, updateQuantity, clearCart 구독
 */
function CartSection() {
  // 필요한 상태와 액션을 선택자로 가져옴
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const totalPrice = getTotalPrice(); // 계산 함수 호출

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>장바구니 ({items.length}종)</h2>
        {items.length > 0 && (
          <button
            onClick={clearCart} // 전체 비우기
            style={{
              padding: '6px 12px',
              backgroundColor: '#fff',
              color: '#ef4444',
              border: '1px solid #fca5a5',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            전체 삭제
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: '8px' }}>
          장바구니가 비어있습니다.
        </div>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} style={{
              padding: '14px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              marginBottom: '8px',
              backgroundColor: '#fff',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#111827' }}>{item.name}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    {formatPrice(item.price)} × {item.quantity} = <strong style={{ color: '#1e293b' }}>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={() => removeItem(item.id)} // removeItem 액션
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '18px' }}
                >
                  ×
                </button>
              </div>

              {/* 수량 조절 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)} // 수량 감소
                  style={{ width: '28px', height: '28px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#f9fafb' }}
                >
                  -
                </button>
                <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)} // 수량 증가
                  style={{ width: '28px', height: '28px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#f9fafb' }}
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {/* 합계 */}
          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: '700',
            fontSize: '18px',
            color: '#1d4ed8',
          }}>
            <span>총 합계</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── CartPage — 메인 페이지 ──────────────────────────────────
export default function CartPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>

      {/* 헤더 */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '16px',
        marginBottom: '24px',
      }}>
        <h1 style={{ margin: 0, color: '#1e293b' }}>Zustand 장바구니</h1>
        {/* CartIcon도 같은 store를 구독 — Provider 없이 자동으로 동기화 */}
        <CartIcon />
      </header>

      {/* 본문 — 2열 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <ProductList />
        <CartSection />
      </div>

      {/* 안내 */}
      <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', fontSize: '13px', color: '#166534' }}>
        <strong>Zustand 특징:</strong> Context Provider 없이 어디서나 같은 store를 사용합니다.
        CartIcon, ProductList, CartSection 모두 useCartStore를 통해 같은 상태를 공유합니다.
      </div>
    </div>
  );
}
