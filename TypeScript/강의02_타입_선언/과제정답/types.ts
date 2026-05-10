// ===================================================
// 과제 02 정답 — 타입 안전한 계산기 함수
// 컴파일: tsc types.ts
// 실행:   node types.js
// ===================================================

// ① 연산자 타입 정의 — 4가지 연산자만 허용하는 리터럴 유니온 타입
// 리터럴 타입: 특정 문자열만 허용하여 오타를 컴파일 시점에 잡아냄
type Operator = '+' | '-' | '*' | '/';

// ② 덧셈 — number + number → number
function add(a: number, b: number): number {
  return a + b;
}

// ③ 뺄셈 — number - number → number
function subtract(a: number, b: number): number {
  return a - b;
}

// ④ 곱셈 — number * number → number
function multiply(a: number, b: number): number {
  return a * b;
}

// ⑤ 나눗셈 — 0으로 나누면 null 반환 (유니온 타입으로 표현)
function divide(a: number, b: number): number | null {
  if (b === 0) return null; // 0 나누기는 null로 표현
  return a / b;
}

// ⑥ calculate — 연산자를 매개변수로 받아 계산
// operator 타입을 Operator로 제한하여 잘못된 연산자 방지
function calculate(a: number, operator: Operator, b: number): number | null {
  switch (operator) {
    case '+':
      return add(a, b); // 덧셈

    case '-':
      return subtract(a, b); // 뺄셈

    case '*':
      return multiply(a, b); // 곱셈

    case '/':
      return divide(a, b); // 나눗셈 (null 가능)

    // TypeScript는 Operator 타입 덕분에 default에 도달 불가능함을 알 수 있음
    // 하지만 안전을 위해 남겨둠
    default:
      return null;
  }
}

// ============================================================
// 도전 과제 추가 함수
// ============================================================

// 거듭제곱 — base의 exponent 제곱
function power(base: number, exponent: number): number {
  return Math.pow(base, exponent); // Math.pow 사용
}

// 나머지 연산 — 0으로 나누면 null
function modulo(a: number, b: number): number | null {
  if (b === 0) return null; // 0 나누기 방지
  return a % b;
}

// 소수점 반올림 — decimals: 소수점 자릿수 (기본값 2)
function roundTo(value: number, decimals: number = 2): number {
  // Math.pow(10, decimals)로 배수를 만들어 반올림 후 나눔
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// ============================================================
// 테스트 코드
// ============================================================
console.log('=== 기본 사칙연산 ===');
console.log('add(10, 20):', add(10, 20));          // 30
console.log('subtract(50, 17):', subtract(50, 17)); // 33
console.log('multiply(6, 7):', multiply(6, 7));     // 42
console.log('divide(10, 3):', divide(10, 3));       // 3.333...
console.log('divide(10, 0):', divide(10, 0));       // null

console.log('\n=== calculate 함수 ===');
console.log("calculate(10, '+', 20):", calculate(10, '+', 20)); // 30
console.log("calculate(10, '-', 3):", calculate(10, '-', 3));   // 7
console.log("calculate(10, '*', 5):", calculate(10, '*', 5));   // 50
console.log("calculate(10, '/', 4):", calculate(10, '/', 4));   // 2.5
console.log("calculate(10, '/', 0):", calculate(10, '/', 0));   // null

// 타입 덕분에 아래 줄은 컴파일 오류 발생 (주석 해제 시)
// calculate(10, '%', 3); // 오류: '%'는 Operator에 없음

console.log('\n=== 도전 과제 ===');
console.log('power(2, 10):', power(2, 10));         // 1024
console.log('power(3, 3):', power(3, 3));            // 27
console.log('modulo(10, 3):', modulo(10, 3));        // 1
console.log('modulo(10, 0):', modulo(10, 0));        // null
console.log('roundTo(3.14159):', roundTo(3.14159));  // 3.14
console.log('roundTo(3.14159, 4):', roundTo(3.14159, 4)); // 3.1416

// null 결과 안전하게 처리하기
const result = divide(22, 7);
if (result !== null) {
  // TypeScript는 이 블록 안에서 result가 number임을 앎 (타입 좁히기)
  console.log('\n22/7 (소수점 5자리):', result.toFixed(5)); // '3.14286'
}
