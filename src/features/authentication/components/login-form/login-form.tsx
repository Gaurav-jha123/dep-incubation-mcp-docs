import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Alert } from "@/components/Alert/Alert";
import { Input } from "@/components/Input/Input";

import useAuth from "@/lib/hooks/use-auth/use-auth";
import { loginFormSchema } from "@/lib/schema/login-form.zod";

function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  const { login, verifyUser } = useAuth();

  const handleOnSubmit = (_data: z.infer<typeof loginFormSchema>) => {
    login(_data);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    verifyUser(token || "");
  }, []);

  return (
    <form
      className="w-full max-w-sm sm:max-w-md md:max-w-[410px] mx-auto px-4"
      onSubmit={handleSubmit(handleOnSubmit)}
      aria-labelledby="login-form-title"
      noValidate
    >
      <div className="w-full bg-white rounded-xl p-8 shadow-sm">
        <h1
          id="login-form-title"
          className="text-3xl font-bold text-center mb-8"
        >
          Login
        </h1>

        <div className="space-y-5">
          {/* EMAIL */}
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                id="login-form-email"
                type="email"
                label="Email"
                placeholder="Enter email"
                fullWidth
                error={fieldState.error?.message}
                inputSize="lg"
              />
            )}
          />

          {/* PASSWORD */}
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                id="login-form-password"
                type="password"
                label="Password"
                placeholder="Enter password"
                fullWidth
                error={fieldState.error?.message}
                inputSize="lg"
              />
            )}
          />

          <div className="pt-1">
            <Alert
              message="Note: You can use any valid email and password until APIs are integrated."
              type="info"
            />
          </div>

          <Button
            disabled={!isValid}
            data-testid="login-submit-btn"
            type="submit"
            variant="default"
            aria-disabled={!isValid}
            className="w-full cursor-pointer h-12 mt-2"
          >
            Login
          </Button>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;