// ===================================================
// 강의 05 예제 — 제네릭 Stack<T> + Partial<User> 업데이트
// 컴파일: tsc generics.ts
// 실행:   node generics.js
// ===================================================

// ============================================================
// 1. 제네릭 Stack<T> 클래스
// ============================================================
// T는 타입 매개변수 — 사용 시점에 실제 타입으로 결정됨
class Stack<T> {
  private items: T[] = []; // T 타입 배열 (내부 저장소)

  // push: T 타입 아이템 추가
  push(item: T): void {
    this.items.push(item);
  }

  // pop: 마지막 아이템 꺼내기 (비어있으면 undefined)
  pop(): T | undefined {
    return this.items.pop();
  }

  // peek: 마지막 아이템 확인 (꺼내지 않음)
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  // isEmpty: 비어있는지 확인
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // size getter
  get size(): number {
    return this.items.length;
  }

  // 전체 내용 출력
  print(): void {
    console.log(`Stack [${this.items.join(', ')}] (top → left)`);
  }
}

// ============================================================
// 2. 제네릭 함수 예시
// ============================================================

// 배열에서 조건에 맞는 첫 번째 요소 찾기
// T는 어떤 타입이든 가능, predicate는 T → boolean 함수
function findFirst<T>(arr: T[], predicate: (item: T) => boolean): T | undefined {
  return arr.find(predicate);
}

// 배열을 특정 키로 그룹화 (keyof 제약 활용)
// K는 T 객체의 키 중 하나여야 함
function groupBy<T, K extends keyof T>(
  arr: T[],
  key: K
): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const groupKey = String(item[key]); // 키 값을 문자열로 변환
    if (!groups[groupKey]) {
      groups[groupKey] = []; // 그룹 없으면 초기화
    }
    groups[groupKey].push(item); // 그룹에 추가
    return groups;
  }, {} as Record<string, T[]>);
}

// ============================================================
// 3. User 인터페이스 + Partial<User>로 업데이트 함수
// ============================================================
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: 'user' | 'admin';
}

// 더미 유저 데이터베이스
let users: User[] = [
  { id: 1, name: '홍길동', email: 'hong@test.com', age: 30, role: 'user' },
  { id: 2, name: '김철수', email: 'kim@test.com', age: 25, role: 'admin' },
  { id: 3, name: '이영희', email: 'lee@test.com', age: 28, role: 'user' },
];

// Partial<User>: 모든 필드가 선택적 — 일부 필드만 업데이트 가능
// Omit<User, 'id'>: id는 변경 불가이므로 제외
function updateUser(id: number, updates: Partial<Omit<User, 'id'>>): User | null {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null; // 유저 없으면 null 반환

  // 스프레드로 기존 데이터 유지 + 변경 내용 덮어쓰기
  users[index] = { ...users[index], ...updates };
  return users[index];
}

// ============================================================
// 4. 유틸리티 타입 예시
// ============================================================

// Pick: 공개용 유저 타입 (비밀번호 등 민감 정보 제외)
type PublicUser = Pick<User, 'id' | 'name' | 'role'>;

// Omit: 특정 필드 제외
type UserWithoutId = Omit<User, 'id'>;

// Record: 역할별 권한 매핑
type RolePermissions = Record<User['role'], string[]>;

const permissions: RolePermissions = {
  user: ['read'],
  admin: ['read', 'write', 'delete'],
};

// ReturnType: 함수 반환 타입 추출
function createUser(name: string, email: string): User {
  return { id: Date.now(), name, email, age: 0, role: 'user' };
}
type CreatedUser = ReturnType<typeof createUser>; // User와 동일

// ============================================================
// 테스트
// ============================================================
console.log('=== Stack<number> ===');
const numStack = new Stack<number>();
numStack.push(10);
numStack.push(20);
numStack.push(30);
numStack.print();
console.log('peek:', numStack.peek()); // 30 (꺼내지 않음)
console.log('pop:', numStack.pop());   // 30 (꺼냄)
console.log('size:', numStack.size);   // 2
numStack.print();

console.log('\n=== Stack<string> ===');
const strStack = new Stack<string>();
strStack.push('first');
strStack.push('second');
strStack.push('third');
strStack.print();

console.log('\n=== findFirst 제네릭 함수 ===');
const numbers = [1, 5, 3, 8, 2, 7];
const firstOver5 = findFirst(numbers, (n) => n > 5);
console.log('5보다 큰 첫 번째 수:', firstOver5); // 8

const words = ['사과', '바나나', '딸기', '포도'];
const longWord = findFirst(words, (w) => w.length > 2);
console.log('길이가 2 초과인 첫 번째 단어:', longWord); // '바나나'

console.log('\n=== groupBy 제네릭 함수 ===');
const grouped = groupBy(users, 'role'); // role 기준으로 그룹화
console.log('user 그룹:', grouped['user']?.map((u) => u.name));
console.log('admin 그룹:', grouped['admin']?.map((u) => u.name));

console.log('\n=== Partial<User> 업데이트 ===');
console.log('업데이트 전:', users[0]);
// 이름과 나이만 업데이트 (email, role은 그대로)
const updated = updateUser(1, { name: '홍길동(수정)', age: 31 });
console.log('업데이트 후:', updated);

console.log('\n=== 유틸리티 타입 — 역할별 권한 ===');
Object.entries(permissions).forEach(([role, perms]) => {
  console.log(`${role}: ${perms.join(', ')}`);
});
