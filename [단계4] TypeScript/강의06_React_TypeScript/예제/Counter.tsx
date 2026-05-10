// ===================================================
// 강의 06 예제 1 — Counter 컴포넌트 (TypeScript)
// useState<number>, React.MouseEvent 타입 활용
// ===================================================

import React, { useState } from 'react';

// Props 인터페이스 정의
interface CounterProps {
  initialCount?: number;  // 초기값 (선택적, 기본값 0)
  min?: number;           // 최솟값 (선택적)
  max?: number;           // 최댓값 (선택적)
  step?: number;          // 증감 단위 (선택적, 기본값 1)
  title?: string;         // 카운터 제목 (선택적)
  onCountChange?: (count: number) => void; // 값 변경 콜백 (선택적)
}

// 카운터 컴포넌트
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  title = '카운터',
  onCountChange,
}) => {
  // useState<number>: 상태 타입을 number로 명시
  const [count, setCount] = useState<number>(initialCount);

  // 증가 핸들러
  const handleIncrement = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const newCount = Math.min(count + step, max); // max 초과 방지
    setCount(newCount);
    onCountChange?.(newCount); // 콜백이 있으면 호출 (옵셔널 체이닝)
  };

  // 감소 핸들러
  const handleDecrement = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const newCount = Math.max(count - step, min); // min 미만 방지
    setCount(newCount);
    onCountChange?.(newCount);
  };

  // 초기화 핸들러
  const handleReset = (): void => {
    setCount(initialCount);
    onCountChange?.(initialCount);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{title}</h2>

      {/* 현재 값 표시 — 범위에 따라 색상 변경 */}
      <p
        style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: count > 0 ? '#28a745' : count < 0 ? '#dc3545' : '#333',
        }}
      >
        {count}
      </p>

      {/* 버튼 영역 */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={handleDecrement}
          disabled={count <= min} // min에 도달하면 비활성화
          style={{ padding: '10px 20px', fontSize: '18px' }}
        >
          -{step}
        </button>

        <button
          onClick={handleReset}
          style={{ padding: '10px 20px', fontSize: '14px' }}
        >
          초기화
        </button>

        <button
          onClick={handleIncrement}
          disabled={count >= max} // max에 도달하면 비활성화
          style={{ padding: '10px 20px', fontSize: '18px' }}
        >
          +{step}
        </button>
      </div>

      {/* 범위 표시 */}
      {(min !== -Infinity || max !== Infinity) && (
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
          범위: {min === -Infinity ? '제한 없음' : min} ~{' '}
          {max === Infinity ? '제한 없음' : max}
        </p>
      )}
    </div>
  );
};

// 사용 예시 (App.tsx에서 이렇게 사용)
/*
export default function App() {
  return (
    <div>
      <Counter title="기본 카운터" />
      <Counter title="점수판" min={0} max={100} step={5} initialCount={50} />
      <Counter
        title="온도"
        min={-30}
        max={50}
        onCountChange={(val) => console.log('현재 온도:', val)}
      />
    </div>
  );
}
*/

export default Counter;
