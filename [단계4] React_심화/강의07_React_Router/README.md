# 강의07 — React Router

## 학습 목표

- `react-router-dom v6`의 핵심 컴포넌트를 사용할 수 있다.
- `useParams`, `useNavigate`, `useLocation` 훅을 활용한다.
- 중첩 라우트(Outlet)를 구성할 수 있다.
- 404 페이지와 리다이렉트를 처리할 수 있다.

---

## 1. 설치

```bash
npm install react-router-dom
```

---

## 2. 핵심 컴포넌트

| 컴포넌트 | 역할 |
|---------|------|
| `<BrowserRouter>` | 앱 전체를 감싸는 라우터 컨테이너 |
| `<Routes>` | 여러 `<Route>`를 담는 컨테이너 |
| `<Route>` | URL 패턴과 컴포넌트를 매핑 |
| `<Link>` | 클릭하면 페이지 이동 (a 태그 대체) |
| `<NavLink>` | 현재 경로와 일치하면 active 클래스 추가 |
| `<Navigate>` | 즉시 다른 경로로 리다이렉트 |
| `<Outlet>` | 중첩 라우트의 자식이 렌더링되는 위치 |

---

## 3. 기본 라우팅 설정

```jsx
// main.jsx 또는 index.jsx
import { BrowserRouter } from 'react-router-dom';

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// App.jsx
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:id" element={<BlogPostPage />} />  {/* 동적 세그먼트 */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />  {/* 404 */}
    </Routes>
  );
}
```

---

## 4. Link / NavLink

```jsx
import { Link, NavLink } from 'react-router-dom';

// Link — 기본 네비게이션
<Link to="/blog">블로그</Link>

// NavLink — 현재 경로와 일치하면 active 스타일 적용
<NavLink
  to="/blog"
  style={({ isActive }) => ({
    color: isActive ? '#3b82f6' : '#374151',
    fontWeight: isActive ? 'bold' : 'normal',
  })}
>
  블로그
</NavLink>
```

---

## 5. useParams — URL 파라미터 가져오기

```jsx
// Route path="/blog/:id" 에서 :id 값을 가져옴
import { useParams } from 'react-router-dom';

function BlogPostPage() {
  const { id } = useParams(); // { id: "42" } — 항상 문자열

  return <h1>게시물 #{id}</h1>;
}
```

---

## 6. useNavigate — 프로그래밍 방식으로 이동

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login();
    navigate('/dashboard');         // 다른 페이지로 이동
    navigate(-1);                   // 뒤로 가기
    navigate('/login', { replace: true }); // 히스토리 교체 (뒤로 가기 방지)
  };
}
```

---

## 7. useLocation — 현재 URL 정보

```jsx
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  // location.pathname: '/blog/42'
  // location.search: '?page=1'
  // location.hash: '#section1'
  // location.state: navigate()로 전달한 데이터
}
```

---

## 8. Outlet — 중첩 라우트

```jsx
// App.jsx — 중첩 라우트 설정
<Routes>
  <Route path="/blog" element={<BlogLayout />}>  {/* 부모 */}
    <Route index element={<BlogListPage />} />     {/* /blog */}
    <Route path=":id" element={<BlogPostPage />} /> {/* /blog/:id */}
  </Route>
</Routes>

// BlogLayout.jsx — Outlet이 자식 라우트를 렌더링하는 위치
function BlogLayout() {
  return (
    <div>
      <nav>블로그 사이드바</nav>
      <main>
        <Outlet /> {/* /blog → BlogListPage, /blog/1 → BlogPostPage */}
      </main>
    </div>
  );
}
```

---

## 9. Navigate — 리다이렉트

```jsx
import { Navigate } from 'react-router-dom';

// 로그인하지 않은 사용자를 /login으로 리다이렉트
function ProtectedRoute({ children }) {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />; // replace: 뒤로가기로 보호 페이지에 못 돌아옴
  }

  return children;
}
```

---

## 핵심 정리

- `<Routes>` 안에 `<Route>`로 URL과 컴포넌트를 매핑한다.
- `path="*"`로 매칭되지 않은 모든 경로(404)를 처리한다.
- `useParams`로 URL 파라미터, `useNavigate`로 코드에서 이동, `useLocation`으로 현재 URL을 읽는다.
- `<Outlet>`으로 중첩 레이아웃을 구성한다.
