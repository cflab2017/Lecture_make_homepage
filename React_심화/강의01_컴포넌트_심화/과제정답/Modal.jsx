import React, { useState, useEffect } from 'react';

/**
 * 재사용 가능한 Modal 컴포넌트
 *
 * @param {boolean} isOpen - true이면 모달 표시
 * @param {function} onClose - 모달 닫기 함수
 * @param {React.ReactNode} children - 모달 내부 내용
 * @param {string} title - 모달 제목 (선택)
 * @param {'sm'|'md'|'lg'} size - 모달 크기 (선택, 기본값: 'md')
 */
function Modal({ isOpen, onClose, children, title, size = 'md' }) {

  // 모달 크기별 최대 너비 매핑
  const sizeMap = {
    sm: '400px',
    md: '560px',
    lg: '800px',
  };

  // ESC 키를 누르면 모달 닫기 — 키보드 접근성
  useEffect(() => {
    // isOpen이 false면 이벤트 리스너 등록 안 함
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener('keydown', handleKeyDown);

    // 클린업: 모달이 닫히거나 컴포넌트가 언마운트되면 리스너 제거
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // isOpen이 false이면 null을 반환해 아무것도 렌더링하지 않음
  // 조건부 렌더링 — 컴포넌트 분기 패턴
  if (!isOpen) return null;

  return (
    // 오버레이(배경) — 화면 전체를 반투명하게 덮음
    // onClick: 배경 클릭 시 onClose 호출
    <div
      onClick={onClose}
      style={{
        position: 'fixed',   // 뷰포트 기준으로 고정
        inset: 0,            // top/right/bottom/left 모두 0 (화면 전체 커버)
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 검정 배경
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,        // 다른 요소 위에 표시
      }}
    >
      {/* 모달 본체 */}
      {/* onClick에서 e.stopPropagation()으로 이벤트 버블링 방지 */}
      {/* 모달 내부 클릭이 오버레이까지 전파되면 닫혀버리므로 막아야 함 */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          width: '90%',              // 모바일 대응
          maxWidth: sizeMap[size],   // size prop에 따라 최대 너비 결정
          maxHeight: '90vh',         // 화면 높이의 90% 초과 방지
          overflowY: 'auto',         // 내용이 길면 스크롤
          position: 'relative',
        }}
      >
        {/* 모달 헤더 — title prop이 있을 때만 렌더링 */}
        {title && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
          }}>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>{title}</h2>

            {/* 닫기 버튼 — 클릭 시 onClose 호출 */}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
                color: '#6b7280',
                lineHeight: 1,
                padding: '0 4px',
              }}
              aria-label="모달 닫기" // 스크린리더 접근성
            >
              ×
            </button>
          </div>
        )}

        {/* title이 없을 때도 닫기 버튼 표시 (절대 위치) */}
        {!title && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              color: '#6b7280',
            }}
            aria-label="모달 닫기"
          >
            ×
          </button>
        )}

        {/* 모달 내용 — children으로 자유롭게 구성 */}
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── 사용 예시 앱 ───────────────────────────────────────────

export default function App() {
  // 각 모달의 열림/닫힘 상태를 별도 state로 관리
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isLargeOpen, setIsLargeOpen] = useState(false);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Modal 컴포넌트 예제</h1>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>

        {/* 확인 모달 */}
        <button
          onClick={() => setIsDeleteOpen(true)}
          style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          삭제 확인 모달
        </button>

        {/* 정보 모달 (title 없음) */}
        <button
          onClick={() => setIsInfoOpen(true)}
          style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          정보 모달 (title 없음)
        </button>

        {/* 큰 모달 */}
        <button
          onClick={() => setIsLargeOpen(true)}
          style={{ padding: '10px 20px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          큰 모달 (lg)
        </button>
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="삭제 확인"
        size="sm"
      >
        <p style={{ color: '#374151', marginTop: 0 }}>
          이 항목을 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
        {/* children 안에 버튼을 자유롭게 배치 */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setIsDeleteOpen(false)}
            style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#fff' }}
          >
            취소
          </button>
          <button
            onClick={() => { alert('삭제 완료!'); setIsDeleteOpen(false); }}
            style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            삭제
          </button>
        </div>
      </Modal>

      {/* title 없는 정보 모달 */}
      <Modal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      >
        <h2 style={{ marginTop: 0 }}>공지사항</h2>
        <p>title prop 없이도 닫기(×) 버튼이 표시됩니다.</p>
        <p>배경을 클릭하거나 ESC 키를 눌러도 닫힙니다.</p>
      </Modal>

      {/* 큰 모달 */}
      <Modal
        isOpen={isLargeOpen}
        onClose={() => setIsLargeOpen(false)}
        title="긴 내용의 모달"
        size="lg"
      >
        {/* 내용이 길어도 스크롤 처리됨 */}
        {Array.from({ length: 10 }, (_, i) => (
          <p key={i} style={{ color: '#374151' }}>
            이것은 {i + 1}번째 단락입니다. 내용이 길어지면 모달 내부에서 스크롤됩니다.
          </p>
        ))}
      </Modal>
    </div>
  );
}

// Modal 컴포넌트도 내보내 다른 파일에서 사용 가능
export { Modal };
