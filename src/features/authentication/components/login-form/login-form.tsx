import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useRef } from "react";

import { Input } from "@/components/atoms";
import { Alert } from "@/components/molecules";
import { Button } from "@/components/ui/button";

import { loginFormSchema } from "@/lib/schema/login-form.zod";
import { useAuthMutation } from "@/services/hooks/mutations/useAuthMutation";

function LoginForm() {
  const emailInputRef = useRef<HTMLInputElement>(null);

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

  const { loginMutation } = useAuthMutation();

  const handleOnSubmit = (data: z.infer<typeof loginFormSchema>) => {
    loginMutation.mutate(data);
  };

  // Focus email input on mount for accessibility
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  return (
    <form
      className="w-full max-w-sm sm:max-w-md md:max-w-[410px] mx-auto px-4"
      onSubmit={handleSubmit(handleOnSubmit)}
      aria-labelledby="login-form-title"
      noValidate
    >
      <div className="w-full rounded-xl border border-border bg-card p-8 text-card-foreground shadow-sm">
        <h1
          id="login-form-title"
          className="mb-8 text-center text-3xl font-bold text-card-foreground"
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
                ref={emailInputRef}
                id="login-form-email"
                type="email"
                label="Email"
                placeholder="Enter email"
                fullWidth
                error={fieldState.error?.message}
                inputSize="lg"
                required
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
                required
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
            className="w-full cursor-pointer h-12 mt-2 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Login
          </Button>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;