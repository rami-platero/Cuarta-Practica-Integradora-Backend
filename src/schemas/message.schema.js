import { z } from "zod";

export const messageSchema = z.object({
  user: z.string({
    required_error: "User is required",
    invalid_type_error: "User must be a string",
  }),
  message: z.string({
    required_error: "Message is required",
    invalid_type_error: "Message must be a string",
  }),
});
