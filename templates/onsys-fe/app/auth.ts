import NextAuth, { type NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string
      name?: string | null
      email?: string | null
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Senha", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const fixedEmail = process.env.AUTH_EMAIL
        const fixedPassword = process.env.AUTH_PASSWORD

        let senhaConfere = false

        if (fixedPassword?.startsWith("$2a$") || fixedPassword?.startsWith("$2b$")) {
          senhaConfere = await bcrypt.compare(credentials.password, fixedPassword)
        }
        else {
          senhaConfere = credentials.password === fixedPassword
        }

        if (credentials.email !== fixedEmail || !senhaConfere) {
          return null
        }

        return {
          id: "1",
          name: "Administrador",
          email: fixedEmail,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },

  pages: {
    signIn: "/",
    newUser: "/a?welcome-message=true",
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
