// ===================================================
// 과제 01 정답 — 기존 JS 함수에 타입 추가하기
// 컴파일: tsc hello.ts
// 실행:   node hello.js
// ===================================================

// ① 두 수의 합 — 매개변수와 반환값 모두 number
function sum(a: number, b: number): number {
  return a + b; // 두 수를 더해 반환
}

// ② 배열의 최댓값 — number 배열을 받아 number 반환
function getMax(arr: number[]): number {
  // 스프레드 연산자로 배열을 펼쳐 Math.max에 전달
  return Math.max(...arr);
}

// ③ 문자열 반복 — string + number 받아 string 반환
function repeat(str: string, count: number): string {
  // String.prototype.repeat: 문자열을 count번 반복
  return str.repeat(count);
}

// ④ 짝수만 필터링 — number 배열 받아 number 배열 반환
function filterEven(numbers: number[]): number[] {
  // 나머지가 0인 요소만 남김
  return numbers.filter((n) => n % 2 === 0);
}

// ⑤ 나이로 성인 여부 판단 — number 받아 boolean 반환
function isAdult(age: number): boolean {
  return age >= 18; // 18세 이상이면 true
}

// ============================================================
// 테스트 코드
// ============================================================
console.log('=== 과제 01 테스트 ===\n');

// sum 테스트
console.log('sum(10, 20):', sum(10, 20));     // 30
console.log('sum(3.5, 1.5):', sum(3.5, 1.5)); // 5

// getMax 테스트
console.log('\ngetMax([3, 1, 7, 2, 5]):', getMax([3, 1, 7, 2, 5])); // 7
console.log('getMax([-1, -5, -2]):', getMax([-1, -5, -2]));         // -1

// repeat 테스트
console.log('\nrepeat("안녕", 3):', repeat('안녕', 3));   // '안녕안녕안녕'
console.log('repeat("*", 5):', repeat('*', 5));         // '*****'

// filterEven 테스트
console.log('\nfilterEven([1,2,3,4,5,6]):', filterEven([1, 2, 3, 4, 5, 6])); // [2, 4, 6]
console.log('filterEven([11,12,13]):', filterEven([11, 12, 13]));           // [12]

// isAdult 테스트
console.log('\nisAdult(20):', isAdult(20));   // true
console.log('isAdult(17):', isAdult(17));   // false
console.log('isAdult(18):', isAdult(18));   // true (경계값)

// ============================================================
// 도전 과제 — 제네릭으로 pluck 함수 구현
// ============================================================

// T: 배열 요소의 타입, K: T의 키 타입
// T[K]: T 객체에서 K 키로 접근한 값의 타입
function pluck<T, K extends keyof T>(array: T[], key: K): T[K][] {
  // 배열의 각 요소에서 key에 해당하는 값만 추출
  return array.map((item) => item[key]);
}

// 테스트
const users = [
  { name: '홍길동', age: 30 },
  { name: '김철수', age: 25 },
  { name: '이영희', age: 28 },
];

console.log('\n=== 도전 과제: pluck ===');
console.log('이름 목록:', pluck(users, 'name')); // ['홍길동', '김철수', '이영희']
console.log('나이 목록:', pluck(users, 'age'));   // [30, 25, 28]
