/**
 * 멀티페이지 블로그 앱 예제
 *
 * 라우트 구성:
 *   /           → HomePage
 *   /blog       → BlogListPage
 *   /blog/:id   → BlogPostPage
 *   /about      → AboutPage
 *   *           → NotFoundPage (404)
 *
 * 실행 방법:
 * 1. npm install react-router-dom
 * 2. main.jsx에서 <BrowserRouter>로 <App>을 감싼 후
 *    App 내용을 이 파일의 App 컴포넌트로 교체
 */

import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useParams,
  useNavigate,
  useLocation,
  Outlet,
} from 'react-router-dom';

// ─── 더미 블로그 데이터 ──────────────────────────────────────
const POSTS = [
  { id: 1, title: 'React 심화 강의 시작', content: 'useEffect부터 상태 관리까지 다양한 패턴을 학습합니다. React의 핵심 훅들을 깊이 있게 이해하는 것이 목표입니다.', author: '김철수', date: '2025-01-15', tags: ['React', 'Frontend'] },
  { id: 2, title: 'useContext로 전역 상태 관리', content: 'props drilling 없이 어디서든 데이터에 접근하는 방법을 소개합니다. ThemeContext를 직접 만들어보며 이해합니다.', author: '이영희', date: '2025-01-22', tags: ['React', 'Context'] },
  { id: 3, title: 'React Router v6 완전 정복', content: '동적 라우팅, 중첩 라우트, 보호된 라우트까지 React Router의 모든 것을 다룹니다.', author: '박민준', date: '2025-01-29', tags: ['React', 'Router'] },
  { id: 4, title: 'Zustand로 쉬운 전역 상태 관리', content: 'Redux보다 훨씬 간단한 Zustand로 전역 상태를 관리하는 방법을 알아봅니다.', author: '김철수', date: '2025-02-05', tags: ['React', 'Zustand'] },
];

