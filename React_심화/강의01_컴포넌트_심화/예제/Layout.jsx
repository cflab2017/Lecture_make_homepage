import React from 'react';

/**
 * Layout 컴포넌트 — children + header props 패턴 예제
 * 페이지 전체 레이아웃을 담당하며, 헤더와 본문을 분리해 관리
 *
 * @param {React.ReactNode} children - 페이지 본문 내용
 * @param {React.ReactNode} header - 헤더 영역 내용 (선택)
 * @param {React.ReactNode} footer - 푸터 영역 내용 (선택)
 * @param {boolean} sidebar - 사이드바 레이아웃 사용 여부
 * @param {React.ReactNode} sidebarContent - 사이드바에 들어갈 내용
 */
function Layout({ children, header, footer, sidebar = false, sidebarContent }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>

      {/* 헤더 — header prop이 있을 때만 렌더링 (조건부 렌더링) */}
      {header && (
        <header style={{
          backgroundColor: '#1e293b',
          color: '#ffffff',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          {header}
        </header>
      )}

      {/* 메인 영역 — sidebar 여부에 따라 레이아웃 분기 */}
      <main style={{ flex: 1, display: 'flex' }}>

        {/* 사이드바 — sidebar prop이 true일 때만 표시 */}
        {sidebar && sidebarContent && (
          <aside style={{
            width: '240px',
            backgroundColor: '#f8fafc',
            borderRight: '1px solid #e2e8f0',
            padding: '20px',
            flexShrink: 0,
          }}>
            {sidebarContent}
          </aside>
        )}

        {/* 페이지 본문 */}
        <div style={{ flex: 1, padding: '24px', maxWidth: sidebar ? 'calc(100% - 240px)' : '100%' }}>
          {children}
        </div>

      </main>

      {/* 푸터 — footer prop이 있을 때만 렌더링 */}
      {footer && (
        <footer style={{
          backgroundColor: '#f1f5f9',
          borderTop: '1px solid #e2e8f0',
          padding: '16px 24px',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '14px',
        }}>
          {footer}
        </footer>
      )}

    </div>
  );
}

// 헤더 내비게이션 컴포넌트 — Layout의 header prop에 넣어 사용
function NavHeader({ title, links = [] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{title}</span>
      <nav style={{ display: 'flex', gap: '16px' }}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

// 사용 예시
export default function LayoutExample() {
  const navLinks = [
    { href: '/', label: '홈' },
    { href: '/about', label: '소개' },
    { href: '/blog', label: '블로그' },
  ];

  const sidebarMenu = (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {['강의01', '강의02', '강의03', '강의04'].map((item) => (
        <li key={item} style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', color: '#475569' }}>
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    // Layout 컴포넌트에 header, footer, sidebar를 props로 전달
    <Layout
      header={<NavHeader title="React 심화" links={navLinks} />}
      footer={<span>© 2025 React 심화 강의. All rights reserved.</span>}
      sidebar={true}
      sidebarContent={sidebarMenu}
    >
      {/* children — 실제 페이지 내용 */}
      <h1 style={{ color: '#1e293b', marginTop: 0 }}>강의01 — 컴포넌트 심화</h1>
      <p style={{ color: '#475569', lineHeight: 1.7 }}>
        Layout 컴포넌트는 <code>children</code>과 <code>header</code> props를 받아
        페이지 전체 레이아웃을 구성합니다.
        사이드바, 헤더, 푸터를 선택적으로 조합할 수 있습니다.
      </p>
    </Layout>
  );
}

export { Layout, NavHeader };
