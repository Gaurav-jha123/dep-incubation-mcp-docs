import z from "zod";

export const loginFormSchema = z.object({
  emailId: z.email("Email Id is required."),
  password: z
    .string()
    .min(6, "Password is required.")
});