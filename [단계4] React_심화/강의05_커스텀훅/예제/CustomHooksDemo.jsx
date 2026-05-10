import React, { useState } from 'react';
import useFetch from './hooks/useFetch';
import useLocalStorage from './hooks/useLocalStorage';

// ─── useFetch 사용 예제 ───────────────────────────────────────
/**
 * UseFetchDemo — useFetch 커스텀 훅을 사용해 JSONPlaceholder에서 게시물 가져오기
 * 데이터 fetch 로직이 단 한 줄로 해결됨
 */
function UseFetchDemo() {
  const [postId, setPostId] = useState(1);

  // useFetch에 URL을 전달하면 데이터, 로딩, 에러 상태를 모두 자동 관리
  const { data: post, isLoading, error, refetch } = useFetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );

  return (
    <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '10px', marginBottom: '20px' }}>
      <h2 style={{ marginTop: 0, color: '#1e293b' }}>useFetch 예제</h2>

      {/* 게시물 ID 선택 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map((id) => (
          <button
            key={id}
            onClick={() => setPostId(id)} // postId 변경 → URL 변경 → useFetch 재실행
            style={{
              padding: '6px 14px',
              backgroundColor: postId === id ? '#3b82f6' : '#f1f5f9',
              color: postId === id ? '#fff' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            게시물 {id}
          </button>
        ))}
        {/* refetch — 같은 URL로 다시 요청 */}
        <button
          onClick={refetch}
          style={{ padding: '6px 14px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          🔄 새로고침
        </button>
      </div>

      {/* 로딩 / 에러 / 성공 조건부 렌더링 */}
      {isLoading && <p style={{ color: '#3b82f6' }}>로딩 중...</p>}
      {error && <p style={{ color: '#ef4444' }}>오류: {error}</p>}
      {post && !isLoading && (
        <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', color: '#1e293b' }}>{post.title}</h3>
          <p style={{ margin: 0, color: '#64748b', lineHeight: 1.6 }}>{post.body}</p>
        </div>
      )}
    </div>
  );
}

// ─── useLocalStorage 사용 예제 ───────────────────────────────
/**
 * UseLocalStorageDemo — useLocalStorage로 새로고침 후에도 값 유지
 * 실제로 브라우저 새로고침을 해보면 값이 남아있는 것을 확인할 수 있음
 */
function UseLocalStorageDemo() {
  // useLocalStorage — useState처럼 사용하지만 localStorage에 자동 저장
  const [name, setName, removeName] = useLocalStorage('demo-name', '');
  const [theme, setTheme] = useLocalStorage('demo-theme', 'light');

  return (
    <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '10px', marginBottom: '20px' }}>
      <h2 style={{ marginTop: 0, color: '#1e293b' }}>useLocalStorage 예제</h2>
      <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px' }}>
        값을 입력하고 브라우저를 새로고침해도 값이 유지됩니다.
      </p>

      {/* 이름 저장 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
          이름 (localStorage에 저장)
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
          />
          <button
            onClick={removeName} // removeValue — localStorage에서 삭제
            style={{ padding: '8px 14px', backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
          >
            삭제
          </button>
        </div>
        {name && (
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#16a34a' }}>
            저장된 이름: <strong>{name}</strong>
          </p>
        )}
      </div>

      {/* 테마 토글 */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
          테마 설정
        </label>
        <button
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          style={{
            padding: '8px 18px',
            backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
            color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {theme === 'light' ? '🌙 다크로 변경' : '☀️ 라이트로 변경'}
        </button>
        <span style={{ marginLeft: '12px', fontSize: '13px', color: '#64748b' }}>
          현재: {theme}
        </span>
      </div>
    </div>
  );
}

// ─── 통합 데모 앱 ────────────────────────────────────────────
export default function CustomHooksDemo() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '24px' }}>커스텀 훅 예제</h1>
      <UseFetchDemo />
      <UseLocalStorageDemo />
    </div>
  );
}
