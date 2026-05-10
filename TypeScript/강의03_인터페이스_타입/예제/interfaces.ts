// ===================================================
// 강의 03 예제 — User/Admin/Product 인터페이스 설계
// 컴파일: tsc interfaces.ts
// 실행:   node interfaces.js
// ===================================================

// ============================================================
// 1. 기본 User 인터페이스
// ============================================================
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: 'user' | 'admin' | 'moderator'; // 리터럴 유니온으로 역할 제한
  createdAt: string;
  avatarUrl?: string; // 선택적 프로퍼티
  bio?: string;       // 선택적 프로퍼티
}

// ============================================================
// 2. Admin — User를 확장한 관리자 인터페이스
// ============================================================
interface Admin extends User {
  role: 'admin';                    // role을 'admin'으로 좁힘
  permissions: string[];            // 권한 목록
  level: number;                    // 관리자 레벨 (1~10)
  readonly joinedAt: string;        // 가입일 (변경 불가)
}

// ============================================================
// 3. Product 인터페이스
// ============================================================
interface Product {
  id: number;
  readonly sku: string;        // 재고 관리 코드 (변경 불가)
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;        // 선택적
  imageUrl?: string;           // 선택적
  tags?: string[];             // 선택적 태그 배열
  isAvailable: boolean;        // 판매 여부
}

// ============================================================
// 4. type alias — 상태 타입
// ============================================================
type UserStatus = 'active' | 'inactive' | 'banned';
type SortOrder = 'asc' | 'desc';

// ============================================================
// 5. 인덱스 시그니처 — 언어별 번역 맵
// ============================================================
interface TranslationMap {
  [key: string]: string; // 어떤 키든 문자열 값
}

// ============================================================
// 더미 데이터 배열
// ============================================================

// User 배열
const users: User[] = [
  {
    id: 1,
    name: '홍길동',
    email: 'hong@example.com',
    age: 30,
    role: 'user',
    createdAt: '2024-01-10',
    bio: 'Node.js 개발자',
  },
  {
    id: 2,
    name: '김철수',
    email: 'kim@example.com',
    age: 25,
    role: 'moderator',
    createdAt: '2024-03-15',
    avatarUrl: 'https://example.com/avatar/kim.jpg',
  },
  {
    id: 3,
    name: '이영희',
    email: 'lee@example.com',
    age: 28,
    role: 'user',
    createdAt: '2024-06-20',
  },
];

// Admin 객체
const superAdmin: Admin = {
  id: 100,
  name: '관리자',
  email: 'admin@example.com',
  age: 35,
  role: 'admin',
  createdAt: '2023-01-01',
  permissions: ['read', 'write', 'delete', 'manage_users'],
  level: 10,
  joinedAt: '2023-01-01',
};

// Product 배열
const products: Product[] = [
  {
    id: 1,
    sku: 'LAPTOP-001',
    name: '맥북 프로 14인치',
    price: 2500000,
    category: '노트북',
    stock: 15,
    description: 'M3 칩 탑재 고성능 노트북',
    tags: ['애플', '노트북', '고성능'],
    isAvailable: true,
  },
  {
    id: 2,
    sku: 'PHONE-001',
    name: '갤럭시 S25',
    price: 1200000,
    category: '스마트폰',
    stock: 0,
    isAvailable: false, // 재고 없음
  },
  {
    id: 3,
    sku: 'TABLET-001',
    name: '아이패드 Air',
    price: 900000,
    category: '태블릿',
    stock: 30,
    tags: ['애플', '태블릿'],
    isAvailable: true,
  },
];

// ============================================================
// 유틸 함수들 — 타입 활용
// ============================================================

// 유저 이름 포맷팅
function formatUserName(user: User): string {
  const roleEmoji = { user: '👤', admin: '👑', moderator: '🛡️' };
  return `${roleEmoji[user.role]} ${user.name} (${user.email})`;
}

// 상품 가격 포맷팅
function formatPrice(product: Product): string {
  const formattedPrice = product.price.toLocaleString('ko-KR');
  const status = product.isAvailable ? '판매 중' : '품절';
  return `${product.name}: ${formattedPrice}원 [${status}]`;
}

// 재고 있는 상품 필터링
function getAvailableProducts(products: Product[]): Product[] {
  return products.filter((p) => p.isAvailable && p.stock > 0);
}

// ============================================================
// 출력
// ============================================================
console.log('=== 유저 목록 ===');
users.forEach((u) => console.log(formatUserName(u)));

console.log('\n=== 관리자 정보 ===');
console.log(`이름: ${superAdmin.name}`);
console.log(`레벨: ${superAdmin.level}`);
console.log(`권한: ${superAdmin.permissions.join(', ')}`);

console.log('\n=== 전체 상품 ===');
products.forEach((p) => console.log(formatPrice(p)));

console.log('\n=== 구매 가능한 상품 ===');
getAvailableProducts(products).forEach((p) => console.log(formatPrice(p)));
