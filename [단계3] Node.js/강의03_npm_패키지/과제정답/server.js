// ===================================================
// 과제 03 정답 — 날짜 포맷 변환기
// 실행: npm run dev  또는  node server.js
// ===================================================

// dayjs 패키지 가져오기
const dayjs = require('dayjs');

// 한국 요일 배열 (0=일요일 ~ 6=토요일)
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

// ① 오늘 날짜 객체 생성
const today = dayjs();

console.log('=== 오늘의 날짜 정보 ===');

// 기본 ISO 형식
console.log('기본 형식:', today.format('YYYY-MM-DD'));

// 한국 형식 + 요일
const weekdayKor = weekdays[today.day()]; // day()는 0~6 반환
console.log(`한국 형식: ${today.format('YYYY년 MM월 DD일')} (${weekdayKor}요일)`);

// 미국 형식: 월 이름 → 간단히 구현
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const usFormat = `${monthNames[today.month()]} ${today.date()}, ${today.year()}`;
console.log('미국 형식:', usFormat);

// 짧은 형식 (두 자리 연도)
console.log('짧은 형식:', today.format('YY/MM/DD'));

// 날짜 + 시간
console.log('시간 포함:', today.format('YYYY-MM-DD HH:mm:ss'));

// ② D-Day 계산기
console.log('\n=== D-Day 계산기 ===');

// 오늘부터 100일 후
const after100Days = today.add(100, 'day');
console.log('오늘부터 100일 후:', after100Days.format('YYYY-MM-DD'));

// 설날까지 D-Day 계산
const lunar = dayjs('2026-01-29'); // 2026년 설날
const dLunar = lunar.diff(today, 'day'); // diff: 두 날짜의 차이
if (dLunar > 0) {
  console.log(`설날(2026-01-29)까지 D-${dLunar}`);
} else if (dLunar === 0) {
  console.log('오늘이 설날입니다!');
} else {
  console.log(`설날이 ${Math.abs(dLunar)}일 지났습니다.`);
}

// 크리스마스까지 D-Day 계산
// 올해 크리스마스가 지났으면 내년 크리스마스 계산
let christmas = dayjs(`${today.year()}-12-25`);
if (today.isAfter(christmas)) {
  christmas = dayjs(`${today.year() + 1}-12-25`);
}
const dChristmas = christmas.diff(today, 'day');
console.log(`크리스마스(${christmas.format('YYYY-MM-DD')})까지 D-${dChristmas}`);

// ③ 생년월일 계산
console.log('\n=== 생년월일 입력 결과 ===');

// process.argv[2]로 생년월일 받기 (없으면 기본값 사용)
const birthdayStr = process.argv[2] || '1995-03-20';
const birthday = dayjs(birthdayStr);

// 유효한 날짜인지 확인
if (!birthday.isValid()) {
  console.log('유효하지 않은 날짜 형식입니다. YYYY-MM-DD 형식으로 입력하세요.');
} else {
  const age = today.diff(birthday, 'year');           // 만 나이 계산
  const livedDays = today.diff(birthday, 'day');       // 살아온 날 수

  console.log('입력한 생년월일:', birthday.format('YYYY-MM-DD'));
  console.log(`오늘 기준 나이: ${age}세`);
  console.log(`태어난 지: ${livedDays.toLocaleString()}일째`);
}

// ④ 도전: 이번 달 모든 날짜 출력
console.log('\n=== 이번 달 달력 ===');
const daysInMonth = today.daysInMonth(); // 이번 달 총 일수
const yearMonth = today.format('YYYY년 MM월');
console.log(yearMonth);

for (let d = 1; d <= daysInMonth; d++) {
  // 해당 달의 d번째 날 생성
  const date = today.date(d);
  const wd = weekdays[date.day()];
  const isWeekend = date.day() === 0 || date.day() === 6; // 주말 여부
  const mark = isWeekend ? ' ★' : '';  // 주말 표시
  console.log(`  ${d}일 (${wd})${mark}`);
}
