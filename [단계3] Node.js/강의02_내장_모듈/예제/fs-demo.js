// ===================================================
// 강의 02 예제 — fs 모듈: 파일 읽기 → 단어 수 세기 → 결과 파일에 쓰기
// 실행: node fs-demo.js
// ===================================================

const fs = require('fs');
const path = require('path');

// ① 샘플 텍스트 파일 생성 (데모용)
const inputPath = path.join(__dirname, 'input.txt');
const sampleText = `Node.js는 서버 사이드 JavaScript 런타임입니다.
V8 엔진을 사용하여 빠른 실행 속도를 자랑합니다.
비동기 I/O 처리로 높은 성능을 발휘합니다.
npm을 통해 수많은 패키지를 활용할 수 있습니다.
웹 서버, CLI 도구, API 서버 등 다양하게 활용됩니다.`;

// 입력 파일 생성
fs.writeFileSync(inputPath, sampleText, 'utf-8');
console.log('✔ input.txt 파일 생성 완료');

// ② 파일 읽기 (동기 방식)
const content = fs.readFileSync(inputPath, 'utf-8');
console.log('\n--- 파일 내용 ---');
console.log(content);

// ③ 단어 수 세기
//   줄바꿈을 공백으로 바꾼 후, 공백으로 split → 단어 배열
const words = content
  .replace(/\n/g, ' ')   // 줄바꿈 → 공백
  .split(' ')            // 공백 기준으로 분리
  .filter(w => w.length > 0); // 빈 문자열 제거

const lineCount = content.split('\n').length;   // 줄 수
const wordCount = words.length;                 // 단어 수
const charCount = content.replace(/\s/g, '').length; // 공백 제외 글자 수

console.log('\n--- 분석 결과 ---');
console.log(`줄 수: ${lineCount}`);
console.log(`단어 수: ${wordCount}`);
console.log(`글자 수(공백 제외): ${charCount}`);

// ④ 결과를 output.txt에 저장
const outputPath = path.join(__dirname, 'output.txt');
const resultText = `=== 파일 분석 결과 ===
분석 일시: ${new Date().toLocaleString('ko-KR')}
원본 파일: input.txt

줄 수: ${lineCount}줄
단어 수: ${wordCount}개
글자 수(공백 제외): ${charCount}자
`;

fs.writeFileSync(outputPath, resultText, 'utf-8');
console.log('\n✔ 결과가 output.txt에 저장되었습니다.');

// ⑤ 저장된 결과 파일 다시 읽어서 확인
const saved = fs.readFileSync(outputPath, 'utf-8');
console.log('\n--- output.txt 내용 ---');
console.log(saved);

// ⑥ path 모듈 활용 예시
console.log('--- path 모듈 ---');
console.log('현재 디렉토리:', __dirname);
console.log('파일명:', path.basename(inputPath));
console.log('확장자:', path.extname(inputPath));
console.log('디렉토리:', path.dirname(inputPath));
