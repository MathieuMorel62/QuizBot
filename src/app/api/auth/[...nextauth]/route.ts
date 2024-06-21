import { authOptions } from "@/lib/nextauth";
import NextAuth from "next-auth/next";


// Initialisation de la gestion de l'authentification avec NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
