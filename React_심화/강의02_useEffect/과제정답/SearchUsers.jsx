import React, { useState, useEffect } from 'react';

/**
 * SearchUsers — 실시간 사용자 검색 컴포넌트 (과제 정답)
 *
 * 입력할 때마다 useEffect가 실행되어 API를 호출하고
 * 클라이언트에서 이름/이메일로 필터링합니다.
 */
function SearchUsers() {
  // 검색어 state — input의 value와 동기화
  const [query, setQuery] = useState('');

  // 필터링된 검색 결과 state
  const [results, setResults] = useState([]);

  // 로딩 상태 — API 호출 중이면 true
  const [isLoading, setIsLoading] = useState(false);

  // 에러 메시지 — 정상이면 null
  const [error, setError] = useState(null);

  // query가 바뀔 때마다 useEffect 실행
  useEffect(() => {
    // 검색어가 빈 문자열(공백 포함)이면 API 호출 안 함
    const trimmedQuery = query.trim();
    if (trimmedQuery === '') {
      // 결과 초기화하고 effect 종료
      setResults([]);
      setError(null);
      return;
    }

    // AbortController: query가 빠르게 바뀔 때 이전 요청을 취소
    // 예: 'a', 'ab', 'abc' 순으로 빠르게 입력하면
    //     'a', 'ab' 요청은 클린업에서 취소되고 'abc' 요청만 처리됨
    const controller = new AbortController();

    const fetchAndFilter = async () => {
      try {
        setIsLoading(true); // 로딩 시작
        setError(null);     // 이전 에러 초기화

        // JSONPlaceholder 전체 사용자 목록 가져오기
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users',
          { signal: controller.signal } // 취소 신호 연결
        );

        // HTTP 오류 처리
        if (!response.ok) {
          throw new Error(`서버 오류 (${response.status})`);
        }

        const allUsers = await response.json();

        // 클라이언트 필터링 — 이름 또는 이메일에 검색어 포함 여부
        // toLowerCase()로 대소문자 구분 없이 검색
        const filtered = allUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(trimmedQuery.toLowerCase())
        );

        setResults(filtered); // 필터링된 결과 저장

      } catch (err) {
        // AbortError는 정상적인 취소 — 에러로 처리하지 않음
        if (err.name === 'AbortError') return;
        setError(err.message);
      } finally {
        // 성공이든 에러든 로딩 종료 (AbortError 제외)
        setIsLoading(false);
      }
    };

    fetchAndFilter();

    // 클린업 함수: query가 바뀌면 이전 요청 취소
    // 의존성 배열의 값이 바뀌기 전에 React가 클린업을 먼저 호출함
    return () => {
      controller.abort();
    };

  }, [query]); // query가 바뀔 때마다 실행 — 핵심 의존성

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '4px' }}>사용자 검색</h1>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>
        입력할 때마다 API를 호출합니다 (디바운스 없는 버전)
      </p>

      {/* 검색 입력창 */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // state 업데이트 → useEffect 재실행
        placeholder="이름 또는 이메일 입력..."
        style={{
          width: '100%',
          padding: '10px 14px',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          fontSize: '15px',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
        onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
      />

      {/* 상태별 조건부 렌더링 */}
      <div style={{ marginTop: '16px' }}>

        {/* 검색어가 없을 때 안내 메시지 */}
        {query.trim() === '' && (
          <p style={{ color: '#9ca3af', textAlign: 'center', fontSize: '14px' }}>
            검색어를 입력하면 결과가 나타납니다.
          </p>
        )}

        {/* 로딩 중 */}
        {isLoading && (
          <p style={{ color: '#3b82f6', textAlign: 'center' }}>🔍 검색 중...</p>
        )}

        {/* 에러 발생 */}
        {error && !isLoading && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444' }}>오류: {error}</p>
            {/* 다시 시도: query를 강제로 재설정해 useEffect 재실행 */}
            <button
              onClick={() => {
                const current = query;
                setQuery('');
                setTimeout(() => setQuery(current), 0);
              }}
              style={{
                padding: '6px 14px',
                border: '1px solid #ef4444',
                borderRadius: '6px',
                color: '#ef4444',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 결과 없음 (로딩 중이 아니고 검색어 있고 에러 없음) */}
        {!isLoading && !error && query.trim() !== '' && results.length === 0 && (
          <p style={{ color: '#6b7280', textAlign: 'center' }}>
            "{query}"에 해당하는 사용자가 없습니다.
          </p>
        )}

        {/* 검색 결과 목록 */}
        {!isLoading && results.length > 0 && (
          <>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
              {results.length}명 검색됨
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {results.map((user) => (
                <li
                  key={user.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    marginBottom: '8px',
                    backgroundColor: '#f9fafb',
                  }}
                >
                  {/* 이름 — 검색어 부분을 강조 표시 (선택 구현) */}
                  <strong style={{ color: '#111827' }}>{user.name}</strong>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                    {user.email}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchUsers;
