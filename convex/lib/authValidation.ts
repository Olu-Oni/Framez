import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";
import { z } from "zod";

const signUpParamsSchema = z.object({
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
    .min(8, "Password must be at least 8 characters")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  flow: z.literal("signUp"),
});

const signInParamsSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string(),
  flow: z.literal("signIn"),
});

export default Password({
  profile(params) {
    console.log(params);
    // For sign in
    if (params.flow === "signIn") {
      const { error, data } = signInParamsSchema.safeParse(params);
      if (error) {
        throw new ConvexError(z.treeifyError(error));
      }
      // Return minimal data for signin (only email required)
      return {
        email: data.email,
      } as { email: string; fullName?: string; userName?: string };
    }
    if (params.flow === "signUp") {
      console.log('signing up')
      const { error, data } = signUpParamsSchema.safeParse(params);
      console.log(error);
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
    }

    // Unknown flow - validate email and return
    const email = typeof params.email === "string" ? params.email : "";
    if (!email) {
      throw new ConvexError("Email is required");
    }
    return {
      email,
    } as { email: string; fullName?: string; userName?: string };
  },
});
