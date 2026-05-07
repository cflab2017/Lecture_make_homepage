export default function Card({ title, content }) {
    return (
        <div style={{
            padding: 20,
            background: "#f3f4f6",
            borderRadius: 8,
            marginTop: 20
        }}>
            <h2>{title}</h2>
            <p>{content}</p>
        </div>
    );
}
