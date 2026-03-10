import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { EyeOffIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import useAuth from "@/lib/hooks/use-auth/use-auth";
import { loginFormSchema } from "@/lib/schema/login-form.zod";
import { Alert } from "@/components/Alert/Alert";

function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      emailId: "",
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
      className="w-[90%] lg:w-1/2 flex justify-center items-center"
      onSubmit={handleSubmit(handleOnSubmit)}
      aria-labelledby="login-form-title"
      noValidate
    >
      <FieldSet
        className="w-full max-w-lg bg-white rounded-xl !p-8 gap-0"
        role="group"
      >
        <h1
          id="login-form-title"
          className="text-2xl font-bold mb-1 text-center"
        >
          DEP Dashboard Login
        </h1>

        <FieldGroup className="mt-6">
          {/* EMAIL FIELD */}
          <Controller
            name="emailId"
            control={control}
            render={({ field, fieldState }) => {
              const errorId = "login-email-error";

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-form-email-id">
                    Email Id
                  </FieldLabel>

                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="login-form-email-id"
                      type="email"
                      placeholder="Input your email id"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={
                        fieldState.invalid ? errorId : undefined
                      }
                    />

                    <InputGroupAddon
                      align="inline-start"
                      className="mx-2"
                      aria-hidden="true"
                    >
                      <User aria-hidden="true" focusable="false" />
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError
                      id={errorId}
                      role="alert"
                      aria-live="assertive"
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              );
            }}
          />

          {/* PASSWORD FIELD */}
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => {
              const errorId = "login-password-error";

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-form-password">
                    Password
                  </FieldLabel>

                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="login-form-password"
                      type="password"
                      placeholder="Input your password"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={
                        fieldState.invalid ? errorId : undefined
                      }
                    />

                    <InputGroupAddon
                      align="inline-start"
                      className="mx-2"
                      aria-hidden="true"
                    >
                      <EyeOffIcon aria-hidden="true" focusable="false" />
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError
                      id={errorId}
                      role="alert"
                      aria-live="assertive"
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              );
            }}
          />

          <Alert message="Note: You can use any valid email and password until APIs are integrated." type="info" />
          
          <Button
            disabled={!isValid}
            data-testid="login-submit-btn"
            type="submit"
            variant="default"
            aria-disabled={!isValid}
          >
            Login
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

export default LoginForm;