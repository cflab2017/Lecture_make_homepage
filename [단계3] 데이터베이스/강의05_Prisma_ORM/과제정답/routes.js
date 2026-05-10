// ============================================
// 과제05 정답: 댓글 CRUD API 라우터
// Prisma Client 사용
// ============================================
// 사용법 (메인 app.js에서):
//   const commentRoutes = require('./routes');
//   app.use('/', commentRoutes);
// ============================================

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// ─────────────────────────────────────────
// GET /posts/:postId/comments
// 특정 포스트의 댓글 목록 조회 (최신 순)
// ─────────────────────────────────────────
router.get('/posts/:postId/comments', async (req, res) => {
    const postId = parseInt(req.params.postId);

    // 포스트 존재 여부 먼저 확인
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
        return res.status(404).json({
            success: false,
            message: `ID ${postId}에 해당하는 포스트가 없습니다.`,
        });
    }

    // 해당 포스트의 댓글 목록 조회
    // include로 작성자 이름만 포함 (이메일 등 민감 정보 제외)
    const comments = await prisma.comment.findMany({
        where: { postId },                                // 해당 포스트의 댓글만
        include: {
            author: { select: { id: true, name: true } }, // 작성자 이름 포함
        },
        orderBy: { createdAt: 'desc' },                   // 최신 순
    });

    res.json({
        success: true,
        count: comments.length,
        data: comments,
    });
});

// ─────────────────────────────────────────
// POST /posts/:postId/comments
// 특정 포스트에 댓글 작성
// Body: { content, authorId }
// ─────────────────────────────────────────
router.post('/posts/:postId/comments', async (req, res) => {
    const postId = parseInt(req.params.postId);
    const { content, authorId } = req.body;

    // 필수 필드 검증
    if (!content || !authorId) {
        return res.status(400).json({
            success: false,
            message: 'content와 authorId는 필수입니다.',
        });
    }

    // 빈 내용 거부
    if (content.trim() === '') {
        return res.status(400).json({
            success: false,
            message: '댓글 내용이 비어있습니다.',
        });
    }

    // 포스트 존재 확인
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
        return res.status(404).json({
            success: false,
            message: `ID ${postId}에 해당하는 포스트가 없습니다.`,
        });
    }

    // 작성자 존재 확인
    const author = await prisma.user.findUnique({ where: { id: parseInt(authorId) } });
    if (!author) {
        return res.status(404).json({
            success: false,
            message: '존재하지 않는 유저입니다.',
        });
    }

    // 댓글 생성
    // connect를 사용하여 기존 포스트/유저와 연결
    const comment = await prisma.comment.create({
        data: {
            content: content.trim(),
            post:   { connect: { id: postId } },            // 포스트 연결
            author: { connect: { id: parseInt(authorId) } }, // 작성자 연결
        },
        include: {
            author: { select: { name: true } }, // 응답에 작성자 이름 포함
        },
    });

    res.status(201).json({
        success: true,
        message: '댓글이 작성되었습니다.',
        data: comment,
    });
});

// ─────────────────────────────────────────
// PUT /comments/:id
// 댓글 내용 수정
// Body: { content }
// ─────────────────────────────────────────
router.put('/comments/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { content } = req.body;

    // 내용 필수 검증
    if (!content || content.trim() === '') {
        return res.status(400).json({
            success: false,
            message: '수정할 내용을 입력해주세요.',
        });
    }

    // 댓글 존재 확인 + 수정을 한 번에 처리
    // .catch(() => null) 으로 없는 ID 에러를 null로 변환
    const comment = await prisma.comment.update({
        where: { id },
        data: { content: content.trim() },
        include: {
            author: { select: { name: true } }, // 응답에 작성자 포함
        },
    }).catch(() => null);

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: `ID ${id}에 해당하는 댓글이 없습니다.`,
        });
    }

    res.json({
        success: true,
        message: '댓글이 수정되었습니다.',
        data: comment,
    });
});

// ─────────────────────────────────────────
// DELETE /comments/:id
// 댓글 삭제
// ─────────────────────────────────────────
router.delete('/comments/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    // 삭제 실행 (없는 ID면 .catch에서 null 반환)
    const comment = await prisma.comment.delete({
        where: { id },
    }).catch(() => null);

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: `ID ${id}에 해당하는 댓글이 없습니다.`,
        });
    }

    res.json({
        success: true,
        message: '댓글이 삭제되었습니다.',
    });
});

module.exports = router;
