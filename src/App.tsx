// src/App.tsx
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router";
import { QueryProvider } from "./providers/query-provider";
import Layout from "./layout/Layout";
import Login from "./features/authentication/login";
import { useAuthStore } from "./store/use-auth-store/use-auth-store";
import NotFound from "./components/pages/not-found/not-found";
import "./App.css";
import APP_ROUTES from "./route-config";
import { Suspense, useEffect, useState, createContext, useContext } from "react";
import ErrorBoundary from "./components/infrastructure/ErrorBoundary/ErrorBoundary";
import { getMe, refreshTokenPost } from "./services/api/auth.api";

// ── Bootstrap context ──────────────────────────────────────────────────────
const BootstrapContext = createContext(true);
const useBootstrap = () => useContext(BootstrapContext);

// ── Route guards ───────────────────────────────────────────────────────────
function ProtectedRoute() {
  const isBootstrapping = useBootstrap();
  const { isLoggedIn } = useAuthStore();

  // Don't redirect until we know whether the session is valid
  if (isBootstrapping) return null;
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const isBootstrapping = useBootstrap();
  const { isLoggedIn } = useAuthStore();

  if (isBootstrapping) return null;
  return !isLoggedIn ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

// ── Auth bootstrap ─────────────────────────────────────────────────────────
function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAccessToken, clearUserDetails, setUserDetails } = useAuthStore();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const bootstrap = async () => {
      try {
        // 1. Try to get a fresh access token via the httpOnly refresh cookie
        const refreshRes = await refreshTokenPost();
        setAccessToken(refreshRes.data.accessToken);

        // 2. Fetch user profile (the refresh endpoint doesn't return user data)
        const meRes = await getMe();
        setUserDetails({
          ...meRes.data.user,
          token: refreshRes.data.accessToken,
        });
      } catch {
        // Refresh failed = no valid session → clear everything
        clearUserDetails();
      } finally {
        if (!controller.signal.aborted) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();
    return () => controller.abort();
  }, [clearUserDetails, setAccessToken, setUserDetails]);

  if (isBootstrapping) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <BootstrapContext.Provider value={isBootstrapping}>
      {children}
    </BootstrapContext.Provider>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
function App() {
  const { isLoggedIn } = useAuthStore();

  return (
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
        <ErrorBoundary>
          <Suspense
              fallback={
                <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh",
                }}
              >
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
  
              {/* Public-only routes (redirect to dashboard if already logged in) */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
              </Route>

                {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
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
        </ErrorBoundary>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  );
}

export default App;