import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import { QueryProvider } from "./providers/query-provider";
import Layout from "./layout/Layout";
import Login from "./features/authentication/login";
import { useAuthStore } from "./store/use-auth-store/use-auth-store";
import NotFound from "./components/not-found/not-found";
import "./App.css";
import APP_ROUTES from "./route-config";
import { Suspense } from "react";

function ProtectedRoute({ isAuthenticated }: { isAuthenticated: boolean }) {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  const { isLoggedIn } = useAuthStore();

  return (
    <BrowserRouter>
      <QueryProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              Loading...
            </div>
          }
        >
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
                {APP_ROUTES.map((route) => {
                  const Component = route.element;
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={<Component />}
                    />
                  );
                })}
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </QueryProvider>
    </BrowserRouter>
  );
}

export default App;
