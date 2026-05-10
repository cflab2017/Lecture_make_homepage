import { useState, useEffect } from 'react';

/**
 * useFetch — 데이터 fetch 로직을 재사용 가능한 커스텀 훅
 *
 * URL이 바뀌면 자동으로 다시 fetch합니다.
 * 컴포넌트 언마운트 시 진행 중인 요청을 자동으로 취소합니다.
 *
 * @param {string | null} url - fetch할 URL. null이면 fetch 안 함.
 * @returns {{ data: any, isLoading: boolean, error: string | null, refetch: function }}
 *
 * @example
 * function UserList() {
 *   const { data: users, isLoading, error } = useFetch('https://jsonplaceholder.typicode.com/users');
 *   if (isLoading) return <p>로딩 중...</p>;
 *   if (error) return <p>오류: {error}</p>;
 *   return <ul>{users?.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
 * }
 */
function useFetch(url) {
  // fetch 결과 데이터
  const [data, setData] = useState(null);

  // 로딩 상태 — url이 있으면 처음부터 로딩 상태로 시작
  const [isLoading, setIsLoading] = useState(Boolean(url));

  // 에러 메시지
  const [error, setError] = useState(null);

  // refetch를 트리거하는 카운터 — refetch() 호출 시 이 값을 증가시켜 useEffect 재실행
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    // url이 없으면 fetch 안 함 (early return)
    if (!url) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // 요청 취소를 위한 AbortController
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        // 로딩 시작, 이전 에러 초기화
        setIsLoading(true);
        setError(null);

        const response = await fetch(url, {
          signal: controller.signal, // 취소 신호 연결
        });

        // HTTP 에러 처리 (4xx, 5xx)
        if (!response.ok) {
          throw new Error(`HTTP 오류: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        setData(json);

      } catch (err) {
        // AbortError: 컴포넌트 언마운트 또는 URL 변경으로 인한 정상 취소
        if (err.name === 'AbortError') return;
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // 클린업: URL이 바뀌거나 컴포넌트 언마운트 시 이전 요청 취소
    return () => {
      controller.abort();
    };

  }, [url, refetchIndex]); // url 또는 refetchIndex가 바뀔 때마다 재실행

  /**
   * refetch — 같은 URL로 다시 fetch
   * 오류 발생 후 재시도할 때 사용
   */
  const refetch = () => {
    setRefetchIndex((prev) => prev + 1); // 카운터 증가 → useEffect 재실행
  };

  return { data, isLoading, error, refetch };
}

export default useFetch;
