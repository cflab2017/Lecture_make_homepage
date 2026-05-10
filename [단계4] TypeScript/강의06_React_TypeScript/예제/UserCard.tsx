// ===================================================
// 강의 06 예제 3 — UserCard 컴포넌트 (TypeScript)
// API 응답 타입 지정 + 조건부 렌더링 타입 안전
// ===================================================

import React, { useState, useEffect } from 'react';

// API에서 받아오는 유저 타입 (JSONPlaceholder 형식)
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
    catchPhrase: string;
  };
}

// UserCard Props
interface UserCardProps {
  userId: number;
  showDetails?: boolean; // 상세 정보 표시 여부 (선택적)
}

// 로딩 상태 타입 — 리터럴 유니온
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// UserCard 컴포넌트
const UserCard: React.FC<UserCardProps> = ({ userId, showDetails = false }) => {
  // 각 상태에 타입 명시
  const [user, setUser] = useState<User | null>(null);              // 유저 데이터
  const [loadingState, setLoadingState] = useState<LoadingState>('idle'); // 로딩 상태
  const [error, setError] = useState<string | null>(null);          // 에러 메시지
  const [isExpanded, setIsExpanded] = useState<boolean>(showDetails); // 상세 토글

  // useEffect: 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    setLoadingState('loading');
    setError(null);

    // fetch 응답 타입을 제네릭으로 지정
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP 오류: ${res.status}`);
        return res.json() as Promise<User>; // 타입 단언으로 응답 타입 지정
      })
      .then((data: User) => {
        setUser(data);
        setLoadingState('success');
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoadingState('error');
      });
  }, [userId]); // userId 변경 시 재실행

  // 로딩 상태별 렌더링
  if (loadingState === 'loading') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>유저 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (loadingState === 'error' || !user) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <p>오류 발생: {error}</p>
      </div>
    );
  }

  // 성공 시 렌더링 — TypeScript가 user가 null이 아님을 앎
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '350px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* 기본 정보 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* 아바타 — 이름 첫 글자 */}
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#0066cc',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3 style={{ margin: 0 }}>{user.name}</h3>
          <p style={{ margin: 0, color: '#666' }}>@{user.username}</p>
        </div>
      </div>

      {/* 기본 연락처 */}
      <div style={{ marginTop: '12px', fontSize: '14px' }}>
        <p>📧 {user.email}</p>
        <p>🌐 {user.website}</p>
      </div>

      {/* 상세 정보 토글 버튼 */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)} // 이전 상태를 기반으로 토글
        style={{
          background: 'none',
          border: '1px solid #0066cc',
          color: '#0066cc',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          marginTop: '8px',
        }}
      >
        {isExpanded ? '상세 정보 접기' : '상세 정보 보기'}
      </button>

      {/* 상세 정보 (조건부 렌더링) */}
      {isExpanded && (
        <div style={{ marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '12px', fontSize: '14px' }}>
          <h4 style={{ margin: '0 0 8px' }}>주소</h4>
          <p style={{ margin: '2px 0' }}>
            {user.address.street}, {user.address.suite}
          </p>
          <p style={{ margin: '2px 0' }}>
            {user.address.city} {user.address.zipcode}
          </p>

          <h4 style={{ margin: '12px 0 8px' }}>회사</h4>
          <p style={{ margin: '2px 0', fontWeight: 'bold' }}>{user.company.name}</p>
          <p style={{ margin: '2px 0', color: '#666', fontStyle: 'italic' }}>
            "{user.company.catchPhrase}"
          </p>
        </div>
      )}
    </div>
  );
};

// 사용 예시
/*
export default function App() {
  return (
    <div style={{ padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <UserCard userId={1} />
      <UserCard userId={2} showDetails={true} />
      <UserCard userId={3} />
    </div>
  );
}
*/

export default UserCard;
