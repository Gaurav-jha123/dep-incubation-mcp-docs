import "./App.css";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import Dashboard from "./features/dashboard/dashboard";
import { QueryProvider } from "./providers/query-provider";
import UserForm from "./features/forms/form";
import Layout from "./layout/Layout";
import Projects from "./features/projects/Projects";
import Reports from "./features/reports/Reports";
import Settings from "./features/settings/Settings";
import Login from "./features/authentication/login";
import { useAuthStore } from "./store/use-auth-store/use-auth-store";
import NotFound from "./components/not-found/not-found";

function ProtectedRoute({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (isAuthenticated) return <Outlet />;
  return <Navigate to={"/login"} replace />;
}

function App() {
  const { isLoggedIn } = useAuthStore();

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
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/"  element={<App />} /> */}

          <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} />}>
            <Route element={<Layout />}>
              <Route index element={<div>Welcome Home!</div>} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="userform" element={<UserForm />} />
              <Route path="projects" element={<Projects />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </QueryProvider>
    </BrowserRouter>
  );
}

export default App;
