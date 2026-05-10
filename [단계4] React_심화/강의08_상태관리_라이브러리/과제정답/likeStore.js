/**
 * likeStore.js — 좋아요 기능 전역 상태 (Zustand)
 *
 * 여러 컴포넌트에서 같은 좋아요 수를 공유합니다.
 * Context Provider 없이 어디서나 uselikeStore()로 접근 가능합니다.
 *
 * 설치: npm install zustand
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * useLikeStore — 좋아요 전역 상태 store
 */
const useLikeStore = create(
  devtools(
    (set, get) => ({
      // ── 상태 ──────────────────────────────────────────────

      // 각 게시물의 좋아요 수 — { [postId]: count } 형태
      likes: {
        post1: 12, // 초기값으로 기존 좋아요 수가 있다고 가정
        post2: 7,
        post3: 24,
      },

      // 현재 사용자가 좋아요를 누른 게시물 ID 목록
      likedPosts: [],

      // ── 액션 ──────────────────────────────────────────────

      /**
       * toggleLike — 특정 게시물의 좋아요를 토글
       * 이미 눌렀으면 취소, 안 눌렀으면 추가
       * @param {string} postId - 게시물 ID
       */
      toggleLike: (postId) =>
        set(
          (state) => {
            // 현재 이 게시물에 좋아요를 눌렀는지 확인
            const isCurrentlyLiked = state.likedPosts.includes(postId);

            if (isCurrentlyLiked) {
              // 이미 눌렀으면 취소 — 수 감소, likedPosts에서 제거
              return {
                likes: {
                  ...state.likes,
                  // 0 이하가 되지 않도록 Math.max로 보호
                  [postId]: Math.max(0, (state.likes[postId] || 0) - 1),
                },
                likedPosts: state.likedPosts.filter((id) => id !== postId),
              };
            } else {
              // 아직 안 눌렀으면 좋아요 추가 — 수 증가, likedPosts에 추가
              return {
                likes: {
                  ...state.likes,
                  [postId]: (state.likes[postId] || 0) + 1,
                },
                likedPosts: [...state.likedPosts, postId],
              };
            }
          },
          false,
          'toggleLike'
        ),

      /**
       * getLikeCount — 특정 게시물의 좋아요 수 반환
       * get()으로 현재 상태에 접근
       * @param {string} postId
       * @returns {number}
       */
      getLikeCount: (postId) => {
        return get().likes[postId] || 0; // 없으면 0 반환
      },

      /**
       * isLiked — 현재 사용자가 특정 게시물에 좋아요를 눌렀는지 여부
       * @param {string} postId
       * @returns {boolean}
       */
      isLiked: (postId) => {
        return get().likedPosts.includes(postId);
      },

      /**
       * getTotalLikes — 모든 게시물의 좋아요 수 합계
       * @returns {number}
       */
      getTotalLikes: () => {
        return Object.values(get().likes).reduce((sum, count) => sum + count, 0);
      },
    }),
    { name: 'LikeStore' }
  )
);

export default useLikeStore;
