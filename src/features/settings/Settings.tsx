import BeautifulModal from "@/components/BeautifulModal";
import "./Settings.scss";

export default function Settings() {
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <p>Adjust your preferences and configurations here.</p>
      <BeautifulModal />
    </div>
  );
}