// ===================================================
// 강의 06 예제 2 — TodoList 컴포넌트 (TypeScript)
// useState<Todo[]>, React.ChangeEvent, React.FormEvent 타입 활용
// ===================================================

import React, { useState } from 'react';

// Todo 항목 인터페이스
interface Todo {
  id: number;
  text: string;
  done: boolean;
  createdAt: string; // 생성 시각
}

// TodoItem Props 인터페이스
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void; // 완료 토글 콜백
  onDelete: (id: number) => void; // 삭제 콜백
}

// TodoItem 컴포넌트 — 개별 할 일 항목
const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px',
        textDecoration: todo.done ? 'line-through' : 'none', // 완료 시 취소선
        color: todo.done ? '#999' : '#333',
      }}
    >
      {/* 체크박스 — 클릭 시 토글 */}
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)} // onChange 타입: React.ChangeEvent<HTMLInputElement>
      />

      {/* 할 일 텍스트 */}
      <span style={{ flex: 1 }}>{todo.text}</span>

      {/* 생성 시각 */}
      <small style={{ color: '#aaa' }}>{todo.createdAt}</small>

      {/* 삭제 버튼 */}
      <button
        onClick={() => onDelete(todo.id)}
        style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        삭제
      </button>
    </li>
  );
};

// TodoList 메인 컴포넌트
const TodoList: React.FC = () => {
  // useState<Todo[]>: 할 일 목록 상태
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'TypeScript 공부하기', done: false, createdAt: '10:00' },
    { id: 2, text: 'React 컴포넌트 만들기', done: true, createdAt: '10:30' },
  ]);

  // useState<string>: 입력 필드 상태
  const [inputText, setInputText] = useState<string>('');

  // 필터 타입 정의 — 리터럴 유니온
  type Filter = 'all' | 'active' | 'done';
  const [filter, setFilter] = useState<Filter>('all');

  // input 변경 핸들러 — React.ChangeEvent<HTMLInputElement>
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputText(e.target.value);
  };

  // 폼 제출 핸들러 — React.FormEvent<HTMLFormElement>
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault(); // 폼 기본 동작 방지

    const trimmed = inputText.trim();
    if (!trimmed) return; // 빈 입력 무시

    const newTodo: Todo = {
      id: Date.now(),
      text: trimmed,
      done: false,
      createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setTodos((prev) => [...prev, newTodo]); // 기존 목록에 추가
    setInputText(''); // 입력 초기화
  };

  // 완료 토글
  const handleToggle = (id: number): void => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  // 삭제
  const handleDelete = (id: number): void => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // 필터링된 할 일 목록
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.done;
    if (filter === 'done') return todo.done;
    return true; // 'all'
  });

  // 통계
  const doneCount = todos.filter((t) => t.done).length;
  const activeCount = todos.length - doneCount;

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>할 일 목록</h1>

      {/* 통계 */}
      <p style={{ color: '#666' }}>
        전체: {todos.length} | 완료: {doneCount} | 남은 것: {activeCount}
      </p>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="할 일을 입력하세요..."
          style={{ flex: 1, padding: '8px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          추가
        </button>
      </form>

      {/* 필터 버튼 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        {(['all', 'active', 'done'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '5px 15px',
              background: filter === f ? '#0066cc' : '#eee',
              color: filter === f ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {f === 'all' ? '전체' : f === 'active' ? '진행 중' : '완료'}
          </button>
        ))}
      </div>

      {/* 할 일 목록 */}
      {filteredTodos.length === 0 ? (
        <p style={{ color: '#aaa', textAlign: 'center' }}>항목이 없습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
