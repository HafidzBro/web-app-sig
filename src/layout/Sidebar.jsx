import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div style={{
            width: "220px",
            height: "100vh",
            background: "#1e3a8a",
            color: "white",
            padding: "20px"
        }}>
            <h2>Nusantara</h2>

            <Link to="/" style={{ display: "block", margin: "10px 0", color: "white" }}>
                Dashboard
            </Link>
            <Link to="/data" style={{ display: "block", margin: "10px 0", color: "white" }}>
                Data Reference
            </Link>
        </div>
    );
}