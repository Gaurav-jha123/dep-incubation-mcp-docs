import TinyBarChart from "./components/TinyBarChart";
import TwoLevelPieChart from "./components/TwoLevelPieChart";
import "./Reports.scss";

export default function Reports() {
  return (
    <div className="reports-page">
      <h1>Reports</h1>
      <p>View and generate reports here.</p>
      <TinyBarChart />
      TwoLevelPieChart

      <TwoLevelPieChart isAnimationActive={true}  />
    </div>
  );
}