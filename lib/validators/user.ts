import { z } from "zod";

export const CreateUserValidator = z
  .object({
    email: z.string().min(1, "Please fill in email").email("Invalid email"),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(20, { message: "Username must be at most 20 characters long" }),
    password: z
      .string()
      .min(1, "Please fill in password")
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });;


  export const LoginUserValidator = z.object({
    email: z.string().min(1, "Please fill in email").email("Invalid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must have than 6 characters"),
  });

export type CreateUserPayload = z.infer<typeof CreateUserValidator>;
export type LoginUserPayload = z.infer<typeof LoginUserValidator>;
