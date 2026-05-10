import { useState } from 'react';

/**
 * useLocalStorage — localStorage와 동기화되는 state 커스텀 훅
 *
 * useState와 동일한 API를 가지며, 값이 바뀔 때마다 localStorage에도 저장됩니다.
 * 페이지를 새로고침해도 값이 유지됩니다.
 *
 * @param {string} key - localStorage에 저장할 키
 * @param {any} initialValue - 초기값 (localStorage에 값이 없을 때 사용)
 * @returns {[any, function]} - [저장된 값, 값 변경 함수]
 *
 * @example
 * function ThemeToggle() {
 *   const [theme, setTheme] = useLocalStorage('theme', 'light');
 *   return <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>{theme}</button>;
 * }
 */
function useLocalStorage(key, initialValue) {
  // useState의 초기화 함수(lazy initializer)를 활용
  // 컴포넌트 마운트 시 한 번만 실행됨 (매 렌더링마다 localStorage 읽지 않음)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // localStorage에서 기존 값을 가져옴
      const item = localStorage.getItem(key);

      if (item !== null) {
        // JSON.parse로 저장된 값을 파싱 (객체, 배열, 숫자 등 모두 처리)
        return JSON.parse(item);
      }

      // localStorage에 값이 없으면 initialValue 사용
      // initialValue 자체를 localStorage에 미리 저장
      localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;

    } catch (error) {
      // JSON.parse 실패, localStorage 접근 권한 없음 등의 예외 처리
      // (예: 시크릿 모드에서 localStorage 용량 초과)
      console.warn(`useLocalStorage: "${key}" 읽기 실패`, error);
      return initialValue;
    }
  });

  /**
   * setValue — 값을 변경하고 localStorage에도 저장
   * useState의 setter와 동일하게 값 또는 함수를 받을 수 있음
   *
   * @param {any | function} value - 새 값 또는 이전 값을 받아 새 값을 반환하는 함수
   */
  const setValue = (value) => {
    try {
      // 함수가 전달된 경우 현재 값을 인자로 호출 (useState의 함수형 업데이트와 동일)
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // React state 업데이트
      setStoredValue(valueToStore);

      // localStorage에도 동기화 (JSON 직렬화)
      localStorage.setItem(key, JSON.stringify(valueToStore));

    } catch (error) {
      // localStorage 쓰기 실패 (용량 초과 등)
      console.warn(`useLocalStorage: "${key}" 쓰기 실패`, error);
    }
  };

  /**
   * removeValue — localStorage에서 해당 키 삭제, 상태를 initialValue로 리셋
   */
  const removeValue = () => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`useLocalStorage: "${key}" 삭제 실패`, error);
    }
  };

  // useState처럼 [값, setter] 배열을 반환 + removeValue도 함께 반환
  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
