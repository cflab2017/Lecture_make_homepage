// ===================================================
// 과제 06 정답 — 타입 안전한 회원가입 폼
// React + TypeScript — 모든 상태와 이벤트에 타입 지정
// ===================================================

import React, { useState } from 'react';

// ============================================================
// 타입 정의
// ============================================================

// 성별 타입 — 빈 문자열(미선택) 포함
type Gender = 'male' | 'female' | 'other' | '';

// 폼 데이터 인터페이스 — 각 필드의 타입 명시
interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  gender: Gender;
  agreeToTerms: boolean;
}

// 유효성 오류 타입 — 필드별 오류 메시지 (선택적)
// keyof SignupFormData: 'name' | 'email' | 'password' | ...
// Partial<Record<...>>: 모든 키가 선택적
type FormErrors = Partial<Record<keyof SignupFormData, string>>;

// 폼 초기값
const initialFormData: SignupFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  birthDate: '',
  gender: '',
  agreeToTerms: false,
};

// ============================================================
// 유효성 검사 함수
// ============================================================

// 이메일 형식 확인 정규식
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 특정 필드 유효성 검사 — 오류 메시지 반환 (없으면 undefined)
function validateField(
  name: keyof SignupFormData,
  value: SignupFormData[keyof SignupFormData],
  formData: SignupFormData
): string | undefined {
  switch (name) {
    case 'name':
      if (typeof value === 'string' && value.trim().length < 2) {
        return '이름은 2자 이상 입력해 주세요.';
      }
      break;

    case 'email':
      if (typeof value === 'string' && !emailRegex.test(value)) {
        return '올바른 이메일 형식이 아닙니다.';
      }
      break;

    case 'password':
      if (typeof value === 'string' && value.length < 8) {
        return '비밀번호는 8자 이상이어야 합니다.';
      }
      break;

    case 'confirmPassword':
      if (typeof value === 'string' && value !== formData.password) {
        return '비밀번호가 일치하지 않습니다.';
      }
      break;

    case 'birthDate':
      if (typeof value === 'string' && value) {
        const birthYear = new Date(value).getFullYear();
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        if (age < 14) return '14세 이상만 가입할 수 있습니다.';
      } else if (!value) {
        return '생년월일을 입력해 주세요.';
      }
      break;

    case 'gender':
      if (value === '') return '성별을 선택해 주세요.';
      break;

    case 'agreeToTerms':
      if (value === false) return '이용약관에 동의해야 합니다.';
      break;
  }
  return undefined; // 오류 없음
}

// 전체 폼 유효성 검사
function validateForm(formData: SignupFormData): FormErrors {
  const errors: FormErrors = {};
  const keys = Object.keys(formData) as (keyof SignupFormData)[];

  for (const key of keys) {
    const error = validateField(key, formData[key], formData);
    if (error) errors[key] = error;
  }

  return errors;
}

// ============================================================
// SignupForm 컴포넌트
// ============================================================
const SignupForm: React.FC = () => {
  // 폼 데이터 상태 — SignupFormData 타입으로 명시
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);

  // 유효성 오류 상태 — FormErrors 타입
  const [errors, setErrors] = useState<FormErrors>({});

  // 제출 성공 상태 — boolean
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // 제출 중 상태 — boolean
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ① 텍스트/이메일/비밀번호/날짜 input 핸들러
  //    이벤트 타입: React.ChangeEvent<HTMLInputElement>
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;

    // checkbox와 일반 input을 구분하여 업데이트
    const newValue = type === 'checkbox' ? checked : value;

    // 폼 데이터 업데이트 — 이전 상태 유지 후 해당 필드만 변경
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // 실시간 오류 제거 (값을 변경하면 해당 필드 오류 즉시 제거)
    if (errors[name as keyof SignupFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ② select 핸들러
  //    이벤트 타입: React.ChangeEvent<HTMLSelectElement>
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value as Gender, // 타입 단언: value를 Gender 타입으로
    }));

    if (errors[name as keyof SignupFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ③ blur 이벤트 — 필드에서 포커스를 잃을 때 해당 필드 유효성 검사
  //    이벤트 타입: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name } = e.target;
    const key = name as keyof SignupFormData;
    const error = validateField(key, formData[key], formData);

    // 오류가 있으면 추가, 없으면 제거
    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  // ④ 폼 제출 핸들러
  //    이벤트 타입: React.FormEvent<HTMLFormElement>
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // 전체 유효성 검사
    const allErrors = validateForm(formData);

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors); // 모든 오류 표시
      return;
    }

    setIsLoading(true);

    // API 요청 시뮬레이션 (실제로는 fetch로 서버에 전송)
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));

    // 비밀번호 제외하고 콘솔 출력
    const { password, confirmPassword, ...publicData } = formData;
    console.log('회원가입 데이터:', publicData);

    setIsLoading(false);
    setIsSubmitted(true);
  };

  // 제출 성공 화면
  if (isSubmitted) {
    return (
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '60px' }}>✅</div>
        <h2>회원가입 완료!</h2>
        <p>{formData.name}님, 환영합니다!</p>
        <button
          onClick={() => {
            setFormData(initialFormData); // 폼 초기화
            setErrors({});
            setIsSubmitted(false);
          }}
          style={{ padding: '10px 20px', background: '#0066cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          처음으로 돌아가기
        </button>
      </div>
    );
  }

  // 스타일 헬퍼 — 오류 시 빨간색 테두리
  const inputStyle = (fieldName: keyof SignupFormData): React.CSSProperties => ({
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: `1px solid ${errors[fieldName] ? '#dc3545' : '#ccc'}`,
    fontSize: '14px',
    boxSizing: 'border-box',
  });

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>회원가입</h1>

      <form onSubmit={handleSubmit} noValidate>
        {/* 이름 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            이름 <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="홍길동"
            style={inputStyle('name')}
          />
          {errors.name && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
              {errors.name}
            </p>
          )}
        </div>

        {/* 이메일 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            이메일 <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="hong@example.com"
            style={inputStyle('email')}
          />
          {errors.email && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            비밀번호 <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="8자 이상 입력"
            style={inputStyle('password')}
          />
          {errors.password && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
              {errors.password}
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            비밀번호 확인 <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="비밀번호 재입력"
            style={inputStyle('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* 생년월일 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            생년월일 <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            onBlur={handleBlur}
            style={inputStyle('birthDate')}
          />
          {errors.birthDate && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
              {errors.birthDate}
            </p>
          )}
        </div>

        {/* 성별 select — React.ChangeEvent<HTMLSelectElement> */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            성별 <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleSelectChange} // select 전용 핸들러 사용
            onBlur={handleBlur}
            style={{ ...inputStyle('gender'), background: 'white' }}
          >
            <option value="">선택해 주세요</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
            <option value="other">기타</option>
          </select>
          {errors.gender && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
              {errors.gender}
            </p>
          )}
        </div>

        {/* 이용약관 동의 checkbox */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange} // checkbox도 동일한 핸들러 사용
            />
            <span>
              <a href="#" style={{ color: '#0066cc' }}>이용약관</a>에 동의합니다.{' '}
              <span style={{ color: 'red' }}>*</span>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
              {errors.agreeToTerms}
            </p>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            background: isLoading ? '#aaa' : '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? '처리 중...' : '가입하기'}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
