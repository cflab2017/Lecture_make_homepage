import React, { createContext, useContext, useState } from 'react';

// ─── 번역 데이터 ─────────────────────────────────────────────
// 각 언어별 텍스트를 객체로 관리 — 실무에서는 i18n 라이브러리(react-i18next) 사용
const translations = {
  ko: {
    home: '홈',
    about: '소개',
    contact: '연락처',
    toggle: '영어로 전환',      // 현재 한국어이므로 "영어로 전환" 표시
    welcome: '안녕하세요!',
    description: 'React 심화 강의입니다.',
    currentLang: '현재 언어: 한국어',
  },
  en: {
    home: 'Home',
    about: 'About',
    contact: 'Contact',
    toggle: '한국어로 전환',    // 현재 영어이므로 "한국어로 전환" 표시
    welcome: 'Hello!',
    description: 'This is a React advanced course.',
    currentLang: 'Current language: English',
  },
};

// ─── Context 생성 ────────────────────────────────────────────
// 기본값은 Provider 없이 useLanguage를 호출할 때 사용되지만
// 실제로는 useLanguage 안의 에러 처리가 먼저 작동함
const LanguageContext = createContext(null);

// ─── LanguageProvider ────────────────────────────────────────
/**
 * 언어 설정을 전체 앱에 제공하는 Provider
 * value로 language, toggleLanguage, t(번역 함수)를 제공
 *
 * @param {React.ReactNode} children
 */
function LanguageProvider({ children }) {
  // 언어 상태 — 'ko' 또는 'en'
  const [language, setLanguage] = useState('ko');

  // 언어 전환 함수 — 현재 값의 반대로 토글
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ko' ? 'en' : 'ko'));
  };

  /**
   * 번역 함수 — 키를 받아 현재 언어에 해당하는 텍스트 반환
   * @param {string} key - 번역 키 (예: 'home', 'welcome')
   * @returns {string} 번역된 텍스트. 키가 없으면 키 자체를 반환
   */
  const t = (key) => {
    return translations[language][key] ?? key; // ?? : null/undefined이면 키 반환
  };

  // Context에 제공할 값 — language, toggleLanguage, t를 함께 전달
  const contextValue = {
    language,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── useLanguage 커스텀 훅 ───────────────────────────────────
/**
 * 언어 Context를 사용하는 커스텀 훅
 * LanguageProvider 밖에서 사용하면 명확한 에러 메시지를 던짐
 *
 * @returns {{ language: string, toggleLanguage: function, t: function }}
 */
function useLanguage() {
  const context = useContext(LanguageContext);

  // context가 null이면 Provider 없이 사용한 것 — 명확한 에러 메시지 제공
  if (context === null) {
    throw new Error('useLanguage는 LanguageProvider 안에서 사용해야 합니다.');
  }

  return context;
}

// ─── Header 컴포넌트 ─────────────────────────────────────────
/**
 * 네비게이션 메뉴와 언어 전환 버튼을 포함하는 헤더
 * props로 language를 받지 않고 useLanguage 훅으로 직접 접근
 */
function Header() {
  // useLanguage 훅으로 Context에서 t와 toggleLanguage를 가져옴
  const { t, toggleLanguage, language } = useLanguage();

  return (
    <header style={{
      backgroundColor: '#1e293b',
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: 'sans-serif',
    }}>
      {/* 네비게이션 메뉴 — t() 함수로 언어에 맞는 텍스트 표시 */}
      <nav style={{ display: 'flex', gap: '24px' }}>
        {/* t('home')은 language가 'ko'이면 '홈', 'en'이면 'Home' 반환 */}
        {['home', 'about', 'contact'].map((key) => (
          <a
            key={key}
            href={`#${key}`}
            style={{
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '15px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
          >
            {t(key)} {/* 번역 함수 호출 */}
          </a>
        ))}
      </nav>

      {/* 언어 전환 버튼 */}
      <button
        onClick={toggleLanguage}
        style={{
          padding: '6px 14px',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600',
        }}
      >
        {/* t('toggle')은 'ko'이면 '영어로 전환', 'en'이면 '한국어로 전환' */}
        {language === 'ko' ? '🌐 ' : '🌐 '}{t('toggle')}
      </button>
    </header>
  );
}

// ─── MainContent 컴포넌트 ────────────────────────────────────
/**
 * 메인 콘텐츠 — 인사말과 설명을 언어에 맞게 표시
 */
function MainContent() {
  const { t, language } = useLanguage();

  return (
    <main style={{
      maxWidth: '600px',
      margin: '60px auto',
      padding: '0 24px',
      fontFamily: 'sans-serif',
      textAlign: 'center',
    }}>
      {/* 인사말 */}
      <h1 style={{ fontSize: '48px', margin: '0 0 16px', color: '#1e293b' }}>
        {t('welcome')}
      </h1>

      {/* 설명 */}
      <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '32px' }}>
        {t('description')}
      </p>

      {/* 현재 언어 표시 배지 */}
      <div style={{
        display: 'inline-block',
        padding: '8px 20px',
        backgroundColor: '#dbeafe',
        borderRadius: '20px',
        fontSize: '14px',
        color: '#1d4ed8',
      }}>
        {t('currentLang')}
      </div>

      {/* 언어 코드 시각화 */}
      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
        {['ko', 'en'].map((lang) => (
          <div
            key={lang}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: `2px solid ${language === lang ? '#3b82f6' : '#e2e8f0'}`,
              backgroundColor: language === lang ? '#eff6ff' : '#f8fafc',
              color: language === lang ? '#1d4ed8' : '#94a3b8',
              fontWeight: language === lang ? '700' : '400',
              fontSize: '16px',
              transition: 'all 0.2s',
            }}
          >
            {lang.toUpperCase()}
          </div>
        ))}
      </div>
    </main>
  );
}

// ─── 최상위 앱 컴포넌트 ─────────────────────────────────────
/**
 * LanguageProvider로 전체 앱을 감싸
 * Header와 MainContent 모두 props 없이 언어 Context에 접근
 */
export default function App() {
  return (
    // LanguageProvider로 감싸면 모든 자식이 useLanguage() 사용 가능
    <LanguageProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Header />
        <MainContent />
      </div>
    </LanguageProvider>
  );
}

// 훅과 Provider를 내보내 다른 파일에서 재사용 가능
export { LanguageProvider, useLanguage };
