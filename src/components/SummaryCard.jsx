export default function SummaryCard({ title, value }) {
    return (
        <div style={{
            background: "#f3f4f6",
            padding: "20px",
            borderRadius: "10px",
            flex: 1
        }}>
            <p>{title}</p>
            <h3>{value}</h3>
        </div>
    );
}