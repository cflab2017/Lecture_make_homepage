# 강의01 — 컴포넌트 심화

## 학습 목표

- 컴포넌트 설계의 핵심 원칙을 이해한다.
- props 패턴(children, render prop)을 활용할 수 있다.
- 조건부 렌더링의 세 가지 방법을 구분해 사용한다.
- 컴포넌트 합성과 상속의 차이를 이해하고 합성을 선택하는 이유를 설명할 수 있다.

---

## 1. 컴포넌트 설계 원칙 — 단일 책임 (Single Responsibility)

하나의 컴포넌트는 **한 가지 역할**만 해야 합니다.  
컴포넌트가 너무 많은 일을 하면 테스트가 어렵고, 재사용이 불가능해집니다.

```jsx
// ❌ 나쁜 예 — 하나의 컴포넌트가 너무 많은 일을 함
function UserCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(setUser);
  }, []);

  return (
    <div>
      <img src={user?.avatar} />
      <h2>{user?.name}</h2>
      <button onClick={() => alert('팔로우!')}>팔로우</button>
    </div>
  );
}

// ✅ 좋은 예 — 역할 분리
function UserAvatar({ src, alt }) {
  return <img src={src} alt={alt} />;
}

function FollowButton({ onFollow }) {
  return <button onClick={onFollow}>팔로우</button>;
}

function UserCard({ user, onFollow }) {
  return (
    <div>
      <UserAvatar src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <FollowButton onFollow={onFollow} />
    </div>
  );
}
```

---

## 2. props 패턴

### 2-1. children props

`children`은 컴포넌트 태그 사이에 들어오는 내용입니다.  
레이아웃 컴포넌트나 래퍼 컴포넌트에 자주 사용합니다.

```jsx
function Card({ children }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px' }}>
      {children}
    </div>
  );
}

// 사용 예
<Card>
  <h2>제목</h2>
  <p>내용이 여기에 들어갑니다.</p>
</Card>
```

### 2-2. render prop 패턴

함수를 prop으로 전달해 **컴포넌트 내부에서 무엇을 렌더링할지**를 외부에서 결정합니다.

```jsx
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData);
  }, [url]);

  return render(data);
}

// 사용 예 — 같은 DataFetcher로 다른 UI 렌더링
<DataFetcher url="/api/users" render={(users) => (
  <ul>{users?.map(u => <li key={u.id}>{u.name}</li>)}</ul>
)} />
```

---

## 3. 조건부 렌더링

### 3-1. && 연산자 (단순 조건)

```jsx
function Notification({ hasMessage, message }) {
  return (
    <div>
      {hasMessage && <p className="notification">{message}</p>}
    </div>
  );
}
// 주의: hasMessage가 0이면 "0"이 화면에 출력됨 → Boolean(hasMessage) 사용 권장
```

### 3-2. 삼항 연산자 (둘 중 하나)

```jsx
function LoginStatus({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <button>로그아웃</button>
      ) : (
        <button>로그인</button>
      )}
    </div>
  );
}
```

### 3-3. 컴포넌트로 분리 (복잡한 조건)

```jsx
function LoadingSpinner() {
  return <div className="spinner">로딩 중...</div>;
}

function ErrorMessage({ message }) {
  return <div className="error">{message}</div>;
}

function UserProfile({ isLoading, error, user }) {
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  return <div>{user.name}</div>;
}
```

---

## 4. 컴포넌트 합성 vs 상속

React 공식 문서는 **상속보다 합성을 권장**합니다.

| 구분 | 합성 (Composition) | 상속 (Inheritance) |
|------|-------------------|-------------------|
| 방법 | children, props로 기능 조합 | class extends |
| 유연성 | 높음 | 낮음 |
| React 권장 | ✅ 권장 | ❌ 비권장 |

```jsx
// ✅ 합성 — 특수화된 컴포넌트를 일반 컴포넌트로 구현
function Dialog({ title, message, children }) {
  return (
    <div className="dialog">
      <h1>{title}</h1>
      <p>{message}</p>
      {children}
    </div>
  );
}

function WelcomeDialog() {
  return (
    <Dialog title="환영합니다!" message="React 심화 과정에 오신 것을 환영합니다.">
      <button>시작하기</button>
    </Dialog>
  );
}
```

---

## 핵심 정리

- 컴포넌트는 **하나의 역할**만 수행하도록 설계한다.
- `children`으로 레이아웃을 유연하게 만든다.
- 조건부 렌더링은 복잡도에 따라 `&&`, 삼항, 컴포넌트 분리를 선택한다.
- 상속 대신 **합성**으로 컴포넌트를 확장한다.
