import { Spinner } from "@/components/ui/spinner";
import { lazy, Suspense } from "react";

const LoginForm = lazy(() => import("./components/login-form/login-form"));
const SkillMatrixLottie = lazy(
  () => import("./components/skill-matrix-lottie"),
);

const Login = () => {
  return (
    <div className="bg-gray-200 flex h-full">
      <LoginForm />
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <SkillMatrixLottie />
      </Suspense>
    </div>
  );
};

export default Login;
