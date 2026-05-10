import React, { useReducer } from 'react';

// ─── 초기 상태 ──────────────────────────────────────────────
// 폼의 모든 상태를 하나의 객체로 통합
const initialState = {
  values: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  errors: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  isSubmitting: false, // 제출 중 여부
  isSubmitted: false,  // 제출 완료 여부
};

// ─── action type 상수 ────────────────────────────────────────
const SET_FIELD = 'SET_FIELD';         // 필드 값 변경
const SET_ERROR = 'SET_ERROR';         // 에러 메시지 설정
const SUBMIT_START = 'SUBMIT_START';   // 제출 시작
const SUBMIT_SUCCESS = 'SUBMIT_SUCCESS'; // 제출 완료
const RESET = 'RESET';                 // 전체 초기화

// ─── Reducer ─────────────────────────────────────────────────
/**
 * formReducer — 회원가입 폼 상태를 관리하는 순수 함수
 */
function formReducer(state, action) {
  switch (action.type) {

    case SET_FIELD:
      // 특정 필드의 값을 변경하고 해당 필드의 에러를 초기화
      // [action.payload.field] : 계산된 프로퍼티 키로 동적으로 필드명 지정
      return {
        ...state,
        values: {
          ...state.values,                           // 기존 값 복사
          [action.payload.field]: action.payload.value, // 해당 필드만 업데이트
        },
        errors: {
          ...state.errors,
          [action.payload.field]: '',               // 입력 시 에러 즉시 초기화
        },
      };

    case SET_ERROR:
      // 특정 필드의 에러 메시지를 설정
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.message, // 해당 필드 에러 설정
        },
      };

    case SUBMIT_START:
      // 제출 시작 — 버튼 비활성화, 로딩 표시를 위해 isSubmitting: true
      return {
        ...state,
        isSubmitting: true,
      };

    case SUBMIT_SUCCESS:
      // 제출 완료 — 성공 화면 표시를 위해 isSubmitted: true
      return {
        ...state,
        isSubmitting: false,
        isSubmitted: true,
      };

    case RESET:
      // 전체 초기화 — initialState로 되돌림
      return initialState;

    default:
      return state;
  }
}

// ─── 검증 함수 ───────────────────────────────────────────────
/**
 * 모든 필드를 검증하고 에러 객체를 반환
 * @param {object} values - 폼 필드 값
 * @returns {{ hasError: boolean, errors: object }}
 */
function validateForm(values) {
  const errors = {};

  // 이름: 2자 이상
  if (!values.name || values.name.trim().length < 2) {
    errors.name = '이름은 2자 이상 입력해주세요.';
  }

  // 이메일: '@' 포함 여부
  if (!values.email || !values.email.includes('@')) {
    errors.email = '올바른 이메일 형식을 입력해주세요.';
  }

  // 비밀번호: 8자 이상
  if (!values.password || values.password.length < 8) {
    errors.password = '비밀번호는 8자 이상 입력해주세요.';
  }

  // 비밀번호 확인: password와 동일
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
  }

  return {
    hasError: Object.keys(errors).length > 0, // 에러가 하나라도 있으면 true
    errors,
  };
}

// ─── SignupForm 컴포넌트 ─────────────────────────────────────
function SignupForm() {
  // useReducer로 폼의 모든 상태를 통합 관리
  const [state, dispatch] = useReducer(formReducer, initialState);

  // 구조 분해 — 자주 사용하는 값을 꺼냄
  const { values, errors, isSubmitting, isSubmitted } = state;

  /**
   * 입력 변경 핸들러 — SET_FIELD action dispatch
   * e.target.name으로 어떤 필드인지 구분
   */
  const handleChange = (e) => {
    dispatch({
      type: SET_FIELD,
      payload: {
        field: e.target.name,  // input의 name 속성
        value: e.target.value,
      },
    });
  };

  /**
   * 폼 제출 핸들러
   * 검증 → 에러 표시 → 제출 시작 → 2초 후 완료
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // 전체 검증
    const { hasError, errors: validationErrors } = validateForm(values);

    if (hasError) {
      // 에러가 있으면 각 필드에 SET_ERROR dispatch
      Object.entries(validationErrors).forEach(([field, message]) => {
        dispatch({ type: SET_ERROR, payload: { field, message } });
      });
      return; // 제출 중단
    }

    // 검증 통과 — 제출 시작
    dispatch({ type: SUBMIT_START });

    // 실제 API 호출을 시뮬레이션 (2초 후 완료)
    setTimeout(() => {
      dispatch({ type: SUBMIT_SUCCESS });
    }, 2000);
  };

  // ── 제출 완료 화면 ─────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ color: '#16a34a', marginBottom: '8px' }}>가입 완료!</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          <strong>{values.name}</strong>님, 환영합니다!
        </p>
        {/* RESET action dispatch — 처음 화면으로 되돌리기 */}
        <button
          onClick={() => dispatch({ type: RESET })}
          style={{
            padding: '10px 24px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '15px',
          }}
        >
          처음으로
        </button>
      </div>
    );
  }

  // ── 폼 화면 ───────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '420px', margin: '40px auto', padding: '32px', fontFamily: 'sans-serif', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <h1 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '24px', fontSize: '22px' }}>
        회원가입
      </h1>

      <form onSubmit={handleSubmit} noValidate>

        {/* 공통 필드 렌더링 설정 */}
        {[
          { name: 'name', label: '이름', type: 'text', placeholder: '홍길동' },
          { name: 'email', label: '이메일', type: 'email', placeholder: 'hong@example.com' },
          { name: 'password', label: '비밀번호', type: 'password', placeholder: '8자 이상' },
          { name: 'confirmPassword', label: '비밀번호 확인', type: 'password', placeholder: '비밀번호 재입력' },
        ].map(({ name, label, type, placeholder }) => (
          <div key={name} style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              {label}
            </label>
            <input
              type={type}
              name={name}                // handleChange에서 e.target.name으로 사용
              value={values[name]}       // state의 values에서 현재 값 표시
              onChange={handleChange}    // SET_FIELD action dispatch
              placeholder={placeholder}
              disabled={isSubmitting}   // 제출 중이면 입력 비활성화
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors[name] ? '#ef4444' : '#d1d5db'}`, // 에러 시 빨간 테두리
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: isSubmitting ? '#f9fafb' : '#fff',
              }}
            />
            {/* 에러 메시지 — errors[name]이 있을 때만 표시 */}
            {errors[name] && (
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#ef4444' }}>
                {errors[name]}
              </p>
            )}
          </div>
        ))}

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting} // 제출 중이면 버튼 비활성화
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isSubmitting ? '#93c5fd' : '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            marginTop: '8px',
            transition: 'background-color 0.2s',
          }}
        >
          {isSubmitting ? '처리 중...' : '가입하기'}
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
