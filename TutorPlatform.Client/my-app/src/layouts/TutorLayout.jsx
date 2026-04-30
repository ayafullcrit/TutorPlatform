import { Outlet } from "react-router-dom";
import TutorSidebar from "../components/tutor/TutorSidebar";
import TutorTopbar from "../components/tutor/TutorTopbar";

import "../styles/tutor/tutor-tokens.css";
import "../styles/tutor/tutor-layout.css";
import "../styles/tutor/tutor-sidebar.css";
import "../styles/tutor/tutor-dashboard.css";
import "../styles/tutor/tutor-classes.css";
import "../styles/tutor/tutor-students.css";
import "../styles/tutor/tutor-finance.css";
import "../styles/tutor/tutor-card.css";
import "../styles/tutor/tutor-subjects.css";

export default function TutorLayout() {
  return (
    <div className="tutor-layout">
      <aside className="tutor-layout__sidebar">
        <TutorSidebar />
      </aside>

      <div className="tutor-layout__main">
        <TutorTopbar />

        <main className="tutor-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}