/**
 * LikeButton.jsx — Zustand likeStore를 사용하는 좋아요 기능
 *
 * LikeButton과 LikeSummary가 같은 store를 구독하므로
 * 한 곳에서 좋아요를 누르면 모든 곳에서 즉시 업데이트됩니다.
 */

import React from 'react';
import useLikeStore from './likeStore';

// 더미 게시물 데이터
const POSTS = [
  { id: 'post1', title: 'React 심화 강의 시작', author: '김철수', content: 'useEffect부터 상태 관리까지 다양한 패턴을 학습합니다.' },
  { id: 'post2', title: 'Zustand로 전역 상태 관리', author: '이영희', content: 'Context 없이도 간단하게 전역 상태를 관리할 수 있습니다.' },
  { id: 'post3', title: '커스텀 훅의 모든 것', author: '박민준', content: '재사용 가능한 로직을 커스텀 훅으로 추출하는 방법을 알아봅니다.' },
];

// ─── LikeButton 컴포넌트 ─────────────────────────────────────
/**
 * LikeButton — 좋아요 토글 버튼
 * 좋아요 상태와 수를 store에서 가져옴
 *
 * @param {string} postId - 게시물 ID
 */
function LikeButton({ postId }) {
  // 선택자로 필요한 것만 구독
  const toggleLike = useLikeStore((state) => state.toggleLike);
  const getLikeCount = useLikeStore((state) => state.getLikeCount);
  const isLiked = useLikeStore((state) => state.isLiked);

  // 함수를 호출해 현재 값 가져오기
  const likeCount = getLikeCount(postId);
  const liked = isLiked(postId);

  return (
    <button
      onClick={() => toggleLike(postId)} // toggleLike 액션 호출
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        backgroundColor: liked ? '#fef2f2' : '#f1f5f9', // 좋아요 여부에 따라 색상 변경
        color: liked ? '#dc2626' : '#64748b',
        border: `1px solid ${liked ? '#fca5a5' : '#e2e8f0'}`,
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: liked ? '600' : '400',
        transition: 'all 0.2s',
      }}
    >
      {/* 좋아요 아이콘 — 좋아요 눌렀으면 꽉 찬 하트, 아니면 빈 하트 */}
      <span style={{ fontSize: '16px' }}>{liked ? '❤️' : '🤍'}</span>
      {likeCount}
    </button>
  );
}

// ─── PostCard 컴포넌트 ───────────────────────────────────────
/**
 * PostCard — 게시물 카드 (LikeButton 포함)
 */
function PostCard({ post }) {
  return (
    <article style={{
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      padding: '20px',
      backgroundColor: '#ffffff',
      marginBottom: '12px',
    }}>
      <h3 style={{ margin: '0 0 6px', color: '#1e293b' }}>{post.title}</h3>
      <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: '14px' }}>{post.content}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: '#94a3b8' }}>{post.author}</span>
        {/* LikeButton에 postId 전달 */}
        <LikeButton postId={post.id} />
      </div>
    </article>
  );
}

// ─── PostFeed 컴포넌트 ───────────────────────────────────────
/**
 * PostFeed — 게시물 목록
 */
function PostFeed() {
  return (
    <div>
      <h2 style={{ color: '#1e293b', marginBottom: '16px' }}>게시물</h2>
      {POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// ─── LikeSummary 컴포넌트 ────────────────────────────────────
/**
 * LikeSummary — 각 게시물의 좋아요 수 요약
 *
 * PostFeed와 완전히 분리된 컴포넌트지만
 * 같은 likeStore를 구독하므로 LikeButton 클릭 시 즉시 업데이트됨
 * Context 없이 자동 동기화!
 */
function LikeSummary() {
  // likes 상태 전체를 구독
  const likes = useLikeStore((state) => state.likes);
  const likedPosts = useLikeStore((state) => state.likedPosts);
  const getTotalLikes = useLikeStore((state) => state.getTotalLikes);

  const totalLikes = getTotalLikes();

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      padding: '20px',
      backgroundColor: '#f8fafc',
    }}>
      <h2 style={{ color: '#1e293b', marginBottom: '16px' }}>
        좋아요 요약
        <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '400', marginLeft: '8px' }}>
          (PostFeed와 별개 컴포넌트지만 동기화됨)
        </span>
      </h2>

      {/* 각 게시물별 좋아요 수 */}
      {POSTS.map((post) => (
        <div key={post.id} style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 0',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '14px',
        }}>
          <span style={{ color: '#374151' }}>{post.title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* 내가 좋아요 누른 게시물 표시 */}
            {likedPosts.includes(post.id) && (
              <span style={{ fontSize: '12px', color: '#dc2626', backgroundColor: '#fef2f2', padding: '2px 8px', borderRadius: '10px' }}>
                좋아요 함
              </span>
            )}
            <span style={{ fontWeight: '600', color: '#dc2626' }}>
              ❤️ {likes[post.id] || 0}
            </span>
          </div>
        </div>
      ))}

      {/* 합계 */}
      <div style={{
        marginTop: '12px',
        paddingTop: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: '700',
        color: '#dc2626',
      }}>
        <span>전체 좋아요</span>
        <span>❤️ {totalLikes}</span>
      </div>
    </div>
  );
}

// ─── 메인 앱 ─────────────────────────────────────────────────
/**
 * 최상위 앱 컴포넌트
 * Context Provider 없이도 PostFeed와 LikeSummary가 같은 상태를 공유
 */
export default function App() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '4px' }}>Zustand 좋아요 기능</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
        Provider 없이도 LikeButton과 LikeSummary가 같은 전역 상태를 공유합니다.
      </p>

      {/* 2열 레이아웃 */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px' }}>
        <PostFeed />
        <LikeSummary />
      </div>
    </div>
  );
}

export { LikeButton };
