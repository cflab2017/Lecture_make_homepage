import React, { useState, useMemo, useCallback, useRef, memo } from 'react';

// ─── 더미 상품 데이터 ────────────────────────────────────────
// 컴포넌트 밖에서 생성 — 렌더링마다 재생성되지 않음
const PRODUCTS = Array.from({ length: 300 }, (_, i) => ({
  id: i + 1,
  name: `상품 ${i + 1}`,
  category: ['전자제품', '의류', '식품', '도서'][i % 4],
  price: Math.floor(Math.sin(i) * 45000 + 50000), // 결정적 값으로 생성
  inStock: i % 3 !== 0, // 약 2/3가 재고 있음
}));

const CATEGORIES = ['전체', '전자제품', '의류', '식품', '도서'];

// ─── ProductCard 컴포넌트 ────────────────────────────────────
/**
 * React.memo로 감싸 props가 바뀔 때만 리렌더링
 * item과 onSelect가 동일하면 리렌더링 건너뜀
 */
const ProductCard = memo(function ProductCard({ item }) {
  // useRef로 렌더링 횟수를 추적 (useRef는 리렌더링을 유발하지 않음)
  const renderCount = useRef(0);
  renderCount.current += 1; // 렌더링 시마다 +1 (state 변경 없음)

  return (
    <div style={{
      padding: '12px 16px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: item.inStock ? '#ffffff' : '#f9fafb',
      opacity: item.inStock ? 1 : 0.6,
      position: 'relative',
    }}>
      {/* 렌더링 횟수 배지 — 최적화 효과 확인용 */}
      <span style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        fontSize: '10px',
        color: '#9ca3af',
        backgroundColor: '#f3f4f6',
        padding: '2px 6px',
        borderRadius: '10px',
      }}>
        #{renderCount.current}
      </span>

      {/* 상품 이름 */}
      <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px', paddingRight: '32px' }}>
        {item.name}
      </div>

      {/* 카테고리 배지 */}
      <span style={{
        display: 'inline-block',
        padding: '2px 8px',
        backgroundColor: '#eff6ff',
        color: '#1d4ed8',
        borderRadius: '10px',
        fontSize: '11px',
        marginBottom: '6px',
      }}>
        {item.category}
      </span>

      {/* 가격과 재고 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ color: '#1e293b' }}>
          {item.price.toLocaleString('ko-KR')}원
        </strong>
        <span style={{
          fontSize: '11px',
          color: item.inStock ? '#16a34a' : '#dc2626',
        }}>
          {item.inStock ? '재고 있음' : '품절'}
        </span>
      </div>
    </div>
  );
});

// ─── OptimizedSearch 메인 컴포넌트 ──────────────────────────
export default function OptimizedSearch() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [unrelatedCount, setUnrelatedCount] = useState(0); // 무관한 state

  // ── useMemo: 필터링 결과 메모이제이션 ──────────────────────
  // searchText, selectedCategory, onlyInStock 중 하나라도 바뀔 때만 실행
  // unrelatedCount가 바뀌어도 필터링을 다시 실행하지 않음
  const filteredProducts = useMemo(() => {
    console.log('useMemo: 필터링 실행됨'); // 콘솔에서 실행 시점 확인

    return PRODUCTS.filter((product) => {
      // 검색어 조건: 상품명에 검색어 포함 여부
      const matchesSearch = product.name.includes(searchText.trim());

      // 카테고리 조건: '전체'이거나 선택한 카테고리와 일치
      const matchesCategory =
        selectedCategory === '전체' || product.category === selectedCategory;

      // 재고 조건: 체크박스 미선택 시 모두 통과, 선택 시 재고 있는 것만
      const matchesStock = !onlyInStock || product.inStock;

      // 세 조건을 모두 만족해야 포함
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [searchText, selectedCategory, onlyInStock]); // 이 세 값이 의존성

  // ── useMemo: 총 가격 합계 메모이제이션 ────────────────────
  // filteredProducts가 바뀔 때만 합계를 재계산
  const totalPrice = useMemo(() => {
    return filteredProducts.reduce((sum, p) => sum + p.price, 0);
  }, [filteredProducts]); // filteredProducts가 바뀔 때만 재계산

  // ── useCallback: 이벤트 핸들러 메모이제이션 ───────────────
  // React.memo(ProductCard)에 함수를 전달할 때 유용

  // 검색어 변경 핸들러 — setSearchText는 안정적이므로 의존성에 포함 불필요
  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []); // 의존성 없음 — 항상 같은 함수 참조

  // 카테고리 변경 핸들러
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []); // 의존성 없음

  // 재고 필터 핸들러
  const handleStockFilter = useCallback((e) => {
    setOnlyInStock(e.target.checked);
  }, []); // 의존성 없음

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '4px' }}>최적화된 상품 검색</h1>

      {/* 최적화 효과 설명 */}
      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '20px',
        fontSize: '13px',
        color: '#1d4ed8',
      }}>
        <strong>최적화 적용:</strong> useMemo(필터링, 합계 계산) + useCallback(핸들러) + React.memo(ProductCard)<br />
        우측 상단의 숫자(#N)는 각 카드의 렌더링 횟수입니다.
      </div>

      {/* 무관한 state 변경으로 최적화 효과 확인 */}
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => setUnrelatedCount(c => c + 1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f59e0b',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          무관한 state 변경 ({unrelatedCount}) — 카드 리렌더링 없음 확인
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          value={searchText}
          onChange={handleSearch} // useCallback으로 메모이제이션된 핸들러
          placeholder="상품명 검색..."
          style={{
            flex: 1,
            minWidth: '180px',
            padding: '9px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={handleStockFilter} // useCallback 적용
          />
          재고 있음만
        </label>
      </div>

      {/* 카테고리 버튼 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)} // useCallback 적용
            style={{
              padding: '7px 14px',
              backgroundColor: selectedCategory === cat ? '#3b82f6' : '#f1f5f9',
              color: selectedCategory === cat ? '#fff' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 결과 요약 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
        fontSize: '14px',
        color: '#374151',
      }}>
        <span>
          <strong style={{ color: '#3b82f6' }}>{filteredProducts.length}개</strong> 상품
          (전체 {PRODUCTS.length}개)
        </span>
        {/* useMemo로 계산된 총합 */}
        <span>
          합계: <strong>{totalPrice.toLocaleString('ko-KR')}원</strong>
        </span>
      </div>

      {/* 상품 그리드 */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: '8px' }}>
          조건에 맞는 상품이 없습니다.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '10px',
          maxHeight: '500px',
          overflowY: 'auto',
        }}>
          {/* 최대 100개만 렌더링 */}
          {filteredProducts.slice(0, 100).map((product) => (
            <ProductCard
              key={product.id}
              item={product}
              // React.memo + useCallback 조합으로 불필요한 리렌더링 방지
            />
          ))}
        </div>
      )}

      {filteredProducts.length > 100 && (
        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginTop: '8px' }}>
          100개까지 표시 (전체 {filteredProducts.length}개)
        </p>
      )}
    </div>
  );
}
