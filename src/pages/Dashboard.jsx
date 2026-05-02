import MapView from "../components/MapView";
import SummaryCard from "../components/SummaryCard";

export default function Dashboard() {
    return (
        <div>
            <div style={{ display: "flex", gap: "10px" }}>
                <SummaryCard title="Provinces" value="38" />
                <SummaryCard title="Total Area" value="1,904,569 km²" />
                <SummaryCard title="Islands" value="17,504" />
            </div>

            <div style={{ marginTop: "20px" }}>
                <MapView />
            </div>
        </div>
    );
}