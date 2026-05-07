import Card from "./Card";
import Counter from "./Counter";
import Link from "next/link";

const cards = [
    { title: "관심사", content: "웹 프론트엔드, 게임 개발" },
    { title: "연락처", content: "jihoon@example.com" },
    { title: "좋아하는 것", content: "커피 ☕" },
];

export default function Home() {
    return (
        <main style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto" }}>
            <h1 style={{ color: "#2563eb" }}>안녕하세요, 김지훈입니다 👋</h1>
            <p>Next.js로 만든 첫 페이지입니다.</p>

            {cards.map((c, i) => (
                <Card key={i} title={c.title} content={c.content} />
            ))}

            <Counter />

            <p style={{ marginTop: 40 }}>
                <Link href="/about">소개 페이지로 이동 →</Link>
            </p>
        </main>
    );
}
