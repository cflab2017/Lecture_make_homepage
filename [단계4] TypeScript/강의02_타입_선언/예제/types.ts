// ===================================================
// 강의 02 예제 — 다양한 타입의 유틸 함수
// 컴파일: tsc types.ts
// 실행:   node types.js
// ===================================================

// ============================================================
// 1. isAdult — 나이 기반 성인 여부 판단
// ============================================================
// 매개변수: age (number), 반환: boolean
function isAdult(age: number): boolean {
  return age >= 18;
}

// ============================================================
// 2. formatName — 이름 포맷팅 (선택적 매개변수)
// ============================================================
// title은 선택적 — 없으면 이름만 반환
function formatName(name: string, title?: string): string {
  if (title) {
    return `${title} ${name}`;
  }
  return name;
}

// ============================================================
// 3. divide — 나눗셈 (0 나누기 예외 처리)
// ============================================================
// 나누기 결과는 number 또는 null (0으로 나눌 때)
function divide(a: number, b: number): number | null {
  if (b === 0) return null; // 0으로 나누면 null 반환
  return a / b;
}

// ============================================================
// 4. logInfo — 로그 출력 (void 반환)
// ============================================================
// 반환값이 없으면 void
function logInfo(message: string, level: string = 'INFO'): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

// ============================================================
// 5. assertNonNull — null 검사 후 오류 던지기 (never)
// ============================================================
// 값이 null이면 오류를 던져 프로그램을 중단
function assertNonNull<T>(value: T | null, fieldName: string): T {
  if (value === null || value === undefined) {
    // 이 throw 이후로 함수는 절대 실행되지 않음 (never)
    throw new Error(`${fieldName} 값이 null입니다.`);
  }
  return value;
}

// ============================================================
// 6. clamp — 값을 범위 내로 제한
// ============================================================
function clamp(value: number, min: number, max: number): number {
  if (value < min) return min; // 최솟값보다 작으면 최솟값
  if (value > max) return max; // 최댓값보다 크면 최댓값
  return value;                // 범위 내면 그대로
}

// ============================================================
// 7. truncate — 문자열을 지정 길이로 자르기
// ============================================================
function truncate(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  // slice로 앞부분 추출 후 '...' 추가
  return text.slice(0, maxLength - 3) + '...';
}

// ============================================================
// 테스트 실행
// ============================================================
console.log('=== isAdult ===');
console.log('20살:', isAdult(20));   // true
console.log('17살:', isAdult(17));   // false

console.log('\n=== formatName ===');
console.log(formatName('홍길동'));               // '홍길동'
console.log(formatName('홍길동', '선생님'));     // '선생님 홍길동'
console.log(formatName('박지성', 'Dr.'));        // 'Dr. 박지성'

console.log('\n=== divide ===');
console.log('10 / 3:', divide(10, 3));    // 3.333...
console.log('10 / 0:', divide(10, 0));    // null

// null 체크 후 사용 (타입 안전)
const result = divide(10, 3);
if (result !== null) {
  console.log('소수점 2자리:', result.toFixed(2)); // '3.33'
}

console.log('\n=== logInfo ===');
logInfo('서버 시작');                     // INFO 레벨
logInfo('DB 연결 실패', 'ERROR');         // ERROR 레벨

console.log('\n=== clamp ===');
console.log('clamp(15, 0, 10):', clamp(15, 0, 10)); // 10
console.log('clamp(-5, 0, 10):', clamp(-5, 0, 10)); // 0
console.log('clamp(5, 0, 10):', clamp(5, 0, 10));   // 5

console.log('\n=== truncate ===');
const longText = 'TypeScript는 JavaScript에 정적 타입을 추가한 언어로, 대규모 프로젝트에 매우 유용합니다.';
console.log(truncate(longText, 30)); // 잘린 텍스트
console.log(truncate('짧은 텍스트', 30)); // 그대로 반환

console.log('\n=== assertNonNull ===');
try {
  const value = assertNonNull(null, 'userName'); // 오류 발생
} catch (e) {
  console.log('오류 포착:', (e as Error).message);
}
console.log('정상 값:', assertNonNull('홍길동', 'userName')); // '홍길동'
