import React from 'react';

// variant prop에 따라 다른 스타일을 가진 재사용 가능한 버튼 컴포넌트
const styles = {
  base: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'opacity 0.2s',
  },
  primary: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  },
  secondary: {
    backgroundColor: '#6b7280',
    color: '#ffffff',
  },
  danger: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#3b82f6',
    border: '2px solid #3b82f6',
  },
};

/**
 * Button 컴포넌트
 * @param {string} variant - 'primary' | 'secondary' | 'danger' | 'outline'
 * @param {function} onClick - 클릭 핸들러
 * @param {boolean} disabled - 비활성화 여부
 * @param {React.ReactNode} children - 버튼 내부 텍스트 또는 요소
 */
function Button({ variant = 'primary', onClick, disabled = false, children }) {
  // variant에 해당하는 스타일이 없으면 primary로 폴백
  const variantStyle = styles[variant] || styles.primary;

  const buttonStyle = {
    ...styles.base,
    ...variantStyle,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <button style={buttonStyle} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// 사용 예시 — App에서 import해서 사용
export default function ButtonExample() {
  return (
    <div style={{ display: 'flex', gap: '8px', padding: '20px', flexWrap: 'wrap' }}>
      <Button variant="primary" onClick={() => alert('Primary 클릭!')}>
        Primary 버튼
      </Button>

      <Button variant="secondary" onClick={() => alert('Secondary 클릭!')}>
        Secondary 버튼
      </Button>

      <Button variant="danger" onClick={() => alert('Danger 클릭!')}>
        Danger 버튼
      </Button>

      <Button variant="outline" onClick={() => alert('Outline 클릭!')}>
        Outline 버튼
      </Button>

      {/* disabled 상태 */}
      <Button variant="primary" disabled>
        비활성화 버튼
      </Button>
    </div>
  );
}

// Button 자체도 내보내 다른 곳에서 사용 가능하게 함
export { Button };
