import { Resend } from "resend" // ou Nodemailer, se preferir
import { randomInt } from "crypto"
import { prisma } from "@/_lib/prisma"
import { fromEmail as from } from "@/_lib/const"
import PlaidVerifyIdentityEmail from "../../../../react-email-starter/emails/plaid-verify-identity"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email é obrigatório" }),
        { status: 400 }
      )
    }

    // Gera um código de 6 dígitos
    const codigo = String(randomInt(100000, 999999))

    // Cria verificação
    await prisma.emailVerification.create({
      data: {
        email,
        codigo,
        expiracao: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos
      },
    })

    // Envia email
    await resend.emails.send({
      from,
      to: email,
      subject: "Verifique seu email",
      react: (
              <PlaidVerifyIdentityEmail
                validationCode={codigo}
              />
            ),
    })

    return new Response(JSON.stringify({ message: "Código enviado" }), {
      status: 200,
    })
  } catch (err: any) {
    console.error(err)
    return new Response(
      JSON.stringify({ error: err.message || "Erro ao enviar código" }),
      { status: 500 }
    )
  }
}
