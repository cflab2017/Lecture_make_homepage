// ===================================================
// 과제 02 정답 — 파일 이름 목록 저장기
// 실행: node fs-demo.js
//       node fs-demo.js ./src
// ===================================================

const fs = require('fs');
const path = require('path');

// ① 스캔할 디렉토리 결정
//    process.argv[2]로 폴더 경로를 받으면 그 폴더를 사용
//    없으면 현재 작업 디렉토리(__dirname) 사용
const targetDir = process.argv[2]
  ? path.resolve(process.argv[2])  // 상대경로를 절대경로로 변환
  : __dirname;

// 대상 폴더가 존재하는지 확인
if (!fs.existsSync(targetDir)) {
  console.error(`오류: '${targetDir}' 폴더가 존재하지 않습니다.`);
  process.exit(1);
}

console.log(`스캔 대상: ${targetDir}`);

// ② 디렉토리 내 항목 목록 읽기
const entries = fs.readdirSync(targetDir);

// ③ 파일과 폴더로 분류
let fileCount = 0;  // 파일 개수
let dirCount = 0;   // 폴더 개수
const lines = [];   // 출력 줄 목록

for (const entry of entries) {
  const fullPath = path.join(targetDir, entry); // 전체 경로
  const stat = fs.statSync(fullPath);           // 파일 정보 가져오기

  if (stat.isDirectory()) {
    // 폴더인 경우
    lines.push(`[폴더] ${entry}`);
    dirCount++;
  } else {
    // 파일인 경우 (크기도 함께 표시)
    const sizeKB = (stat.size / 1024).toFixed(2); // bytes → KB
    lines.push(`[파일] ${entry} (${sizeKB} KB)`);
    fileCount++;
  }
}

// ④ 현재 날짜/시간 포맷팅 (한국 형식)
const now = new Date();
const dateStr = now.toLocaleString('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

// ⑤ 저장할 텍스트 조합
const resultText = [
  '=== 파일 목록 ===',
  `생성 일시: ${dateStr}`,
  `스캔 경로: ${targetDir}`,
  '',
  ...lines,           // 배열의 각 요소를 펼쳐서 추가
  '',
  `총 파일 수: ${fileCount}개`,
  `총 폴더 수: ${dirCount}개`,
].join('\n'); // 줄바꿈으로 연결

// ⑥ filelist.txt에 저장
const outputPath = path.join(__dirname, 'filelist.txt');
fs.writeFileSync(outputPath, resultText, 'utf-8');

// ⑦ 콘솔에 결과 출력
console.log(resultText);
console.log(`\n✔ 목록이 filelist.txt에 저장되었습니다.`);

// ⑧ 도전: 확장자별 그룹화
const extMap = {}; // { '.js': ['a.js', 'b.js'], '.md': ['README.md'] }

for (const entry of entries) {
  const fullPath = path.join(targetDir, entry);
  const stat = fs.statSync(fullPath);

  if (stat.isFile()) {
    const ext = path.extname(entry) || '(확장자 없음)'; // 확장자 추출
    if (!extMap[ext]) extMap[ext] = [];                  // 없으면 배열 초기화
    extMap[ext].push(entry);                             // 파일 추가
  }
}

// 확장자별 그룹 출력
console.log('\n--- 확장자별 파일 그룹 ---');
for (const [ext, files] of Object.entries(extMap)) {
  console.log(`${ext}: ${files.join(', ')}`);
}
