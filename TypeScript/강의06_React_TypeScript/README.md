# 강의 06 — React + TypeScript

## 1. Next.js TypeScript 프로젝트 생성

```bash
npx create-next-app@latest my-app --typescript
cd my-app
npm run dev
```

또는 React만 사용:

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```

---

## 2. 컴포넌트 Props 타입 (interface Props)

```tsx
// Props 인터페이스 정의
interface ButtonProps {
  label: string;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'danger'; // 선택적 + 리터럴 타입
  disabled?: boolean;
}

// React.FC 방식 (Function Component)
const Button: React.FC<ButtonProps> = ({ label, onClick, color = 'primary', disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled} className={color}>
      {label}
    </button>
  );
};

// 또는 일반 함수 방식 (권장)
function Button({ label, onClick, color = 'primary', disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

---

## 3. useState<T>

```tsx
import { useState } from 'react';

// 기본 타입
const [count, setCount] = useState<number>(0);
const [name, setName] = useState<string>('');
const [isVisible, setIsVisible] = useState<boolean>(false);

// 객체 타입
interface User {
  name: string;
  email: string;
}
const [user, setUser] = useState<User | null>(null);

// 배열
interface Todo {
  id: number;
  text: string;
  done: boolean;
}
const [todos, setTodos] = useState<Todo[]>([]);
```

---

## 4. 이벤트 타입

```tsx
// input 변경 이벤트
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

// textarea 변경 이벤트
const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  console.log(e.target.value);
};

// select 변경 이벤트
const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
  console.log(e.target.value);
};

// 폼 제출 이벤트
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // 폼 처리
};

// 버튼 클릭 이벤트
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log('클릭!');
};
```

---

## 5. API 응답 타입 지정

```tsx
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => res.json())
      .then((data: Post[]) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>로딩 중...</p>;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

---

## 학습 포인트 정리

| 개념 | 설명 |
|------|------|
| `interface Props` | 컴포넌트 props 타입 정의 |
| `React.FC<Props>` | 함수형 컴포넌트 타입 |
| `useState<T>` | 상태 타입 지정 |
| `React.ChangeEvent<HTMLInputElement>` | input 변경 이벤트 타입 |
| `React.FormEvent<HTMLFormElement>` | 폼 제출 이벤트 타입 |
| `React.MouseEvent<HTMLButtonElement>` | 마우스 클릭 이벤트 타입 |
