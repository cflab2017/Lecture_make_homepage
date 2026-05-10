-- ============================================
-- 강의01 예제: 학생 테이블 스키마
-- ============================================

-- 기존 테이블이 있으면 삭제 (초기화용)
DROP TABLE IF EXISTS students;

-- 학생 테이블 생성
CREATE TABLE students (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,  -- 자동 증가 기본키
    name    TEXT    NOT NULL,                   -- 학생 이름 (필수)
    age     INTEGER,                            -- 나이
    grade   TEXT    NOT NULL,                   -- 학년 (예: '1학년')
    email   TEXT    UNIQUE                      -- 이메일 (중복 불가)
);

-- 샘플 데이터 삽입
INSERT INTO students (name, age, grade, email) VALUES
    ('김철수', 20, '1학년', 'kim@school.ac.kr'),
    ('이영희', 21, '2학년', 'lee@school.ac.kr'),
    ('박민준', 22, '3학년', 'park@school.ac.kr'),
    ('최수진', 20, '1학년', 'choi@school.ac.kr');

-- 전체 학생 조회
SELECT * FROM students;

-- 1학년만 조회
SELECT name, email FROM students WHERE grade = '1학년';
