import { convexAuth } from "@convex-dev/auth/server";
import Password from "./lib/authValidation";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});
