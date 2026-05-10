import React, { createContext, useContext, useState } from 'react';

// ─── 1. Context 생성 ────────────────────────────────────────
// createContext의 인자는 Provider 없이 사용할 때의 기본값
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// ─── 2. ThemeProvider ───────────────────────────────────────
/**
 * 앱 전체를 감싸는 ThemeProvider
 * theme 상태와 toggleTheme 함수를 Context로 제공
 *
 * @param {React.ReactNode} children - Provider로 감쌀 컴포넌트 트리
 */
function ThemeProvider({ children }) {
  // 테마 상태 — 'light' 또는 'dark'
  const [theme, setTheme] = useState('light');

  // 테마 전환 함수 — 현재 값의 반대로 토글
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // value로 theme 값과 toggleTheme 함수를 함께 전달
  // 이 Provider 안의 모든 컴포넌트에서 useTheme()으로 접근 가능
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── 3. useTheme 커스텀 훅 ──────────────────────────────────
/**
 * ThemeContext를 사용하는 커스텀 훅
 * ThemeProvider 밖에서 사용하면 에러를 던져 디버깅을 쉽게 함
 */
function useTheme() {
  const context = useContext(ThemeContext);
  // Provider 없이 사용했을 때 명확한 에러 메시지 제공
  if (!context) {
    throw new Error('useTheme은 ThemeProvider 안에서 사용해야 합니다.');
  }
  return context;
}

// ─── 테마별 색상 정의 ────────────────────────────────────────
const themeColors = {
  light: {
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    primary: '#3b82f6',
    buttonBg: '#1e293b',
    buttonText: '#ffffff',
  },
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    primary: '#60a5fa',
    buttonBg: '#f1f5f9',
    buttonText: '#0f172a',
  },
};

// ─── 테마를 사용하는 컴포넌트들 ─────────────────────────────

/**
 * 다크 모드 토글 버튼 컴포넌트
 * useTheme 훅으로 theme 값과 toggleTheme 함수를 가져옴
 */
function ThemeToggleButton() {
  // props 없이 Context에서 직접 가져옴 — props drilling 없음!
  const { theme, toggleTheme } = useTheme();
  const colors = themeColors[theme];

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '8px 16px',
        backgroundColor: colors.buttonBg,
        color: colors.buttonText,
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s',
      }}
    >
      {theme === 'light' ? '🌙 다크 모드' : '☀️ 라이트 모드'}
    </button>
  );
}

/**
 * 헤더 컴포넌트 — ThemeToggleButton을 포함
 * theme을 props로 받지 않아도 됨
 */
function Header() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <header style={{
      backgroundColor: colors.surface,
      borderBottom: `1px solid ${colors.border}`,
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.3s',
    }}>
      <h1 style={{ margin: 0, fontSize: '20px', color: colors.text }}>
        React 심화 강의
      </h1>
      {/* ThemeToggleButton도 theme props 없이 동작 */}
      <ThemeToggleButton />
    </header>
  );
}

/**
 * 카드 컴포넌트 — 테마에 따라 색상 변경
 */
function Card({ title, description }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <div style={{
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: '12px',
      padding: '20px',
      transition: 'all 0.3s',
    }}>
      <h3 style={{ margin: '0 0 8px', color: colors.text }}>{title}</h3>
      <p style={{ margin: 0, color: colors.textSecondary, lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}

/**
 * 메인 콘텐츠 컴포넌트
 */
function MainContent() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <main style={{ padding: '24px', transition: 'all 0.3s' }}>
      <p style={{ color: colors.textSecondary, marginBottom: '20px' }}>
        현재 테마: <strong style={{ color: colors.primary }}>{theme === 'light' ? '라이트 모드' : '다크 모드'}</strong>
      </p>
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        <Card title="useContext" description="Provider로 감싼 트리 어디서든 데이터에 접근할 수 있습니다." />
        <Card title="props drilling 해결" description="중간 컴포넌트에 props를 전달하지 않아도 됩니다." />
        <Card title="테마 전환" description="Context로 전역 테마를 관리하면 모든 컴포넌트가 동시에 바뀝니다." />
      </div>
    </main>
  );
}

// ─── 최상위 앱 컴포넌트 ─────────────────────────────────────
/**
 * ThemeProvider로 전체 앱을 감싸면
 * 내부의 모든 컴포넌트에서 useTheme()으로 테마 접근 가능
 */
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      transition: 'all 0.3s',
      fontFamily: 'sans-serif',
    }}>
      <Header />
      <MainContent />
    </div>
  );
}

// 커스텀 훅과 Provider를 내보내 다른 파일에서 사용 가능
export { ThemeProvider, useTheme };
