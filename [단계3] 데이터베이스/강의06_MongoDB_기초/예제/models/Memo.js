// ============================================
// 강의06 예제: Memo 스키마 / 모델
// ============================================

const mongoose = require('mongoose');

// ─────────────────────────────────────────
// Memo 스키마 정의
// 스키마: 문서의 구조, 타입, 제약조건을 정의
// ─────────────────────────────────────────
const memoSchema = new mongoose.Schema(
    {
        // 제목: 문자열, 필수
        title: {
            type:     String,
            required: [true, '제목은 필수입니다.'],
            trim:     true,   // 앞뒤 공백 자동 제거
            maxlength:[100, '제목은 100자를 초과할 수 없습니다.'],
        },

        // 내용: 문자열, 필수
        content: {
            type:     String,
            required: [true, '내용은 필수입니다.'],
            trim:     true,
        },

        // 공개 여부: 기본값 false (비공개)
        isPublic: {
            type:    Boolean,
            default: false,
        },
    },
    {
        // timestamps: true → createdAt, updatedAt 자동 추가
        timestamps: true,
    }
);

// ─────────────────────────────────────────
// 모델 생성
// mongoose.model('모델명', 스키마)
// 컬렉션명: 자동으로 소문자 복수형 → 'Memo' → 'memos'
// ─────────────────────────────────────────
const Memo = mongoose.model('Memo', memoSchema);

module.exports = Memo;
