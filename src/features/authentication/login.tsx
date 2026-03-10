import { lazy } from "react";

const LoginForm = lazy(() => import("./components/login-form/login-form"));


const Login = () => {
  return (
    <div className="bg-gray-200 flex items-center justify-center h-full">
      <LoginForm />
    </div>
  );
};

export default Login;
