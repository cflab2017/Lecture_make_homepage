import Link from "next/link";

export default function About() {
    return (
        <main style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto" }}>
            <h1 style={{ color: "#2563eb" }}>소개</h1>
            <p>웹 개발을 배우고 있는 김지훈입니다.</p>
            <p>강의1~5를 거쳐 Next.js 앱까지 만들 수 있게 됐습니다.</p>

            <p style={{ marginTop: 40 }}>
                <Link href="/">← 메인으로</Link>
            </p>
        </main>
    );
}
