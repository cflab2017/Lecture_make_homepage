// ============================================
// 과제06 정답: 태그 기반 검색이 포함된 Memo 라우터
// ============================================

const express = require('express');
const Memo = require('../models/Memo');

const router = express.Router();

// ─────────────────────────────────────────
// GET /memos/tags — 사용 중인 전체 태그 목록
// (주의: /:id 라우트보다 먼저 등록해야 충돌하지 않음)
// ─────────────────────────────────────────
router.get('/tags', async (req, res) => {
    try {
        // distinct(): 특정 필드의 고유한(중복 없는) 값 목록 반환
        // 모든 메모의 tags 배열을 합쳐서 중복 제거
        const tags = await Memo.distinct('tags');

        // 알파벳/가나다 순 정렬
        tags.sort();

        res.json({ success: true, count: tags.length, data: tags });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─────────────────────────────────────────
// GET /memos — 전체 메모 목록 (태그 필터 지원)
// 쿼리: ?tag=태그명
// 예: GET /memos?tag=공부 → tags에 '공부'가 포함된 메모만
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const { tag } = req.query;

        // 필터 조건 구성
        const filter = {};

        if (tag) {
            // MongoDB 배열 검색: tags 배열에 tag 값이 포함된 문서
            // SQL의 WHERE '공부' IN tags 와 동일한 동작
            filter.tags = tag;
        }

        // find() → sort() → 최신 순 정렬
        const memos = await Memo.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: memos.length,
            filter: tag ? `태그: ${tag}` : '전체',
            data: memos,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─────────────────────────────────────────
// GET /memos/:id — 단일 메모 조회
// ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const memo = await Memo.findById(req.params.id);

        if (!memo) {
            return res.status(404).json({
                success: false,
                message: '메모를 찾을 수 없습니다.',
            });
        }

        res.json({ success: true, data: memo });
    } catch (err) {
        // ObjectId 형식 오류 (CastError)
        res.status(400).json({ success: false, message: '유효하지 않은 ID 형식입니다.' });
    }
});

// ─────────────────────────────────────────
// POST /memos — 메모 생성 (태그 배열 포함)
// Body: { title, content, tags?, isPublic? }
// 예: { title: "공부", content: "...", tags: ["공부", "개발"] }
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { title, content, tags = [], isPublic = false } = req.body;

        // 태그 배열 정제: 빈 문자열 제거, 앞뒤 공백 제거
        const cleanedTags = tags
            .map((tag) => tag.trim())        // 공백 제거
            .filter((tag) => tag.length > 0); // 빈 태그 제거

        // Memo.create(): 문서 생성 + 저장을 한 번에
        const memo = await Memo.create({
            title,
            content,
            tags: cleanedTags,
            isPublic,
        });

        res.status(201).json({
            success: true,
            message: '메모가 생성되었습니다.',
            data: memo,
        });
    } catch (err) {
        // required 필드 누락 시 ValidationError
        res.status(400).json({ success: false, message: err.message });
    }
});

// ─────────────────────────────────────────
// PUT /memos/:id — 메모 수정
// Body: { title?, content?, tags?, isPublic? }
// ─────────────────────────────────────────
router.put('/:id', async (req, res) => {
    try {
        const { title, content, tags, isPublic } = req.body;

        // 수정할 필드만 포함 (undefined이면 제외)
        const updateData = {};
        if (title     !== undefined) updateData.title     = title;
        if (content   !== undefined) updateData.content   = content;
        if (isPublic  !== undefined) updateData.isPublic  = isPublic;
        if (tags      !== undefined) {
            // 태그 배열 정제 후 업데이트
            updateData.tags = tags
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);
        }

        // findByIdAndUpdate(): 찾기 + 수정 한 번에
        // { new: true } → 수정 후 문서 반환
        // { runValidators: true } → 유효성 검사 실행
        const memo = await Memo.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!memo) {
            return res.status(404).json({
                success: false,
                message: '메모를 찾을 수 없습니다.',
            });
        }

        res.json({
            success: true,
            message: '메모가 수정되었습니다.',
            data: memo,
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// ─────────────────────────────────────────
// DELETE /memos/:id — 메모 삭제
// ─────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        // findByIdAndDelete(): 찾기 + 삭제 한 번에
        const memo = await Memo.findByIdAndDelete(req.params.id);

        if (!memo) {
            return res.status(404).json({
                success: false,
                message: '메모를 찾을 수 없습니다.',
            });
        }

        res.json({
            success: true,
            message: `"${memo.title}" 메모가 삭제되었습니다.`,
        });
    } catch (err) {
        res.status(400).json({ success: false, message: '유효하지 않은 ID 형식입니다.' });
    }
});

module.exports = router;
