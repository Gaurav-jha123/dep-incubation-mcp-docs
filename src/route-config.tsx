import { lazy } from "react";
const Dashboard = lazy(() => import("./features/dashboard/dashboard"));
const SkillMatrix = lazy(() => import("./features/skillMatrix/SkillMatrix"));
// const UserForm = lazy(() => import("./features/forms/form"));
const Reports = lazy(() => import("./features/reports/Reports"));

const APP_ROUTES: {
  path: string;
  element: React.ComponentType;
  title: string;
}[] = [
  { path: "dashboard", element: Dashboard, title: "Dashboard" },
  { path: "skillMatrix", element: SkillMatrix, title: "Skill Matrix" },
  // { path: "userform", element: UserForm, title: "User Form" },
  { path: "reports", element: Reports, title: "Reports" },
];

export default APP_ROUTES;
