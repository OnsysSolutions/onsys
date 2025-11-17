export type SignupData = {
  nome: string
  email: string
  senha: string
}

export type UserAccountsDashboard = {
    id: number;
    name: string;
    initials: string;
}

export type ErrorResponse = {
  error_code: string;
  name: string;
  message: string
}