import { lazy } from "react";

const LoginForm = lazy(() => import("./components/login-form/login-form"));


const Login = () => {
  return (
    <main className="bg-background text-foreground flex items-center justify-center min-h-screen">
      <LoginForm />
    </main>
  );
};

export default Login;
