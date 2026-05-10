import { useState, useEffect } from 'react';

/**
 * useDebounce — 값의 변화를 delay ms만큼 지연시키는 커스텀 훅
 *
 * 입력이 연속으로 발생할 때(타이핑 등) 마지막 입력 후 delay ms가 지나야
 * debouncedValue가 업데이트됩니다.
 * 검색 API 호출 횟수를 줄이는 데 주로 사용합니다.
 *
 * @param {any} value - 디바운스할 값 (검색어, 슬라이더 값 등)
 * @param {number} delay - 지연 시간(ms), 기본값 500ms
 * @returns {any} delay ms 동안 변하지 않은 값 (debouncedValue)
 *
 * @example
 * const debouncedSearch = useDebounce(searchQuery, 500);
 * useEffect(() => {
 *   if (debouncedSearch) fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
function useDebounce(value, delay = 500) {
  // 디바운스된 값 state — 처음에는 전달받은 value와 동일하게 초기화
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // value가 바뀌면 delay ms 후에 debouncedValue를 업데이트하는 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value); // delay ms 후에 실행
    }, delay);

    // 클린업 함수: value가 delay 이내에 다시 바뀌면 이전 타이머를 취소
    // 이것이 디바운스의 핵심 — 연속 입력 시 이전 타이머가 계속 취소됨
    return () => {
      clearTimeout(timer);
    };

    // value 또는 delay가 바뀔 때마다 이 effect를 재실행
    // value가 바뀌면 → 이전 타이머 취소(클린업) → 새 타이머 시작
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;


// ─── 사용 예시 컴포넌트 ──────────────────────────────────────
// 아래는 useDebounce를 활용한 검색 컴포넌트입니다.
// 실제 사용 시에는 별도 파일로 분리하세요.

import React, { useState } from 'react';

/**
 * DebouncedSearch — useDebounce를 활용해 API 호출 횟수를 최소화하는 검색 컴포넌트
 *
 * 비교:
 * - 강의02 SearchUsers: 입력할 때마다 API 호출 (디바운스 없음)
 * - 이 컴포넌트: 입력 후 500ms가 지나야 API 호출 (디바운스 있음)
 */
export function DebouncedSearch() {
  // 입력창의 실시간 값 — 입력할 때마다 즉시 업데이트
  const [query, setQuery] = useState('');

  // API 호출 횟수 카운터 (비교 목적)
  const [callCount, setCallCount] = useState(0);

  // 검색 결과
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // useDebounce: query가 500ms 동안 변하지 않을 때만 debouncedQuery가 업데이트됨
  const debouncedQuery = useDebounce(query, 500);

  // debouncedQuery가 바뀔 때만 API 호출
  // 빠르게 타이핑해도 멈출 때까지 API를 호출하지 않음
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const search = async () => {
      setIsLoading(true);
      // API 호출 횟수 증가 (얼마나 효율적인지 확인)
      setCallCount((prev) => prev + 1);

      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users',
          { signal: controller.signal }
        );
        const allUsers = await response.json();

        // 클라이언트 필터링
        const filtered = allUsers.filter((user) =>
          user.name.toLowerCase().includes(debouncedQuery.toLowerCase())
        );

        setResults(filtered);
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    search();
    return () => controller.abort();

  }, [debouncedQuery]); // debouncedQuery가 바뀔 때만 실행 — 핵심!

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#1e293b', marginBottom: '4px' }}>디바운스 검색</h2>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>
        빠르게 타이핑해도 멈춘 후 500ms 뒤에만 API를 호출합니다.
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // 입력창은 즉시 업데이트
        placeholder="이름 검색 (타이핑 후 0.5초 대기)..."
        style={{
          width: '100%',
          padding: '10px 14px',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          fontSize: '15px',
          boxSizing: 'border-box',
          marginBottom: '12px',
        }}
      />

      {/* 디바운스 상태 시각화 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        marginBottom: '16px',
        fontSize: '13px',
      }}>
        <div style={{ padding: '8px 12px', backgroundColor: '#fef3c7', borderRadius: '6px' }}>
          <strong>입력값:</strong> "{query}"
        </div>
        <div style={{ padding: '8px 12px', backgroundColor: '#dcfce7', borderRadius: '6px' }}>
          <strong>디바운스값:</strong> "{debouncedQuery}"
        </div>
      </div>

      {/* API 호출 횟수 표시 */}
      <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 12px' }}>
        API 호출 횟수: <strong style={{ color: '#7c3aed' }}>{callCount}회</strong>
        {callCount > 0 && (
          <span style={{ marginLeft: '8px', color: '#16a34a' }}>
            (디바운스 없으면 훨씬 많았을 것)
          </span>
        )}
      </p>

      {/* 검색 결과 */}
      {isLoading && <p style={{ color: '#3b82f6' }}>검색 중...</p>}

      {!isLoading && debouncedQuery && results.length === 0 && (
        <p style={{ color: '#9ca3af' }}>검색 결과가 없습니다.</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {results.map((user) => (
          <li key={user.id} style={{
            padding: '10px 14px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            marginBottom: '6px',
            backgroundColor: '#f9fafb',
          }}>
            <strong>{user.name}</strong>
            <span style={{ marginLeft: '8px', fontSize: '12px', color: '#9ca3af' }}>{user.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
