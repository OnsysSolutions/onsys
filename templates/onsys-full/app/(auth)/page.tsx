import { LoginForm } from "@/_components/login-form";
import { ThemeToggleButton } from "@/_components/theme-toggle-button";
import { siteName } from "@/_lib/const";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  
    if (session?.user?.id) {
      redirect("/a")
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image alt="OnSys" width={48} height={48} src="/onsys.svg" className="mx-auto mb-4"/>
          <h1 className="text-3xl font-bold text-balance">{siteName}</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
