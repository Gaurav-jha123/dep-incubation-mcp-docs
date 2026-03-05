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


function LoginForm() {
  const { control, handleSubmit } = useForm({
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
      className="w-full lg:w-1/2 flex justify-center items-center"
      onSubmit={handleSubmit(handleOnSubmit)}
    >
      <FieldSet className="w-full max-w-lg bg-white rounded-xl !p-8 gap-0">
        <p className="text-2xl font-bold text-left mb-1">
          Welcome to <br /> DEP Incubation Dashboard
        </p>
        <p className="text-xs text-left text-gray-500">
          The DEP Incubation Dashboard is a centralized analytics platform
          designed to evaluate and visualize the skill matrix of developers
          within EPAM Systems.
        </p>
        <FieldGroup className="mt-6">
          <Controller
            name="emailId"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-form-email-id">Email Id</FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="login-form-email-id"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Input your email id"
                    autoComplete="off"
                  />
                  <InputGroupAddon align="inline-start" className="mx-2">
                    <User />
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-form-password">Password</FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="login-form-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Input your password"
                    autoComplete="off"
                  />
                  <InputGroupAddon align="inline-start" className="mx-2">
                    <EyeOffIcon />
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <p className="text-xs text-gray-500">
            Note: you can use any email id and password till we integrate apis.
          </p>

          <Button data-testid="login-submit-btn" type="submit" variant={"default"}>
            Login
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

export default LoginForm;
