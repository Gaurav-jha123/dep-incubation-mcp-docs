import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import "./App.css";

import { QueryProvider } from "./providers/query-provider";
import UserForm from './features/forms/form';
import Dashboard from "./features/dashboard/dashboard";
import Layout from "./layout/Layout";
import Projects from "./features/projects/Projects";
import Reports from "./features/reports/Reports";
import Settings from "./features/settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        {/* <nav>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>
        </nav> */}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div>Welcome Home!</div>} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="userform" element={<UserForm />} />
            <Route path="projects" element={<Projects />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </QueryProvider>
    </BrowserRouter>
  );
}

export default App;