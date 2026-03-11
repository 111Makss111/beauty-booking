import NextAuth from "next-auth";
import { authOptions } from "@/auth/auth-options"; // перевір свій шлях

const handler = NextAuth(authOptions);

// Next.js App Router вимагає експортувати GET та POST
export { handler as GET, handler as POST };
