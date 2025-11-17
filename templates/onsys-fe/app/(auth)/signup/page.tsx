import { SignupForm } from "@/_components/signup-form"
import { ThemeToggleButton } from "@/_components/theme-toggle-button"
import { authOptions } from "@/auth"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function SignupPage() {
  const session = await getServerSession(authOptions)
  
    if (session?.user?.id) {
      redirect("/a")
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggleButton />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-balance">Crie sua conta</h1>
          <p className="text-muted-foreground mt-2">Faça seu cadastro para continuar</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
