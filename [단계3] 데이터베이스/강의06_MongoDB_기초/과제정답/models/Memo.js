// ============================================
// 과제06 정답: tags 배열 필드가 추가된 Memo 모델
// ============================================

const mongoose = require('mongoose');

// ─────────────────────────────────────────
// Memo 스키마 정의
// tags 필드(문자열 배열)를 추가하여 태그 기반 검색 지원
// ─────────────────────────────────────────
const memoSchema = new mongoose.Schema(
    {
        // 제목: 필수, 최대 100자
        title: {
            type:      String,
            required:  [true, '제목은 필수입니다.'],
            trim:      true,
            maxlength: [100, '제목은 100자를 초과할 수 없습니다.'],
        },

        // 내용: 필수
        content: {
            type:     String,
            required: [true, '내용은 필수입니다.'],
            trim:     true,
        },

        // 태그 배열: 문자열 배열, 기본값 빈 배열
        // MongoDB는 배열 필드를 기본으로 지원
        // find({ tags: '공부' }) → tags 배열에 '공부'가 포함된 문서 검색
        tags: {
            type:    [String], // 문자열 배열
            default: [],       // 태그 없으면 빈 배열
        },

        // 공개 여부: 기본값 false
        isPublic: {
            type:    Boolean,
            default: false,
        },
    },
    {
        // timestamps: true → createdAt, updatedAt 자동 관리
        timestamps: true,
    }
);

// ─────────────────────────────────────────
// 인덱스 설정 (선택)
// tags 필드에 인덱스 → 태그 검색 성능 향상
// ─────────────────────────────────────────
memoSchema.index({ tags: 1 });       // 태그 검색용
memoSchema.index({ createdAt: -1 }); // 최신 순 정렬용

// ─────────────────────────────────────────
// 모델 생성
// 컬렉션명: 'Memo' → 'memos'
// ─────────────────────────────────────────
const Memo = mongoose.model('Memo', memoSchema);

module.exports = Memo;
