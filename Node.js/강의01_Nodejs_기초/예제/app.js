// ===================================================
// 강의 01 예제 — Node.js 기초
// 실행: node app.js
//       node app.js 홍길동
// ===================================================

// 1. 기본 출력
console.log('안녕하세요, Node.js 세계!');
console.log('Node.js 버전:', process.version);
console.log('운영체제:', process.platform);

// 2. process.argv로 이름 받아 인사하기
const args = process.argv.slice(2); // 앞의 두 요소(node, 파일명)를 제거

if (args.length > 0) {
  const name = args[0];
  console.log(`\n안녕하세요, ${name}님! Node.js에 오신 것을 환영합니다.`);
} else {
  console.log('\n이름을 입력하지 않았습니다. 사용법: node app.js [이름]');
}

// 3. 현재 작업 디렉토리와 환경 정보 출력
console.log('\n--- 실행 환경 정보 ---');
console.log('작업 디렉토리:', process.cwd());
console.log('Node.js 버전:', process.versions.node);

// 4. 간단한 CLI 계산 스크립트 (덤으로 보여주는 예시)
console.log('\n--- 간단한 계산 ---');
const numbers = [10, 20, 30, 40, 50];
const sum = numbers.reduce((acc, cur) => acc + cur, 0);
const avg = sum / numbers.length;
console.log('숫자 목록:', numbers.join(', '));
console.log('합계:', sum);
console.log('평균:', avg);

// 5. 모듈 시스템 데모 (CommonJS)
// 다른 파일에서 사용할 수 있도록 내보내기 예시
const greet = (name) => `안녕하세요, ${name}님!`;
const farewell = (name) => `안녕히 가세요, ${name}님!`;

module.exports = { greet, farewell };

// 직접 실행 시에만 아래 코드 실행 (모듈로 불렸을 때는 실행 안 됨)
if (require.main === module) {
  console.log('\n--- 함수 테스트 ---');
  console.log(greet('개발자'));
  console.log(farewell('개발자'));
}
