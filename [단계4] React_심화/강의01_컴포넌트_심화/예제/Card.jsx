import React from 'react';

/**
 * Card 컴포넌트 — children props 패턴 예제
 * 카드 레이아웃을 제공하고 내부 내용은 children으로 자유롭게 구성
 *
 * @param {React.ReactNode} children - 카드 내부에 들어올 모든 JSX
 * @param {string} shadow - 'sm' | 'md' | 'lg' — 그림자 강도
 * @param {object} style - 추가 인라인 스타일 (선택)
 */
function Card({ children, shadow = 'md', style = {} }) {
  // 그림자 강도별 CSS 값 매핑
  const shadowMap = {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: shadowMap[shadow] || shadowMap.md,
    ...style, // 외부에서 전달한 스타일로 덮어쓸 수 있음
  };

  return <div style={cardStyle}>{children}</div>;
}

// Card를 구성하는 서브 컴포넌트들 — 컴포넌트 합성 패턴
function CardHeader({ children }) {
  return (
    <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '12px' }}>
      {children}
    </div>
  );
}

function CardBody({ children }) {
  return <div style={{ color: '#374151', lineHeight: '1.6' }}>{children}</div>;
}

function CardFooter({ children }) {
  return (
    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '12px' }}>
      {children}
    </div>
  );
}

// 사용 예시
export default function CardExample() {
  return (
    <div style={{ display: 'flex', gap: '16px', padding: '20px', flexWrap: 'wrap' }}>

      {/* 기본 Card — children으로 아무거나 넣을 수 있음 */}
      <Card style={{ width: '280px' }}>
        <h2 style={{ margin: '0 0 8px' }}>기본 카드</h2>
        <p style={{ margin: 0, color: '#6b7280' }}>children props로 자유롭게 내용 구성</p>
      </Card>

      {/* 서브 컴포넌트를 활용한 구조적인 카드 */}
      <Card shadow="lg" style={{ width: '280px' }}>
        <CardHeader>
          <h2 style={{ margin: 0, fontSize: '18px' }}>구조적 카드</h2>
        </CardHeader>
        <CardBody>
          <p style={{ margin: 0 }}>CardHeader, CardBody, CardFooter를 조합해 구조적인 카드를 만듭니다.</p>
        </CardBody>
        <CardFooter>
          <button style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            자세히 보기
          </button>
        </CardFooter>
      </Card>

      {/* 이미지 카드 — children이 무엇이든 카드 스타일 적용 */}
      <Card shadow="sm" style={{ width: '280px', padding: 0, overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#dbeafe', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
          🖼️
        </div>
        <div style={{ padding: '16px' }}>
          <h3 style={{ margin: '0 0 8px' }}>이미지 카드</h3>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>padding을 0으로 두고 내부에서 직접 padding 조절</p>
        </div>
      </Card>

    </div>
  );
}

export { Card, CardHeader, CardBody, CardFooter };
