// app/schemas/signup.ts
import { z } from "zod";

export const formSchemaSignup = z
  .object({
    nome: z
      .string()
      .min(3, { message: "O nome deve ter no mínimo 3 caracteres" })
      .max(15, "O nome deve ter no máximo 15 caracteres"),
    email: z.string().email({ message: "E-mail inválido" }),
    codigo: z.string().optional(),
    password: z
      .string()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z
      .string()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
