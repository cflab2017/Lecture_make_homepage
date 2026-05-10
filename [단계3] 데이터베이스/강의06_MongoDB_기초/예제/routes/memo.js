// ============================================
// 강의06 예제: Memo CRUD 라우터
// ============================================

const express = require('express');
const Memo = require('../models/Memo');

const router = express.Router();

// ─────────────────────────────────────────
// GET /memos — 전체 메모 목록
// 쿼리: ?tag=태그명 으로 필터링 가능
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const { tag } = req.query;

        // 필터 조건 빌드
        const filter = {};
        if (tag) {
            filter.tags = tag; // 배열 필드에서 특정 값 검색 (MongoDB 자동 처리)
        }

        // find(): 조건에 맞는 문서 전체 조회
        const memos = await Memo.find(filter).sort({ createdAt: -1 }); // 최신 순

        res.json({ success: true, count: memos.length, data: memos });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─────────────────────────────────────────
// GET /memos/:id — 단일 메모 조회
// ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        // findById(): ObjectId로 단건 조회 (없으면 null)
        const memo = await Memo.findById(req.params.id);

        if (!memo) {
            return res.status(404).json({ success: false, message: '메모를 찾을 수 없습니다.' });
        }

        res.json({ success: true, data: memo });
    } catch (err) {
        // ObjectId 형식이 잘못된 경우 CastError 발생
        res.status(400).json({ success: false, message: '유효하지 않은 ID 형식입니다.' });
    }
});

// ─────────────────────────────────────────
// POST /memos — 메모 생성
// Body: { title, content, isPublic? }
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { title, content, isPublic } = req.body;

        // Memo.create(): new Memo() + save()를 한 번에 처리
        const memo = await Memo.create({ title, content, isPublic });

        res.status(201).json({ success: true, data: memo });
    } catch (err) {
        // 유효성 검사 실패 (required 등) → ValidationError
        res.status(400).json({ success: false, message: err.message });
    }
});

// ─────────────────────────────────────────
// PUT /memos/:id — 메모 수정
// Body: { title?, content?, isPublic? }
// ─────────────────────────────────────────
router.put('/:id', async (req, res) => {
    try {
        const { title, content, isPublic } = req.body;

        // findByIdAndUpdate(): 찾고 + 수정을 한 번에
        // { new: true } → 수정 후 문서 반환 (기본은 수정 전 문서)
        // { runValidators: true } → 스키마 유효성 검사 적용
        const memo = await Memo.findByIdAndUpdate(
            req.params.id,
            { title, content, isPublic },
            { new: true, runValidators: true }
        );

        if (!memo) {
            return res.status(404).json({ success: false, message: '메모를 찾을 수 없습니다.' });
        }

        res.json({ success: true, data: memo });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// ─────────────────────────────────────────
// DELETE /memos/:id — 메모 삭제
// ─────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        // findByIdAndDelete(): 찾고 + 삭제를 한 번에
        const memo = await Memo.findByIdAndDelete(req.params.id);

        if (!memo) {
            return res.status(404).json({ success: false, message: '메모를 찾을 수 없습니다.' });
        }

        res.json({ success: true, message: `"${memo.title}" 메모가 삭제되었습니다.` });
    } catch (err) {
        res.status(400).json({ success: false, message: '유효하지 않은 ID 형식입니다.' });
    }
});

module.exports = router;
