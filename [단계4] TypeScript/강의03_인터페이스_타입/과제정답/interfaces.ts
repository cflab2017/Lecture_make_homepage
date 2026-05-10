// ===================================================
// 과제 03 정답 — 쇼핑몰 타입 설계
// 컴파일: tsc interfaces.ts
// 실행:   node interfaces.js
// ===================================================

// ============================================================
// 1. ShippingAddress — 배송지 인터페이스
// ============================================================
interface ShippingAddress {
  recipient: string;    // 수령인 이름
  phone: string;        // 연락처
  zipCode: string;      // 우편번호 (5자리)
  address: string;      // 기본 주소
  detailAddress?: string; // 상세 주소 (선택)
}

// ============================================================
// 2. Product — 상품 인터페이스
// ============================================================
interface Product {
  id: number;
  readonly sku: string;  // 재고 관리 코드 (한 번 설정 후 변경 불가)
  name: string;
  price: number;
  category: string;
  stock: number;         // 재고 수량
  isAvailable: boolean;  // 판매 여부
  discountRate?: number; // 할인율 0~100 (선택적)
  description?: string;  // 상품 설명 (선택적)
  imageUrls?: string[];  // 이미지 URL 목록 (선택적)
}

// ============================================================
// 3. CartItem — 장바구니 항목 인터페이스
// ============================================================
interface CartItem {
  product: Product; // Product 객체 직접 포함
  quantity: number; // 수량
  selectedOptions?: { // 선택 옵션 (색상, 사이즈 등) — 인덱스 시그니처
    [key: string]: string; // 키: 옵션명, 값: 선택값
  };
  addedAt: string;  // 장바구니 담은 시각
}

// ============================================================
// 4. Order — 주문 인터페이스
// ============================================================
// 주문 상태 타입 — 리터럴 유니온으로 유효한 상태만 허용
type OrderStatus = 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled';

interface Order {
  readonly id: number;              // 주문 번호 (변경 불가)
  items: CartItem[];                // 주문 상품 목록
  status: OrderStatus;             // 주문 상태
  totalAmount: number;             // 총 결제 금액 (할인 적용)
  shippingAddress: ShippingAddress; // 배송지
  orderedAt: string;               // 주문 시각 (ISO 형식)
  paidAt?: string;                 // 결제 시각 (선택 — 결제 완료 후 기록)
  memo?: string;                   // 배송 메모 (선택)
}

// 도전: 주문 요약 타입 (Pick 유틸리티 타입)
type OrderSummary = Pick<Order, 'id' | 'status' | 'totalAmount' | 'orderedAt'>;

// ============================================================
// 더미 데이터
// ============================================================

// 상품 3개
const products: Product[] = [
  {
    id: 1,
    sku: 'SNEAKER-001-RED',
    name: '에어맥스 스니커즈 (레드)',
    price: 150000,
    category: '신발',
    stock: 25,
    isAvailable: true,
    discountRate: 10,  // 10% 할인
    imageUrls: ['https://example.com/shoes/red-1.jpg'],
  },
  {
    id: 2,
    sku: 'TSHIRT-001-BLK',
    name: '기본 반팔 티셔츠 (블랙)',
    price: 29000,
    category: '의류',
    stock: 0,
    isAvailable: false, // 품절
    discountRate: 0,
  },
  {
    id: 3,
    sku: 'BAG-001-BRN',
    name: '가죽 크로스백 (브라운)',
    price: 89000,
    category: '가방',
    stock: 10,
    isAvailable: true,
    description: '고급 가죽 소재, A4 수납 가능',
  },
];

// 장바구니 항목 2개
const cartItems: CartItem[] = [
  {
    product: products[0], // 스니커즈
    quantity: 1,
    selectedOptions: { 색상: '레드', 사이즈: '270' }, // 인덱스 시그니처 활용
    addedAt: new Date().toISOString(),
  },
  {
    product: products[2], // 가죽 크로스백
    quantity: 2,
    addedAt: new Date().toISOString(),
  },
];

// 주문 1개
const order: Order = {
  id: 20250115001,
  items: cartItems,
  status: 'paid',
  totalAmount: 313000, // (150000 * 0.9 * 1) + (89000 * 2) = 135000 + 178000 = 313000
  shippingAddress: {
    recipient: '홍길동',
    phone: '010-1234-5678',
    zipCode: '06234',
    address: '서울특별시 강남구 테헤란로 123',
    detailAddress: '456호',
  },
  orderedAt: new Date().toISOString(),
  paidAt: new Date().toISOString(),
  memo: '부재 시 경비실에 맡겨주세요.',
};

// ============================================================
// 유틸 함수
// ============================================================

// 장바구니 총 금액 계산 (할인율 적용)
function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const { price, discountRate } = item.product;
    // 할인율이 있으면 적용, 없으면 0% 할인
    const discount = discountRate ? discountRate / 100 : 0;
    const discountedPrice = price * (1 - discount); // 할인 가격
    return total + discountedPrice * item.quantity;
  }, 0);
}

// 주문 상태를 한국어로 변환
function getStatusLabel(status: OrderStatus): string {
  // 객체를 맵으로 활용 (switch 대신 더 간결하게)
  const labels: Record<OrderStatus, string> = {
    pending: '주문 대기',
    paid: '결제 완료',
    shipping: '배송 중',
    delivered: '배송 완료',
    cancelled: '주문 취소',
  };
  return labels[status];
}

// 재고 충분한지 확인
function checkStock(product: Product, quantity: number): boolean {
  // 판매 중이고 재고가 요청 수량 이상인지 확인
  return product.isAvailable && product.stock >= quantity;
}

// 할인 금액 계산 (도전 과제)
function calculateDiscount(product: Product): number {
  if (!product.discountRate) return 0; // 할인율 없으면 0
  return product.price * (product.discountRate / 100);
}

// ============================================================
// 출력 및 테스트
// ============================================================
console.log('=== 상품 목록 ===');
products.forEach((p) => {
  const discount = calculateDiscount(p);
  const finalPrice = p.price - discount;
  console.log(
    `[${p.sku}] ${p.name} - ${p.price.toLocaleString()}원` +
    (discount > 0 ? ` → ${finalPrice.toLocaleString()}원 (${p.discountRate}% 할인)` : '') +
    ` | 재고: ${p.stock}` +
    (p.isAvailable ? '' : ' [품절]')
  );
});

console.log('\n=== 장바구니 합계 ===');
const total = calculateCartTotal(cartItems);
console.log(`총 금액: ${total.toLocaleString('ko-KR')}원`);

console.log('\n=== 주문 정보 ===');
console.log(`주문 번호: ${order.id}`);
console.log(`주문 상태: ${getStatusLabel(order.status)}`);
console.log(`결제 금액: ${order.totalAmount.toLocaleString('ko-KR')}원`);
console.log(`배송지: ${order.shippingAddress.address} ${order.shippingAddress.detailAddress || ''}`);

console.log('\n=== 주문 요약 (OrderSummary) ===');
const summary: OrderSummary = {
  id: order.id,
  status: order.status,
  totalAmount: order.totalAmount,
  orderedAt: order.orderedAt,
};
console.log(summary);

console.log('\n=== 재고 확인 ===');
cartItems.forEach((item) => {
  const canOrder = checkStock(item.product, item.quantity);
  console.log(`${item.product.name} x${item.quantity}: ${canOrder ? '주문 가능' : '주문 불가'}`);
});
