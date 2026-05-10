/**
 * cartStore.js — Zustand로 구현한 장바구니 전역 상태
 *
 * 설치: npm install zustand
 *
 * Zustand의 특징:
 * - Provider 없이 어디서든 사용 가능
 * - 선택자(selector)로 필요한 상태만 구독
 * - set()으로 상태 변경, get()으로 현재 상태 읽기
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware'; // Redux DevTools 연동

/**
 * useCartStore — 장바구니 전역 상태 store
 *
 * 상태:
 *   items: { id, name, price, quantity }[] — 장바구니 항목 목록
 *
 * 액션:
 *   addItem(product) — 상품 추가 (이미 있으면 수량 증가)
 *   removeItem(id) — 상품 제거
 *   updateQuantity(id, quantity) — 수량 변경 (0 이하면 제거)
 *   clearCart() — 전체 비우기
 *
 * 계산 함수:
 *   getTotalPrice() — 총 금액 (get()으로 현재 상태 접근)
 *   getTotalCount() — 총 상품 수
 */
const useCartStore = create(
  // devtools로 감싸면 Redux DevTools에서 상태 변화를 실시간으로 확인 가능
  devtools(
    (set, get) => ({
      // ── 상태 ──────────────────────────────────────────────
      items: [], // 장바구니 항목 배열

      // ── 액션 ──────────────────────────────────────────────

      /**
       * addItem — 상품을 장바구니에 추가
       * 이미 있는 상품이면 수량만 1 증가
       * @param {{ id, name, price }} product
       */
      addItem: (product) =>
        set(
          (state) => {
            // 이미 장바구니에 있는지 확인
            const existingItem = state.items.find((item) => item.id === product.id);

            if (existingItem) {
              // 있으면 수량 증가 — map으로 새 배열 생성 (불변성 유지)
              return {
                items: state.items.map((item) =>
                  item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
              };
            }

            // 없으면 새 항목 추가
            return {
              items: [...state.items, { ...product, quantity: 1 }],
            };
          },
          false,       // 상태를 교체하지 않고 병합
          'addItem'    // DevTools에 표시될 액션 이름
        ),

      /**
       * removeItem — 특정 상품을 장바구니에서 제거
       * @param {number} id - 제거할 상품 ID
       */
      removeItem: (id) =>
        set(
          (state) => ({
            items: state.items.filter((item) => item.id !== id),
          }),
          false,
          'removeItem'
        ),

      /**
       * updateQuantity — 특정 상품의 수량 변경
       * 수량이 0 이하이면 장바구니에서 제거
       * @param {number} id - 상품 ID
       * @param {number} quantity - 새 수량
       */
      updateQuantity: (id, quantity) =>
        set(
          (state) => {
            if (quantity <= 0) {
              // 수량이 0 이하이면 목록에서 제거
              return { items: state.items.filter((item) => item.id !== id) };
            }
            return {
              items: state.items.map((item) =>
                item.id === id ? { ...item, quantity } : item
              ),
            };
          },
          false,
          'updateQuantity'
        ),

      /**
       * clearCart — 장바구니 전체 비우기
       */
      clearCart: () =>
        set({ items: [] }, false, 'clearCart'),

      // ── 계산 함수 (get()으로 현재 상태 접근) ──────────────

      /**
       * getTotalPrice — 총 금액 계산
       * @returns {number}
       */
      getTotalPrice: () => {
        const { items } = get(); // 현재 상태 접근
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      /**
       * getTotalCount — 총 상품 수 계산
       * @returns {number}
       */
      getTotalCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    { name: 'CartStore' } // DevTools에 표시되는 store 이름
  )
);

export default useCartStore;
