// ===================================================
// 강의 03 예제 — npm 패키지 활용
// 실행: npm run dev (nodemon 사용)
//       node server.js (직접 실행)
//
// 사전 준비:
//   npm init -y
//   npm install dayjs
//   npm install --save-dev nodemon
//   package.json scripts에 "dev": "nodemon server.js" 추가
// ===================================================

// dayjs 패키지 불러오기 (npm install dayjs 필요)
const dayjs = require('dayjs');

// 한국어 로케일 설정 (선택 사항)
// require('dayjs/locale/ko');
// dayjs.locale('ko');

console.log('=== dayjs 날짜/시간 라이브러리 예제 ===\n');

// ① 현재 날짜/시간
const now = dayjs();
console.log('현재 날짜:', now.format('YYYY-MM-DD'));
console.log('현재 시간:', now.format('HH:mm:ss'));
console.log('현재 날짜+시간:', now.format('YYYY-MM-DD HH:mm:ss'));
console.log('한국식 날짜:', now.format('YYYY년 MM월 DD일'));

// ② 특정 날짜 생성
const birthday = dayjs('1990-05-15');
console.log('\n생일:', birthday.format('YYYY년 MM월 DD일'));

// ③ 날짜 계산
const nextWeek = now.add(7, 'day');
const lastMonth = now.subtract(1, 'month');
const nextYear = now.add(1, 'year');

console.log('\n--- 날짜 계산 ---');
console.log('7일 후:', nextWeek.format('YYYY-MM-DD'));
console.log('1달 전:', lastMonth.format('YYYY-MM-DD'));
console.log('1년 후:', nextYear.format('YYYY-MM-DD'));

// ④ 날짜 차이 계산
const today = dayjs();
const newYear = dayjs('2026-01-01');
const daysUntilNewYear = newYear.diff(today, 'day');
console.log('\n새해까지 남은 날:', daysUntilNewYear, '일');

// ⑤ 나이 계산
const birthYear = dayjs('1995-03-20');
const age = today.diff(birthYear, 'year');
console.log(`1995년 3월 20일생의 나이: ${age}세`);

// ⑥ 요일 정보
const days = ['일', '월', '화', '수', '목', '금', '토'];
const todayDayNum = now.day(); // 0(일) ~ 6(토)
console.log('\n오늘 요일:', days[todayDayNum] + '요일');

// ⑦ 유닉스 타임스탬프
console.log('\n유닉스 타임스탬프:', now.unix());
console.log('밀리초 타임스탬프:', now.valueOf());

// ⑧ nodemon 동작 확인용 메시지
console.log('\n서버 시작 시각:', now.format('HH:mm:ss'));
console.log('이 파일을 수정하면 nodemon이 자동으로 재시작합니다!');
