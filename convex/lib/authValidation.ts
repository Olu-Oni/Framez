import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";
import { z } from "zod";

export const AuthParamsSchema = z.object({
  email: z.email("Invalid email address"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export default Password({
  profile(params) {
    console.log(params)
    const { error, data } = AuthParamsSchema.safeParse(params);
    console.log(error)
    if (error) {
      throw new ConvexError(z.treeifyError(error));
    }

    // Returning only fields to be stored on the user profile
    return {
      email: data.email,
      fullName: data.fullName,
      userName: data.userName,
      // password handled by the Password provider
    };
  },
});
