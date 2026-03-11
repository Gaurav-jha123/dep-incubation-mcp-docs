import { lazy } from "react";

export const APP_ROUTES = [
  { 
    path: "dashboard", 
    element: lazy(() => import("../features/dashboard/dashboard")), 
    title: "Dashboard" 
  },
  { 
    path: "skillMatrix", 
    element: lazy(() => import("../features/skillMatrix/SkillMatrix")), 
    title: "Skill Matrix" 
  },
  { 
    path: "userform", 
    element: lazy(() => import("../features/forms/form").then(mod => ({ default: mod.default }))), 
    title: "User Form" 
  },
  { 
    path: "reports", 
    element: lazy(() => import("../features/reports/Reports")), 
    title: "Reports" 
  },
];