// ─── 공통 네비게이션 ─────────────────────────────────────────
function Navigation() {
  return (
    <header style={{
      backgroundColor: '#1e293b',
      padding: '0 32px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* 로고 — Link로 홈으로 이동 */}
      <Link to="/" style={{ color: '#f1f5f9', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
        React Blog
      </Link>

      {/* 네비게이션 링크 — NavLink로 현재 페이지 강조 */}
      <nav style={{ display: 'flex', gap: '24px' }}>
        {[
          { to: '/', label: '홈' },
          { to: '/blog', label: '블로그' },
          { to: '/about', label: '소개' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end // 정확한 경로 일치 (/ 가 /blog에도 active되지 않도록)
            style={({ isActive }) => ({
              color: isActive ? '#60a5fa' : '#94a3b8',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: isActive ? '600' : '400',
              borderBottom: isActive ? '2px solid #60a5fa' : '2px solid transparent',
              paddingBottom: '2px',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

// ─── 홈 페이지 ───────────────────────────────────────────────
function HomePage() {
  const navigate = useNavigate(); // 버튼 클릭으로 이동할 때 사용

  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '48px', color: '#1e293b', marginBottom: '16px' }}>
        React Blog
      </h1>
      <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '32px' }}>
        React 심화 과목의 예제 블로그입니다.
      </p>

      {/* useNavigate로 프로그래밍 방식 이동 */}
      <button
        onClick={() => navigate('/blog')} // 클릭 시 /blog로 이동
        style={{
          padding: '12px 32px',
          backgroundColor: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        블로그 보러가기
      </button>
    </div>
  );
}

// ─── 블로그 목록 페이지 ──────────────────────────────────────
function BlogListPage() {
  const location = useLocation(); // 현재 URL 정보
  console.log('현재 경로:', location.pathname); // /blog

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '24px' }}>블로그</h1>

      {POSTS.map((post) => (
        <article key={post.id} style={{
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '16px',
          backgroundColor: '#ffffff',
        }}>
          <h2 style={{ margin: '0 0 8px', color: '#1e293b' }}>
            {/* Link로 개별 게시물 페이지로 이동 */}
            <Link to={`/blog/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {post.title}
            </Link>
          </h2>

          <p style={{ color: '#64748b', margin: '0 0 12px', lineHeight: 1.6 }}>
            {post.content.slice(0, 80)}...
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
            <span style={{ color: '#94a3b8' }}>
              {post.author} · {post.date}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {post.tags.map((tag) => (
                <span key={tag} style={{
                  padding: '2px 8px',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  borderRadius: '10px',
                  fontSize: '11px',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

// ─── 블로그 게시물 상세 페이지 ───────────────────────────────
function BlogPostPage() {
  const { id } = useParams(); // URL에서 :id 파라미터 추출 — 항상 문자열
  const navigate = useNavigate();

  // id로 게시물 찾기 (문자열 vs 숫자 비교이므로 ==로 비교)
  const post = POSTS.find((p) => p.id == id);

  // 존재하지 않는 게시물 처리
  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '80px', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#ef4444' }}>게시물을 찾을 수 없습니다.</h2>
        <button onClick={() => navigate('/blog')} style={{ marginTop: '16px', padding: '8px 20px', cursor: 'pointer' }}>
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      {/* 뒤로 가기 버튼 */}
      <button
        onClick={() => navigate(-1)} // navigate(-1): 브라우저 뒤로 가기
        style={{
          background: 'none',
          border: 'none',
          color: '#3b82f6',
          cursor: 'pointer',
          fontSize: '14px',
          marginBottom: '20px',
          padding: 0,
        }}
      >
        ← 목록으로
      </button>

      <article>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          {post.tags.map((tag) => (
            <span key={tag} style={{
              padding: '3px 10px',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              borderRadius: '12px',
              fontSize: '12px',
            }}>
              {tag}
            </span>
          ))}
        </div>

        <h1 style={{ color: '#1e293b', marginBottom: '8px' }}>{post.title}</h1>

        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
          {post.author} · {post.date}
        </p>

        <div style={{ color: '#374151', lineHeight: 1.8, fontSize: '16px' }}>
          {post.content}
        </div>
      </article>

      {/* 이전/다음 게시물 네비게이션 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
        {post.id > 1 && (
          <Link to={`/blog/${post.id - 1}`} style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>
            ← 이전 글
          </Link>
        )}
        {post.id < POSTS.length && (
          <Link to={`/blog/${post.id + 1}`} style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px', marginLeft: 'auto' }}>
            다음 글 →
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── 소개 페이지 ─────────────────────────────────────────────
function AboutPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b' }}>소개</h1>
      <p style={{ color: '#64748b', lineHeight: 1.7 }}>
        이 블로그는 React Router v6 학습을 위한 예제입니다.
        Route, Link, NavLink, useParams, useNavigate, useLocation의 사용법을 익힐 수 있습니다.
      </p>
    </div>
  );
}

// ─── 404 페이지 ──────────────────────────────────────────────
function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ fontSize: '80px' }}>😵</div>
      <h1 style={{ fontSize: '48px', color: '#1e293b', margin: '16px 0 8px' }}>404</h1>
      <p style={{ color: '#64748b', marginBottom: '8px' }}>
        페이지를 찾을 수 없습니다.
      </p>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '32px' }}>
        요청한 경로: <code>{location.pathname}</code>
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: '10px 24px', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fff' }}
        >
          뒤로 가기
        </button>
        <Link to="/" style={{
          padding: '10px 24px',
          backgroundColor: '#3b82f6',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '14px',
        }}>
          홈으로
        </Link>
      </div>
    </div>
  );
}

// ─── 앱 레이아웃 ─────────────────────────────────────────────
// Navigation과 페이지 내용을 합치는 레이아웃
function AppLayout() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navigation />
      <Outlet /> {/* 현재 라우트에 해당하는 페이지가 여기 렌더링됨 */}
    </div>
  );
}

// ─── 앱 라우트 설정 ──────────────────────────────────────────
export default function BlogApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AppLayout을 부모로 — Navigation이 모든 페이지에 표시됨 */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* 모든 경로와 매칭되지 않으면 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
