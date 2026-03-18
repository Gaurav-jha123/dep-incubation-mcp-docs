import { lazy } from "react";

const LoginForm = lazy(() => import("./components/login-form/login-form"));


const Login = () => {
  return (
    <main className="bg-gray-200 flex items-center justify-center h-screen">
      <LoginForm />
    </main>
  );
};

export default Login;
