// ============================================
// 강의05 예제: Prisma + Express API
// User & Post CRUD
// ============================================
// 실행 순서:
//   1. npx prisma migrate dev --name init
//   2. node prisma/seed.js
//   3. node api.js
// ============================================

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(express.json());

// ─────────────────────────────────────────
// Users API
// ─────────────────────────────────────────

// GET /users — 전체 유저 + 포스트 수
app.get('/users', async (req, res) => {
    // findMany: 여러 행 조회
    const users = await prisma.user.findMany({
        include: {
            _count: { select: { posts: true } }, // 포스트 수만 포함
        },
        orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: users });
});

// GET /users/:id — 유저 + 공개 포스트 목록
app.get('/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    // findUnique: 단일 행 조회 (없으면 null)
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            posts: {
                where: { published: true },     // 공개 포스트만
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!user) {
        return res.status(404).json({ success: false, message: '유저를 찾을 수 없습니다.' });
    }

    res.json({ success: true, data: user });
});

// POST /users — 유저 생성
// Body: { name, email, bio? }
app.post('/users', async (req, res) => {
    const { name, email, bio } = req.body;

    if (!name || !email) {
        return res.status(400).json({ success: false, message: 'name과 email은 필수입니다.' });
    }

    // 이메일 중복 확인
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return res.status(409).json({ success: false, message: '이미 사용 중인 이메일입니다.' });
    }

    // create: 단일 행 생성
    const user = await prisma.user.create({
        data: { name, email, bio },
    });

    res.status(201).json({ success: true, data: user });
});

// ─────────────────────────────────────────
// Posts API
// ─────────────────────────────────────────

// GET /posts — 공개 포스트 목록 (작성자 포함)
app.get('/posts', async (req, res) => {
    const posts = await prisma.post.findMany({
        where: { published: true },     // 공개된 포스트만
        include: {
            author: {
                select: { id: true, name: true } // 작성자 이름만 포함 (이메일 제외)
            },
        },
        orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: posts.length, data: posts });
});

// GET /posts/:id — 포스트 단건 조회 (조회수 증가)
app.get('/posts/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    // update로 조회수 증가 + 최신 데이터 반환을 한 번에 처리
    const post = await prisma.post.update({
        where: { id },
        data: { viewCount: { increment: 1 } }, // viewCount += 1
        include: { author: { select: { name: true, email: true } } },
    }).catch(() => null); // 없는 ID면 null 반환

    if (!post) {
        return res.status(404).json({ success: false, message: '포스트를 찾을 수 없습니다.' });
    }

    res.json({ success: true, data: post });
});

// POST /posts — 포스트 생성
// Body: { title, content, authorId, published? }
app.post('/posts', async (req, res) => {
    const { title, content, authorId, published = false } = req.body;

    if (!title || !content || !authorId) {
        return res.status(400).json({
            success: false,
            message: 'title, content, authorId는 필수입니다.',
        });
    }

    // 작성자 존재 확인
    const author = await prisma.user.findUnique({ where: { id: parseInt(authorId) } });
    if (!author) {
        return res.status(404).json({ success: false, message: '존재하지 않는 유저입니다.' });
    }

    const post = await prisma.post.create({
        data: {
            title,
            content,
            published,
            author: { connect: { id: parseInt(authorId) } }, // 기존 유저와 연결
        },
        include: { author: { select: { name: true } } },
    });

    res.status(201).json({ success: true, data: post });
});

// PUT /posts/:id — 포스트 수정
app.put('/posts/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content, published } = req.body;

    // updateMany 대신 update 사용 (단일 행)
    const post = await prisma.post.update({
        where: { id },
        data: {
            // undefined인 필드는 Prisma가 자동으로 무시 (부분 업데이트)
            ...(title     !== undefined && { title }),
            ...(content   !== undefined && { content }),
            ...(published !== undefined && { published }),
        },
    }).catch(() => null);

    if (!post) {
        return res.status(404).json({ success: false, message: '포스트를 찾을 수 없습니다.' });
    }

    res.json({ success: true, data: post });
});

// DELETE /posts/:id — 포스트 삭제
app.delete('/posts/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    const post = await prisma.post.delete({
        where: { id },
    }).catch(() => null);

    if (!post) {
        return res.status(404).json({ success: false, message: '포스트를 찾을 수 없습니다.' });
    }

    res.json({ success: true, message: `"${post.title}" 삭제 완료` });
});

// ─────────────────────────────────────────
// 서버 시작
// ─────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Prisma API 서버: http://localhost:${PORT}`);
    console.log('');
    console.log('Users: GET/POST /users, GET /users/:id');
    console.log('Posts: GET/POST /posts, GET/PUT/DELETE /posts/:id');
});
