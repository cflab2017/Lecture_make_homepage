// ===================================================
// 강의 01 예제 — TypeScript 기초: JS 타입 오류를 TS로 해결
// 컴파일: tsc hello.ts
// 실행:   node hello.js
// ===================================================

// ============================================================
// BEFORE: JavaScript에서 발생하는 타입 오류 사례
// ============================================================

// 아래 주석을 해제하면 런타임까지 오류를 모름 (순수 JS)
/*
function addJS(a, b) {
  return a + b;
}
console.log(addJS('10', 20)); // '1020' — 버그! 개발자는 30을 원함
*/

// ============================================================
// AFTER: TypeScript로 변환 — 컴파일 시점에 오류 발견
// ============================================================

// ① 함수 매개변수와 반환 타입 명시
function add(a: number, b: number): number {
  return a + b;
}

console.log('=== 기본 타입 예제 ===');
console.log('10 + 20 =', add(10, 20)); // 정상: 30
// add('10', 20);   // 컴파일 오류: 'string'은 'number'에 할당 불가

// ② 변수 타입 선언
const userName: string = '홍길동';
const userAge: number = 30;
const isStudent: boolean = false;

console.log(`\n이름: ${userName}, 나이: ${userAge}, 학생: ${isStudent}`);

// ③ 타입 추론 — 초기값으로 타입 자동 결정
const city = '서울';    // 타입: string (명시 불필요)
const score = 95.5;    // 타입: number
// city = 42;           // 오류: number는 string에 할당 불가

// ④ any vs unknown 비교
console.log('\n=== any vs unknown ===');

let anyValue: any = '처음에 문자열';
anyValue = 100;           // any는 어떤 타입으로도 변경 가능
anyValue = { name: '객체' };
anyValue.method();        // 오류 없음 (런타임에 오류 발생 가능!)

let unknownValue: unknown = '알 수 없는 값';
// unknownValue.toUpperCase(); // 컴파일 오류: 타입 확인 필요

// unknown은 타입 확인 후 사용 — 안전함
if (typeof unknownValue === 'string') {
  console.log('unknown 문자열:', unknownValue.toUpperCase());
}

// ⑤ 배열 타입
console.log('\n=== 배열 타입 ===');
const numbers: number[] = [1, 2, 3, 4, 5];
const fruits: string[] = ['사과', '바나나', '딸기'];
const mixed: (string | number)[] = ['홍길동', 30, '서울', 100];

// numbers.push('문자열'); // 오류: string은 number[]에 넣을 수 없음
console.log('숫자 배열:', numbers);
console.log('문자 배열:', fruits);
console.log('혼합 배열:', mixed);

// ⑥ 튜플 — 고정된 길이와 타입의 배열
console.log('\n=== 튜플 ===');
const point: [number, number] = [10, 20];
const userInfo: [string, number, boolean] = ['홍길동', 30, false];

console.log('좌표:', point);
console.log('유저 정보:', userInfo);

// ⑦ null / undefined 처리
console.log('\n=== null/undefined ===');
let nullable: string | null = null;
let optional: number | undefined;

nullable = '값 할당'; // null에서 string으로 변경 가능
console.log('nullable:', nullable);

// ⑧ BEFORE/AFTER 비교 — 가장 흔한 버그 패턴
console.log('\n=== Before/After 비교 ===');

// Before (JavaScript): 런타임에 오류 발생
function getUserNameJS(user) {
  return user.name.toUpperCase(); // user가 null이면 런타임 오류
}

// After (TypeScript): 타입으로 null 케이스 강제 처리
interface User {
  name: string;
  age: number;
}

function getUserNameTS(user: User | null): string {
  if (user === null) {
    return '알 수 없음'; // null 처리 강제
  }
  return user.name.toUpperCase();
}

const validUser: User = { name: 'hong', age: 30 };
console.log(getUserNameTS(validUser)); // 'HONG'
console.log(getUserNameTS(null));      // '알 수 없음'
