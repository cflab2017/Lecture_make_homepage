import React, { useState, useMemo, useCallback, memo } from 'react';

// ─── 더미 데이터 생성 ────────────────────────────────────────
// 1000개 항목을 가진 리스트 (렌더링 비용을 시뮬레이션)
const generateItems = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `항목 ${i + 1}`,
    value: Math.floor(Math.random() * 1000),
    category: ['A', 'B', 'C'][i % 3],
  }));

const ITEMS = generateItems(500); // 500개 항목

// ─── 최적화 전 컴포넌트 ──────────────────────────────────────

/**
 * SlowListItem — 최적화 전
 * 부모 리렌더링 시 항상 리렌더링됨
 */
function SlowListItem({ item, onSelect }) {
  // 렌더링 비용 시뮬레이션 — 실제로는 이런 코드 쓰면 안 됨
  const start = Date.now();
  while (Date.now() - start < 0.5) {} // 0.5ms 지연

  return (
    <li
      onClick={() => onSelect(item.id)}
      style={{
        padding: '6px 12px',
        borderBottom: '1px solid #f3f4f6',
        cursor: 'pointer',
        fontSize: '13px',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <span>{item.name}</span>
      <span style={{ color: '#6b7280' }}>
        [{item.category}] {item.value}
      </span>
    </li>
  );
}

/**
 * FastListItem — React.memo 적용 후
 * item과 onSelect가 바뀌지 않으면 리렌더링 건너뜀
 */
const FastListItem = memo(function FastListItem({ item, onSelect }) {
  return (
    <li
      onClick={() => onSelect(item.id)}
      style={{
        padding: '6px 12px',
        borderBottom: '1px solid #f3f4f6',
        cursor: 'pointer',
        fontSize: '13px',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <span>{item.name}</span>
      <span style={{ color: '#6b7280' }}>
        [{item.category}] {item.value}
      </span>
    </li>
  );
});

// ─── 메인 비교 컴포넌트 ──────────────────────────────────────
export default function ExpensiveList() {
  const [filterKeyword, setFilterKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedId, setSelectedId] = useState(null);
  const [isOptimized, setIsOptimized] = useState(false);
  const [otherCount, setOtherCount] = useState(0); // 무관한 state

  // ── 최적화 전: 매 렌더링마다 필터링 실행 ──────────────────
  const filteredItemsSlow = ITEMS.filter((item) => {
    const matchesKeyword = item.name.includes(filterKeyword);
    const matchesCategory = selectedCategory === '전체' || item.category === selectedCategory;
    return matchesKeyword && matchesCategory;
  });

  // ── 최적화 후: useMemo로 의존성이 바뀔 때만 필터링 ─────────
  const filteredItemsFast = useMemo(() => {
    console.log('useMemo: 필터링 실행'); // 실제로 실행되는 시점 확인용
    return ITEMS.filter((item) => {
      const matchesKeyword = item.name.includes(filterKeyword);
      const matchesCategory = selectedCategory === '전체' || item.category === selectedCategory;
      return matchesKeyword && matchesCategory;
    });
  }, [filterKeyword, selectedCategory]); // filterKeyword나 selectedCategory가 바뀔 때만 실행

  // ── 최적화 전: 매 렌더링마다 새 함수 생성 ─────────────────
  const handleSelectSlow = (id) => setSelectedId(id);

  // ── 최적화 후: useCallback으로 함수 참조 유지 ──────────────
  // React.memo(FastListItem)에 전달할 때 효과 발휘
  const handleSelectFast = useCallback((id) => {
    setSelectedId(id); // setSelectedId는 안정적인 참조이므로 의존성에 넣지 않아도 됨
  }, []); // 의존성 없음 — 항상 같은 함수 참조

  const filteredItems = isOptimized ? filteredItemsFast : filteredItemsSlow;
  const ListItem = isOptimized ? FastListItem : SlowListItem;
  const handleSelect = isOptimized ? handleSelectFast : handleSelectSlow;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '4px' }}>성능 최적화 비교</h1>
      <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '13px' }}>
        총 {ITEMS.length}개 항목 | 현재 표시: {filteredItems.length}개
      </p>

      {/* 최적화 토글 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isOptimized}
            onChange={(e) => setIsOptimized(e.target.checked)}
          />
          <strong>React.memo + useMemo + useCallback 적용</strong>
        </label>
        <span style={{
          padding: '3px 10px',
          backgroundColor: isOptimized ? '#dcfce7' : '#fee2e2',
          borderRadius: '12px',
          fontSize: '12px',
          color: isOptimized ? '#16a34a' : '#dc2626',
        }}>
          {isOptimized ? '최적화 ON' : '최적화 OFF'}
        </span>
      </div>

      {/* 무관한 state 변경 — 리렌더링 유발 */}
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => setOtherCount(c => c + 1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f59e0b',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '8px',
          }}
        >
          무관한 state 변경 ({otherCount})
        </button>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          → 최적화 OFF: 리스트 전체 리렌더링 | 최적화 ON: 리렌더링 없음
        </span>
      </div>

      {/* 필터 컨트롤 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="이름 검색..."
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minWidth: '150px' }}
        />
        {['전체', 'A', 'B', 'C'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 14px',
              backgroundColor: selectedCategory === cat ? '#3b82f6' : '#f1f5f9',
              color: selectedCategory === cat ? '#fff' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            카테고리 {cat}
          </button>
        ))}
      </div>

      {/* 선택된 항목 표시 */}
      {selectedId && (
        <div style={{ padding: '8px 14px', backgroundColor: '#eff6ff', borderRadius: '6px', marginBottom: '12px', fontSize: '13px', color: '#1d4ed8' }}>
          선택된 항목: #{selectedId}
        </div>
      )}

      {/* 리스트 */}
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        maxHeight: '400px',
        overflow: 'auto',
      }}>
        {filteredItems.slice(0, 50).map((item) => ( // 최대 50개만 표시
          <ListItem
            key={item.id}
            item={item}
            onSelect={handleSelect}
          />
        ))}
        {filteredItems.length > 50 && (
          <li style={{ padding: '10px', textAlign: 'center', color: '#9ca3af', fontSize: '12px' }}>
            ... 및 {filteredItems.length - 50}개 더 (50개까지 표시)
          </li>
        )}
      </ul>
    </div>
  );
}
