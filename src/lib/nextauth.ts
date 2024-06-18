import { DefaultSession, NextAuthOptions, getServerSession } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './db';
import GoogleProvider from 'next-auth/providers/google'


// Étend l'interface de Session de NextAuth pour inclure l'ID de l'utilisateur
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}


// Étend l'interface de JWT de NextAuth pour inclure l'ID de l'utilisateur
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}


// Options de configuration de NextAuth pour l'authentification avec Google
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({token}) => {
      // Cherche l'utilisateur dans la db par email
      const db_user = await prisma.user.findFirst({
        where: {
          email: token?.email
        }
      })
      // Si l'utilisateur existe dans la db, ajoute son ID au token
      if (db_user) {
        token.id = db_user.id
      }
      return token
    },
    session: ({session, token}) => {
      // Si le token est présent, ajoute les infos de l'utilisateur à la session
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    // Configuration du fournisseur d'authentification Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ]
}


// Récupère la session d'authentification de l'utilisateur connecté
export const getAuthSession = () => {
  return getServerSession(authOptions)
}
