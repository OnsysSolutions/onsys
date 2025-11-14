import NextAuth, { type NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Facebook from "next-auth/providers/facebook"
import Google from "next-auth/providers/google"
import { ProviderType } from "@prisma/client"
import bcrypt from "bcryptjs"
import {prisma} from "./_lib/prisma"

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
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

        const usuario = await prisma.usuario.findUnique({
          where: { email: credentials.email },
        })

        if (!usuario || !usuario.senhaHash) return null

        const senhaOk = await bcrypt.compare(
          credentials.password,
          usuario.senhaHash
        )

        if (!senhaOk) return null

        return {
          id: String(usuario.id),
          name: usuario.nome,
          email: usuario.email,
          image: usuario.image,
        }
      },
    }),

    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      async profile(profile) {
        let identity = await prisma.authIdentity.findUnique({
          where: {
            provider_providerId: {
              provider: ProviderType.FACEBOOK,
              providerId: profile.id,
            },
          },
          include: { usuario: true },
        });

        if (!identity) {

          const novoUsuario = await prisma.usuario.create({
            data: {
              nome: profile.name ?? "Usuário Facebook",
              email: profile.email,
              tipoUsuario: { connect: { id: 2 } },
              identities: {
                create: {
                  provider: ProviderType.FACEBOOK,
                  providerId: profile.id,
                },
              },
            },
          });

          identity = await prisma.authIdentity.findFirst({
            where: {
              usuarioId: novoUsuario.id,
              provider: ProviderType.FACEBOOK,
            },
            include: { usuario: true },
          });
        }

        const usuario = identity!.usuario;

        return {
          id: String(usuario.id),
          name: usuario.nome,
          email: usuario.email,
          image: usuario.image
        };
      },
    }),

     Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        let identity = await prisma.authIdentity.findUnique({
          where: {
            provider_providerId: {
              provider: ProviderType.GOOGLE,
              providerId: profile.sub, // Google fornece `sub` como ID único
            },
          },
          include: { usuario: true },
        })

        if (!identity) {
          const novoUsuario = await prisma.usuario.create({
            data: {
              nome: profile.name ?? "Usuário Google",
              email: profile.email,
              tipoUsuario: { connect: { id: 2 } }, // Usuário padrão
              identities: {
                create: {
                  provider: ProviderType.GOOGLE,
                  providerId: profile.sub,
                },
              },
            },
          })

          identity = await prisma.authIdentity.findFirst({
            where: {
              usuarioId: novoUsuario.id,
              provider: ProviderType.GOOGLE,
            },
            include: { usuario: true },
          })
        }

        const usuario = identity!.usuario

        return {
          id: String(usuario.id),
          name: usuario.nome,
          email: usuario.email,
          image: usuario.image
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        const usuario = await prisma.usuario.findUnique({
          where: { id: parseInt(token.sub) },
        })
        if (usuario && session.user) {
          session.user.id = String(usuario.id)
          session.user.name = usuario.nome
          session.user.email = usuario.email
          session.user.image = usuario.image
        }
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
