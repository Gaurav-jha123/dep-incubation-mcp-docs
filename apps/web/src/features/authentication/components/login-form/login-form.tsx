import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/atoms";
import { Toast } from "@/components/molecules";
import { Button } from "@/components/ui/button";

import { loginFormSchema } from "@/lib/schema/login-form.zod";
import { useAuthMutation } from "@/services/hooks/mutations/useAuthMutation";

function LoginForm() {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const { loginMutation } = useAuthMutation({
    onLoginError: (message) => {
      setErrorMessage(message);
    },
  });

  const handleOnSubmit = (data: z.infer<typeof loginFormSchema>) => {
    setErrorMessage(null);
    loginMutation.mutate(data);
  };

  // Auto-dismiss the error toast after 4 seconds
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  // Focus email input on mount for accessibility
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-[410px] mx-auto px-4">
      {errorMessage && (
        <div className="mb-4">
          <Toast
            title="Login failed"
            description={errorMessage}
            onClose={() => setErrorMessage(null)}
            className="border-destructive/50 bg-destructive/10 [&_svg]:text-destructive"
          />
        </div>
      )}
      <form
        className="w-full"
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

          <Button
            disabled={!isValid}
            data-testid="login-submit-btn"
            type="submit"
            variant="outline"
            aria-disabled={!isValid}
            className="w-full cursor-pointer h-12 mt-2 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Login
          </Button>
        </div>
      </div>
    </form>
    </div>
  );
}

export default LoginForm;