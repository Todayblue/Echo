import { z } from "zod";

export const UserValidator = z.object({
  id: z.string({ required_error: "userId is required" }),
  name: z
    .string()
    .min(10, {
      message: "name must be at least 10 characters long",
    })
    .max(40, {
      message: "name must be less than 40 characters long",
    }),
  email: z
    .string(
      {required_error: "email is required"}
    )
    .min(10, {
      message: "email must be at least 10 characters long",
    })
    .max(40, {
      message: "email must be less than 40 characters long",
    }),
});

export type UserreationRequest = z.infer<typeof UserValidator>;
