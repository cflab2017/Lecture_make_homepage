"use client";

import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div style={{
            padding: 20,
            background: "#f3f4f6",
            borderRadius: 8,
            marginTop: 20
        }}>
            <h2>클릭 카운터</h2>
            <p>버튼을 누른 횟수: {count}</p>
            <button
                onClick={() => setCount(count + 1)}
                style={{
                    padding: "10px 20px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer"
                }}
            >
                눌러보세요
            </button>
        </div>
    );
}
