import React, { useState, useEffect } from 'react';

// JSONPlaceholder API URL — 무료 가짜 REST API
const API_URL = 'https://jsonplaceholder.typicode.com/users';

/**
 * UserList 컴포넌트
 * useEffect로 JSONPlaceholder API에서 사용자 목록을 fetch하고
 * 로딩 / 에러 / 성공 세 가지 상태를 관리하는 예제
 */
function UserList() {
  // 사용자 목록 데이터 상태
  const [users, setUsers] = useState([]);
  // 로딩 상태 — 초기값 true (처음부터 로딩 시작)
  const [isLoading, setIsLoading] = useState(true);
  // 에러 메시지 상태
  const [error, setError] = useState(null);
  // 검색어 상태
  const [search, setSearch] = useState('');

  useEffect(() => {
    // AbortController: 컴포넌트 언마운트 시 진행 중인 fetch를 취소하기 위해 사용
    const controller = new AbortController();

    // async 함수를 useEffect 내부에 정의하고 즉시 호출하는 패턴
    // (useEffect 콜백 자체는 async가 될 수 없음)
    const fetchUsers = async () => {
      try {
        // 로딩 시작, 이전 에러 초기화
        setIsLoading(true);
        setError(null);

        // fetch API로 사용자 목록 요청
        // signal: controller.signal — 취소 신호를 fetch에 연결
        const response = await fetch(API_URL, { signal: controller.signal });

        // HTTP 응답이 실패(4xx, 5xx)인 경우 에러 처리
        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status}`);
        }

        // JSON 파싱
        const data = await response.json();
        setUsers(data);

      } catch (err) {
        // AbortError는 정상적인 취소이므로 에러로 처리하지 않음
        if (err.name === 'AbortError') return;
        setError(err.message);
      } finally {
        // 성공이든 실패든 로딩 상태 종료
        setIsLoading(false);
      }
    };

    fetchUsers();

    // 클린업 함수: 컴포넌트 언마운트 시 fetch 취소
    // 이걸 안 하면 언마운트된 컴포넌트의 state를 변경하려 해서 경고 발생
    return () => {
      controller.abort();
    };
  }, []); // 빈 배열: 마운트 시 한 번만 실행

  // 검색어로 사용자 필터링 (클라이언트 사이드 필터링)
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  // ── 조건부 렌더링 ──────────────────────────────────────

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: '32px' }}>⏳</div>
        <p style={{ color: '#6b7280', marginTop: '8px' }}>사용자 목록을 불러오는 중...</p>
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: '32px' }}>❌</div>
        <p style={{ color: '#ef4444', marginTop: '8px' }}>오류: {error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{ marginTop: '12px', padding: '8px 16px', cursor: 'pointer' }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 성공 시
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '20px' }}>사용자 목록</h1>

      {/* 검색 입력 */}
      <input
        type="text"
        placeholder="이름 또는 이메일로 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          marginBottom: '16px',
          boxSizing: 'border-box',
        }}
      />

      {/* 검색 결과가 없을 때 */}
      {filteredUsers.length === 0 && (
        <p style={{ color: '#6b7280', textAlign: 'center' }}>
          "{search}"에 해당하는 사용자가 없습니다.
        </p>
      )}

      {/* 사용자 카드 목록 */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {filteredUsers.map((user) => (
          <li
            key={user.id} // key는 목록의 각 항목을 고유하게 식별
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            {/* 사용자 이름과 아이디 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '16px', color: '#111827' }}>{user.name}</strong>
                <span style={{ marginLeft: '8px', fontSize: '12px', color: '#9ca3af' }}>
                  @{user.username}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#d1d5db' }}>#{user.id}</span>
            </div>

            {/* 이메일과 회사 */}
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#6b7280' }}>
              <div>📧 {user.email}</div>
              <div>🏢 {user.company.name}</div>
              <div>🌐 {user.website}</div>
            </div>
          </li>
        ))}
      </ul>

      <p style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'right' }}>
        총 {filteredUsers.length}명 (전체 {users.length}명)
      </p>
    </div>
  );
}

export default UserList;
