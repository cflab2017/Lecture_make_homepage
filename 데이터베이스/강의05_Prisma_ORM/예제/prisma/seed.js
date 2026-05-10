// ============================================
// 강의05 예제: 초기 데이터(Seed) 삽입 스크립트
// ============================================
// 실행: node prisma/seed.js
// (마이그레이션 후 한 번만 실행)
// ============================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('시드 데이터 삽입 시작...');

    // ─────────────────────────────────────────
    // 기존 데이터 삭제 (재실행 시 중복 방지)
    // 외래키가 있으므로 posts 먼저 삭제 후 users 삭제
    // ─────────────────────────────────────────
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    // ─────────────────────────────────────────
    // 유저 3명 생성 (각각 포스트 포함)
    // create 안에 posts를 중첩하면 연결도 자동 처리
    // ─────────────────────────────────────────
    const kim = await prisma.user.create({
        data: {
            name:  '김철수',
            email: 'kim@blog.com',
            bio:   '풀스택 개발자입니다.',
            posts: {
                create: [
                    {
                        title:     'Prisma ORM 시작하기',
                        content:   'Prisma는 Node.js를 위한 차세대 ORM입니다...',
                        published: true,  // 공개 포스트
                    },
                    {
                        title:     'SQLite vs PostgreSQL 비교',
                        content:   '언제 SQLite를 쓰고 언제 PostgreSQL을 쓸까요?',
                        published: true,
                    },
                    {
                        title:     '작성 중인 드래프트',
                        content:   '아직 작성 중...',
                        published: false, // 비공개 포스트
                    },
                ],
            },
        },
    });

    const lee = await prisma.user.create({
        data: {
            name:  '이영희',
            email: 'lee@blog.com',
            bio:   '백엔드 개발자, 커피를 사랑합니다.',
            posts: {
                create: [
                    {
                        title:     'Express.js 미들웨어 심화',
                        content:   '커스텀 미들웨어를 만드는 방법을 알아봅니다.',
                        published: true,
                    },
                    {
                        title:     'JWT vs 세션 인증 비교',
                        content:   '각 방식의 장단점을 분석합니다.',
                        published: true,
                    },
                ],
            },
        },
    });

    // 포스트 없는 유저도 생성 가능
    const park = await prisma.user.create({
        data: {
            name:  '박민준',
            email: 'park@blog.com',
        },
    });

    console.log(`유저 생성 완료: ${kim.name}, ${lee.name}, ${park.name}`);
    console.log('시드 데이터 삽입 완료!');
}

// main 함수 실행 후 연결 종료
main()
    .catch((e) => {
        console.error('시드 실패:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect(); // DB 연결 종료
    });
