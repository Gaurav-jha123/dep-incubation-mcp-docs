import { lazy } from "react";

export const APP_ROUTES = [
  { 
    path: "dashboard", 
    element: lazy(() => import("../features/dashboard/dashboard").then(mod => ({ default: mod.Dashboard }))), 
    title: "Dashboard" 
  },
  { 
    path: "userform", 
    element: lazy(() => import("../features/forms/form").then(mod => ({ default: mod.default }))), 
    title: "User Form" 
  },
  { 
    path: "reports", 
    element: lazy(() => import("../features/reports/Reports").then(mod => ({ default: mod.Reports }))), 
    title: "Reports" 
  },
];
