export const env = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL as string,
    RESEND_API_KEY: process.env.RESEND_API_KEY as string,
}

export const siteName = "OnSys Projeto Padrão";
export const siteDescription = "Projeto padrão para iniciar aplicações na OnSys Solutions";

export const fromEmail = "naoresponda@notificacoes.onsys-solutions.com.br";
export const fromName = "Onsys Projeto Padrão - Notificações";
export const from = `${fromName} <${fromEmail}>`;
export const linkMadeBy = "https://onsys-solutions.com.br";
export const madeBy = "OnSys Solutions";
export const helpEmail = "contato@onsys-solutions.com.br"