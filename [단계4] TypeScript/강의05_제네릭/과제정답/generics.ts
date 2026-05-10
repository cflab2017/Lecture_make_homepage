// ===================================================
// 과제 05 정답 — 제네릭 API 응답 타입
// 컴파일: tsc generics.ts
// 실행:   node generics.js
// ===================================================

// ============================================================
// 1. ApiResponse<T> 제네릭 인터페이스
// ============================================================
// T는 응답 데이터의 타입 — 사용 시점에 결정됨
interface ApiResponse<T> {
  success: boolean;  // 성공 여부
  data?: T;          // 성공 시 데이터 (선택적)
  error?: string;    // 실패 시 에러 메시지 (선택적)
  message?: string;  // 추가 안내 메시지 (선택적)
  timestamp: string; // 응답 시각 (ISO 형식)
}

// ============================================================
// 2. 페이지네이션 타입
// ============================================================
// PaginatedData<T>: 아이템 배열 + 페이지 정보
interface PaginatedData<T> {
  items: T[];      // 현재 페이지의 아이템 배열
  total: number;   // 전체 항목 수
  page: number;    // 현재 페이지 (1부터 시작)
  limit: number;   // 페이지당 항목 수
  totalPages: number; // 전체 페이지 수
}

// PaginatedResponse<T>: 페이지네이션 데이터를 감싸는 API 응답
// type alias로 기존 타입 재활용
type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

// ============================================================
// 3. 헬퍼 함수 — 응답 객체 생성
// ============================================================

// 성공 응답 생성
// T: 데이터 타입, data: 응답 데이터, message: 선택적 안내 메시지
function success<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,                          // undefined면 포함 안 됨
    timestamp: new Date().toISOString(), // 현재 시각 자동 추가
  };
}

// 실패 응답 생성
// T = never: 기본값으로 never 사용 (data가 없으므로 의미없는 타입)
function failure<T = never>(error: string, message?: string): ApiResponse<T> {
  return {
    success: false,
    error,
    message,
    timestamp: new Date().toISOString(),
  };
}

// 페이지네이션 응답 생성 헬퍼
function paginatedSuccess<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
  message?: string
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit); // 전체 페이지 수 계산

  return success<PaginatedData<T>>(
    { items, total, page, limit, totalPages },
    message
  );
}

// ============================================================
// 4. 도전 과제 — 타입 가드 + unwrap
// ============================================================

// 타입 가드: response.data가 T 타입임을 보장
// 반환 타입의 'response is ApiResponse<T> & { data: T }' — 타입 서술어
function isSuccess<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { data: T } {
  return response.success && response.data !== undefined;
}

// unwrap: 성공이면 data 반환, 실패면 오류 던지기
function unwrap<T>(response: ApiResponse<T>): T {
  if (isSuccess(response)) {
    return response.data; // 타입 가드 덕분에 T 타입으로 안전하게 반환
  }
  throw new Error(response.error || '알 수 없는 오류가 발생했습니다.');
}

// ============================================================
// 5. 더미 데이터
// ============================================================
interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const dummyUsers: User[] = [
  { id: 1, name: '홍길동', email: 'hong@test.com', role: 'user' },
  { id: 2, name: '김철수', email: 'kim@test.com', role: 'admin' },
  { id: 3, name: '이영희', email: 'lee@test.com', role: 'user' },
  { id: 4, name: '박지성', email: 'park@test.com', role: 'user' },
  { id: 5, name: '손흥민', email: 'son@test.com', role: 'user' },
];

const dummyProducts: Product[] = [
  { id: 1, name: '노트북', price: 1500000, category: '전자기기' },
  { id: 2, name: '마우스', price: 50000, category: '전자기기' },
  { id: 3, name: '키보드', price: 120000, category: '전자기기' },
];

// ============================================================
// 6. 시나리오별 테스트
// ============================================================
console.log('=== 시나리오 1: 유저 1명 조회 성공 ===');
const targetId = 1;
const foundUser = dummyUsers.find((u) => u.id === targetId);
const userRes: ApiResponse<User> = foundUser
  ? success(foundUser, '유저 조회 성공')
  : failure(`ID ${targetId}인 유저를 찾을 수 없습니다.`);
console.log(JSON.stringify(userRes, null, 2));

console.log('\n=== 시나리오 2: 유저 목록 (페이지네이션) ===');
const page = 1;
const limit = 3;
const startIdx = (page - 1) * limit;
const pageItems = dummyUsers.slice(startIdx, startIdx + limit); // 현재 페이지 아이템
const userListRes: PaginatedResponse<User> = paginatedSuccess(
  pageItems,
  dummyUsers.length, // 전체 수
  page,
  limit,
  `${page}페이지 유저 목록`
);
console.log(JSON.stringify(userListRes, null, 2));

console.log('\n=== 시나리오 3: 상품 목록 조회 성공 ===');
const productRes: ApiResponse<Product[]> = success(dummyProducts, '상품 목록 조회 성공');
console.log(`성공: ${productRes.success}, 상품 수: ${productRes.data?.length}`);

console.log('\n=== 시나리오 4: 존재하지 않는 유저 조회 실패 ===');
const notFoundRes: ApiResponse<User> = failure('ID 999인 유저를 찾을 수 없습니다.');
console.log(JSON.stringify(notFoundRes, null, 2));

console.log('\n=== 시나리오 5: 서버 오류 ===');
const serverError: ApiResponse<never> = failure('DB 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.');
console.log(JSON.stringify(serverError, null, 2));

console.log('\n=== 도전 과제: 타입 가드 + unwrap ===');
// 성공 응답에서 data 안전하게 추출
if (isSuccess(userRes)) {
  // 이 블록 안에서 userRes.data는 User 타입으로 확정됨
  console.log('타입 가드 성공:', userRes.data.name);
}

// unwrap 사용
try {
  const data = unwrap(userRes);   // 성공 시 User 반환
  console.log('unwrap 성공:', data.name);

  unwrap(notFoundRes);            // 실패 시 오류 던짐
} catch (e) {
  console.log('unwrap 실패 포착:', (e as Error).message);
}
