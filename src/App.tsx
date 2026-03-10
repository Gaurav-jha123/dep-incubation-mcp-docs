import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import { QueryProvider } from "./providers/query-provider";
import Layout from "./layout/Layout";
import Login from "./features/authentication/login";
import { useAuthStore } from "./store/use-auth-store/use-auth-store";
import NotFound from "./components/not-found/not-found";
import Dashboard from "./features/dashboard/dashboard";
import UserForm from "./features/forms/form";
import Reports from "./features/reports/Reports";

function ProtectedRoute({ isAuthenticated }: { isAuthenticated: boolean }) {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export const APP_ROUTES = [
  { path: "dashboard", element: <Dashboard />, title: "Dashboard" },
  { path: "userform", element: <UserForm />, title: "User Form" },
  { path: "reports", element: <Reports />, title: "Analytics Reports" },
];

function App() {
  const { isLoggedIn } = useAuthStore();

  return (
    <BrowserRouter>
      <QueryProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
            }
          />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} />}>
            <Route element={<Layout />}>
              {/* Map through the routes object */}
              {APP_ROUTES.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </QueryProvider>
    </BrowserRouter>
  );
}

export default App;
