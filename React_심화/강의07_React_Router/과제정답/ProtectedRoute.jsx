/**
 * ProtectedRoute 과제 정답
 *
 * 로그인 상태가 아니면 /login으로 리다이렉트하고,
 * 로그인 상태에서 /login에 접근하면 /dashboard로 리다이렉트합니다.
 * 로그인 후 원래 가려던 페이지로 돌아가는 기능도 포함합니다.
 */

import React, { useState, createContext, useContext } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Link,
  NavLink,
  Outlet,
} from 'react-router-dom';

// ─── 인증 Context ────────────────────────────────────────────
// 로그인 상태를 앱 전체에서 공유하기 위해 Context 사용
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  // 로그인 상태 — false: 로그아웃, true: 로그인
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  /**
   * login — 아이디/비밀번호 검증 후 로그인 상태 변경
   * @returns {boolean} 로그인 성공 여부
   */
  const login = (username, password) => {
    // 실제 앱에서는 API 호출로 검증
    // 여기서는 하드코딩된 값으로 확인
    if (username === 'admin' && password === '1234') {
      setIsLoggedIn(true);
      setUser({ username, name: '관리자' });
      return true;
    }
    return false; // 로그인 실패
  };

  /**
   * logout — 상태 초기화
   */
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 커스텀 훅 — AuthContext를 편리하게 사용
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.');
  return context;
}

// ─── ProtectedRoute ──────────────────────────────────────────
/**
 * 로그인이 필요한 페이지를 보호하는 컴포넌트
 *
 * 로그인 상태가 아니면 /login으로 리다이렉트
 * state.from에 현재 경로를 저장해 로그인 후 돌아올 수 있게 함
 */
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation(); // 현재 URL 정보

  if (!isLoggedIn) {
    // state.from에 원래 가려던 경로를 저장 (로그인 후 여기로 돌아옴)
    // replace: true로 /login이 히스토리에 쌓이지 않게 함
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 로그인 상태이면 자식 컴포넌트(보호된 페이지) 렌더링
  return children;
}

/**
 * 로그인한 사용자가 /login에 접근하면 /dashboard로 리다이렉트
 * (이미 로그인했는데 로그인 페이지를 다시 보여주면 이상하므로)
 */
function PublicOnlyRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    // 이미 로그인된 상태이면 대시보드로 이동
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// ─── 페이지 컴포넌트들 ───────────────────────────────────────

function HomePage() {
  const { isLoggedIn } = useAuth();

  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b' }}>홈 페이지</h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>
        로그인 여부와 관계없이 모두 볼 수 있는 페이지입니다.
      </p>
      {isLoggedIn ? (
        <Link to="/dashboard" style={{ color: '#3b82f6' }}>대시보드 바로가기</Link>
      ) : (
        <Link to="/login" style={{ color: '#3b82f6' }}>로그인하러 가기</Link>
      )}
    </div>
  );
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ProtectedRoute가 state.from에 저장한 이전 경로
  // 없으면 기본값으로 /dashboard 사용
  const from = location.state?.from?.pathname || '/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password); // AuthContext의 login 함수 호출

    if (success) {
      // 로그인 성공 — 원래 가려던 페이지로 이동 (replace로 /login을 히스토리에서 제거)
      navigate(from, { replace: true });
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다. (admin / 1234)');
    }
  };

  return (
    <div style={{ maxWidth: '360px', margin: '80px auto', padding: '32px', border: '1px solid #e5e7eb', borderRadius: '12px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '24px' }}>로그인</h2>

      {/* 어디서 왔는지 안내 */}
      {location.state?.from && (
        <div style={{ backgroundColor: '#fef9c3', border: '1px solid #fde047', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#854d0e' }}>
          <strong>{location.state.from.pathname}</strong> 페이지에 접근하려면 로그인이 필요합니다.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>아이디</label>
          <input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(''); }}
            placeholder="admin"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="1234"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 에러 메시지 */}
        {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 12px' }}>{error}</p>}

        <button
          type="submit"
          style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}
        >
          로그인
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '16px' }}>
        힌트: admin / 1234
      </p>
    </div>
  );
}

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // 상태 초기화
    navigate('/', { replace: true }); // 홈으로 이동
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b' }}>대시보드</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>
        안녕하세요, <strong>{user?.name}</strong>님! 이 페이지는 로그인한 사용자만 볼 수 있습니다.
      </p>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Link to="/profile" style={{ padding: '8px 16px', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>
          프로필 보기
        </Link>
        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
          로그아웃
        </button>
      </div>
    </div>
  );
}

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b' }}>프로필</h1>
      <p style={{ color: '#64748b' }}>사용자: <strong>{user?.username}</strong></p>
      <Link to="/dashboard" style={{ color: '#3b82f6', fontSize: '14px' }}>← 대시보드로</Link>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '80px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b' }}>404 — 페이지 없음</h1>
      <Link to="/">홈으로</Link>
    </div>
  );
}

// ─── 레이아웃 ────────────────────────────────────────────────
function Layout() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <header style={{ backgroundColor: '#1e293b', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#f1f5f9', textDecoration: 'none', fontWeight: 'bold' }}>앱</Link>
          {isLoggedIn && (
            <>
              <NavLink to="/dashboard" style={({ isActive }) => ({ color: isActive ? '#60a5fa' : '#94a3b8', textDecoration: 'none', fontSize: '14px' })}>
                대시보드
              </NavLink>
              <NavLink to="/profile" style={({ isActive }) => ({ color: isActive ? '#60a5fa' : '#94a3b8', textDecoration: 'none', fontSize: '14px' })}>
                프로필
              </NavLink>
            </>
          )}
        </div>
        <div>
          {isLoggedIn ? (
            <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '6px 14px', backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
              {user?.name} 로그아웃
            </button>
          ) : (
            <Link to="/login" style={{ color: '#60a5fa', fontSize: '14px' }}>로그인</Link>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  );
}

// ─── 앱 ─────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />

            {/* PublicOnlyRoute: 로그인 상태이면 /dashboard로 리다이렉트 */}
            <Route path="/login" element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            } />

            {/* ProtectedRoute: 로그인 상태가 아니면 /login으로 리다이렉트 */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

// ProtectedRoute와 useAuth를 내보내 다른 파일에서 재사용 가능
export { ProtectedRoute, useAuth, AuthProvider };
