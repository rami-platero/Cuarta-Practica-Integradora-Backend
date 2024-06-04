import z from 'zod'

export const registerSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    age: z
    .any()
    .refine(
      (value) => {
        return !isNaN(value);
      },
      {
        message: "Age must be a number.",
      }
    ),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});