"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

import { Modal, ModalBody, ModalContent, ModalFooter } from "@/_components/animated-modal"
import { Button } from "@/_components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/_components/ui/form"
import { Input } from "@/_components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/_components/ui/input-otp"
import { formSchemaSignup } from "@/_lib/schemas"

export default function InviteSignupModal({
    open,
    onOpenChange,
    convite,
    setOpenLogin,
}: {
    open: boolean
    onOpenChange: (v: boolean) => void
    convite: any
    setOpenLogin: (open: boolean) => void
}) {
    const totalSteps = 3
    const [currentStep, setCurrentStep] = useState(1)
    const [isSending, setIsSending] = useState(false)
    const [codeSent, setCodeSent] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchemaSignup>>({
        resolver: zodResolver(formSchemaSignup),
        defaultValues: {
            nome: convite?.email?.split("@")[0] ?? "",
            email: convite?.email ?? "",
            password: "",
            confirmPassword: "",
            codigo: "",
        },
    })

    // Enviar código de verificação
    const sendCode = async () => {
        const email = form.getValues("email")
        if (!email) return toast.error("Informe um e-mail válido")

        try {
            setIsSending(true)
            const res = await fetch("/api/email/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            if (!res.ok) throw new Error("Falha ao enviar código")
            toast.success("Código enviado para seu e-mail!")
            setCodeSent(true)
        } catch (err: any) {
            toast.error("Erro ao enviar código", { description: err.message })
        } finally {
            setIsSending(false)
        }
    }

    // Verificar o código antes de ir pro próximo step
    const verifyCode = async () => {
        const codigo = form.getValues("codigo")
        const email = form.getValues("email")

        if (!codigo) {
            toast.error("Digite o código recebido por e-mail")
            return
        }

        try {
            setIsVerifying(true)
            const res = await fetch("/api/email/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, codigo }),
            })
            if (!res.ok) throw new Error("Código inválido ou expirado")
            toast.success("Código verificado com sucesso!")
            setCurrentStep(3)
        } catch (err: any) {
            toast.error(err.message || "Erro ao verificar código")
        } finally {
            setIsVerifying(false)
        }
    }

   const onSubmit = async (values: z.infer<typeof formSchemaSignup>) => {
        if (values.email !== convite?.email) {
            toast.error("Email não compatível com o convite")
            return
        }

        try {
            setIsSubmitting(true) // ✅ ativa loading
            const createUserRes = await fetch("/api/user", {
                method: "POST",
                body: JSON.stringify({ convite, signupData: values }),
            })

            if (!createUserRes.ok) {
                toast.error("Erro ao criar usuário")
                return
            }

            const res = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
            })

            if (res?.error) {
                toast.error("Email ou senha inválidos")
                return
            }

            await fetch("/convite/aceitar", {
                method: "POST",
                body: JSON.stringify({ convite }),
            })

            toast.success("Conta criada com sucesso!")
            onOpenChange(false)
        } catch (err: any) {
            toast.error(err.message || "Erro ao criar conta")
        } finally {
            setIsSubmitting(false) // ✅ desativa loading
        }
    }

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalBody>
                <ModalContent className="space-y-4">
                    <h3 className="text-2xl font-bold text-center">Crie sua conta</h3>
                    <p className="text-center text-muted-foreground">
                        Passo {currentStep} de {totalSteps}
                    </p>
                    <div className="flex gap-2 mt-2">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div key={i} className={`h-2 flex-1 rounded-full ${i + 1 <= currentStep ? "bg-primary" : "bg-muted"}`} />
                        ))}
                    </div>

                    <Form {...form}>
                        <form id="signupForm" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {currentStep === 1 && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                                    <FormField control={form.control} name="nome" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl><Input placeholder="Fulano de Tal" {...field} /></FormControl>
                                            <FormDescription>Digite o nome do seu usuário.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl><Input placeholder="nome@exemplo.com" {...field} /></FormControl>
                                            <FormDescription>Use o mesmo e-mail do convite.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4 flex min-w-full justify-center">
                                    <FormField control={form.control} name="codigo" render={({ field }) => (
                                        <FormItem className="w-full flex flex-col items-center min-w-full justify-center">
                                            <FormLabel className="text-center w-full">Código de verificação</FormLabel>
                                            <FormControl className="flex justify-center">
                                                <InputOTP maxLength={6} {...field} className="w-[280px]">
                                                    <InputOTPGroup className="justify-between">
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                        <InputOTPSlot index={3} />
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormDescription className="text-center">
                                                {codeSent
                                                    ? "Digite o código enviado para seu e-mail."
                                                    : "Clique abaixo para enviar o código."}
                                            </FormDescription>
                                            <FormMessage className="text-center" />
                                        </FormItem>
                                    )} />
                                </div>
                            )}


                            {currentStep === 3 && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                                    <FormField control={form.control} name="password" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Senha</FormLabel>
                                            <FormControl><Input type="password" placeholder="******" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirmar Senha</FormLabel>
                                            <FormControl><Input type="password" placeholder="******" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            )}
                        </form>
                    </Form>
                </ModalContent>

                <ModalFooter className="flex justify-between items-center">
                    <div>
                        <p className="text-center text-sm text-muted-foreground">
                            Já tem conta?{" "}
                            <Button variant="link" onClick={() => { setOpenLogin(true); onOpenChange(false) }} className="text-primary p-0 font-semibold">
                                Fazer login
                            </Button>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {currentStep > 1 && (
                            <Button type="button" variant="outline" onClick={() => setCurrentStep(p => p - 1)} className="flex-1">
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Voltar
                            </Button>
                        )}

                        {currentStep === 1 && (
                            <Button type="button" onClick={() => setCurrentStep(2)} className="flex-1 font-semibold">
                                Próximo <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}

                        {currentStep === 2 && (
                            <>
                                <Button type="button" onClick={sendCode} disabled={isSending} className="flex-1">
                                    {isSending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {codeSent ? "Reenviar código" : "Enviar código"}
                                </Button>

                                <Button type="button" onClick={verifyCode} disabled={isVerifying} className="flex-1 font-semibold">
                                    {isVerifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Verificar
                                </Button>
                            </>
                        )}

                        {currentStep === 3 && (
                            <Button
                                form="signupForm"
                                type="submit"
                                className="flex-1 font-semibold"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                                {isSubmitting ? "Criando" : "Criar conta"}
                            </Button>
                        )}
                    </div>
                </ModalFooter>
            </ModalBody>
        </Modal>
    )
}
