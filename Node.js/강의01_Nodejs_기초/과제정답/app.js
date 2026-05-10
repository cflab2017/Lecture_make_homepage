// ===================================================
// 과제 01 정답 — CLI 계산기
// 실행: node app.js 10 + 20
// ===================================================

// process.argv 구조:
// [0] node 실행 경로
// [1] 현재 파일 경로
// [2] 첫 번째 인수 (숫자1)
// [3] 두 번째 인수 (연산자)
// [4] 세 번째 인수 (숫자2)
const args = process.argv.slice(2); // 앞의 두 요소 제거

// ① 인수 개수 검사 — 3개가 아니면 사용법 안내
if (args.length < 3) {
  console.error('사용법: node app.js 숫자1 연산자 숫자2');
  console.error('예시:   node app.js 10 + 20');
  process.exit(1); // 비정상 종료 (exit code 1)
}

// ② 인수 파싱
const num1 = Number(args[0]);   // 첫 번째 숫자
const operator = args[1];       // 연산자 (+, -, *, /)
const num2 = Number(args[2]);   // 두 번째 숫자

// ③ 숫자 유효성 검사 — NaN이면 오류 출력
if (isNaN(num1) || isNaN(num2)) {
  console.error('오류: 숫자만 입력할 수 있습니다.');
  process.exit(1);
}

// ④ 연산자별 계산
let result; // 계산 결과를 저장할 변수

switch (operator) {
  case '+':
    result = num1 + num2;
    break;

  case '-':
    result = num1 - num2;
    break;

  case '*':
    result = num1 * num2;
    break;

  case '/':
    // 0으로 나누기 예외 처리
    if (num2 === 0) {
      console.error('오류: 0으로 나눌 수 없습니다.');
      process.exit(1);
    }
    result = num1 / num2;
    break;

  default:
    // 지원하지 않는 연산자 처리
    console.error(`오류: '${operator}'는 지원하지 않는 연산자입니다.`);
    console.error('지원 연산자: + - * /');
    process.exit(1);
}

// ⑤ 결과 출력 — 소수점이 있으면 최대 2자리까지만 표시
const displayResult = Number.isInteger(result)
  ? result
  : result.toFixed(2);

console.log(`${num1} ${operator} ${num2} = ${displayResult}`);
