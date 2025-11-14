import dotenv from "dotenv";
import { PrismaClient, Acao, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env" });
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // =========================
  // Tipos de Status (atividade dos itens)
  // =========================
  const statusAtivo = await prisma.tipoStatus.upsert({
    where: { nome: "Ativo" },
    update: {},
    create: { nome: "Ativo", descricao: "Item ativo" },
  });

  const statusPendente = await prisma.tipoStatus.upsert({
    where: { nome: "Pendente" },
    update: {},
    create: { nome: "Pendente", descricao: "Item pendente de ação" },
  });

  const statusArquivado = await prisma.tipoStatus.upsert({
    where: { nome: "Arquivado" },
    update: {},
    create: { nome: "Arquivado", descricao: "Item arquivado" },
  });

  // =========================
  // Tipos de Usuário do Sistema
  // =========================
  const tipoAdmin = await prisma.tipoUsuario.upsert({
    where: { nome: "Admin" },
    update: {},
    create: { nome: "Admin", descricao: "Administrador geral do sistema" },
  });

  const tipoStandard = await prisma.tipoUsuario.upsert({
    where: { nome: "Standard" },
    update: {},
    create: { nome: "Standard", descricao: "Usuário padrão do sistema" },
  });

  // =========================
  // Tipos de Usuário em Conta
  // =========================
  const tipoAdminAccount = await prisma.tipoUsuarioAccount.upsert({
    where: { nome: "Administrador" },
    update: {},
    create: { nome: "Administrador", descricao: "Permissões totais na conta" },
  });

  const tipoEditorAccount = await prisma.tipoUsuarioAccount.upsert({
    where: { nome: "Editor" },
    update: {},
    create: { nome: "Editor", descricao: "Permissões de criar e editar" },
  });

  const tipoViewerAccount = await prisma.tipoUsuarioAccount.upsert({
    where: { nome: "Visitante" },
    update: {},
    create: { nome: "Visitante", descricao: "Permissões apenas de visualização" },
  });

  // =========================
  // Criação de Usuários
  // =========================
  const senhaAdmin = await bcrypt.hash("admin123", 10);
  const senhaEnfermeiro = await bcrypt.hash("enf123", 10);
  const senhaPaciente = await bcrypt.hash("pac123", 10);

  const usuarioAdmin = await prisma.usuario.upsert({
    where: { email: "admin@clinica.com" },
    update: { senhaHash: senhaAdmin, statusId: statusAtivo.id },
    create: {
      nome: "Administrador",
      email: "admin@clinica.com",
      senhaHash: senhaAdmin,
      statusId: statusAtivo.id,
      tipoUsuarioId: tipoAdmin.id,
    },
  });

  const usuarioEnfermeiro = await prisma.usuario.upsert({
    where: { email: "enfermeiro@clinica.com" },
    update: { senhaHash: senhaEnfermeiro, statusId: statusAtivo.id },
    create: {
      nome: "Enfermeiro João",
      email: "enfermeiro@clinica.com",
      senhaHash: senhaEnfermeiro,
      statusId: statusAtivo.id,
      tipoUsuarioId: tipoStandard.id,
    },
  });

  const usuarioPaciente = await prisma.usuario.upsert({
    where: { email: "paciente@clinica.com" },
    update: { senhaHash: senhaPaciente, statusId: statusAtivo.id },
    create: {
      nome: "Paciente Ana",
      email: "paciente@clinica.com",
      senhaHash: senhaPaciente,
      statusId: statusAtivo.id,
      tipoUsuarioId: tipoStandard.id,
    },
  });

  // =========================
  // Criação de Conta
  // =========================
  const account = await prisma.account.upsert({
    where: { nome: "Clínica Bem Cuidar" },
    update: {},
    create: { nome: "Clínica Bem Cuidar", statusId: statusAtivo.id },
  });

  // =========================
  // Vincular Usuários à Conta
  // =========================
  const adminAccount = await prisma.usuarioAccount.upsert({
    where: { usuarioId_accountId: { usuarioId: usuarioAdmin.id, accountId: account.id } },
    update: {
      podeCriar: true,
      podeEditar: true,
      podeDeletar: true,
      podeConvidar: true,
      podeArquivar: true,
      statusId: statusAtivo.id,
      tipoUsuarioAccountId: tipoAdminAccount.id,
    },
    create: {
      usuarioId: usuarioAdmin.id,
      accountId: account.id,
      podeCriar: true,
      podeEditar: true,
      podeDeletar: true,
      podeConvidar: true,
      podeArquivar: true,
      statusId: statusAtivo.id,
      tipoUsuarioAccountId: tipoAdminAccount.id,
    },
  });

  const enfermeiroAccount = await prisma.usuarioAccount.upsert({
    where: { usuarioId_accountId: { usuarioId: usuarioEnfermeiro.id, accountId: account.id } },
    update: {
      podeCriar: true,
      podeEditar: true,
      podeDeletar: false,
      podeConvidar: false,
      podeArquivar: false,
      statusId: statusAtivo.id,
      tipoUsuarioAccountId: tipoEditorAccount.id,
    },
    create: {
      usuarioId: usuarioEnfermeiro.id,
      accountId: account.id,
      podeCriar: true,
      podeEditar: true,
      podeDeletar: false,
      podeConvidar: false,
      podeArquivar: false,
      statusId: statusAtivo.id,
      tipoUsuarioAccountId: tipoEditorAccount.id,
    },
  });

  const pacienteAccount = await prisma.usuarioAccount.upsert({
    where: { usuarioId_accountId: { usuarioId: usuarioPaciente.id, accountId: account.id } },
    update: {
      podeCriar: false,
      podeEditar: false,
      podeDeletar: false,
      podeConvidar: false,
      podeArquivar: false,
      statusId: statusAtivo.id,
      tipoUsuarioAccountId: tipoViewerAccount.id,
    },
    create: {
      usuarioId: usuarioPaciente.id,
      accountId: account.id,
      podeCriar: false,
      podeEditar: false,
      podeDeletar: false,
      podeConvidar: false,
      podeArquivar: false,
      statusId: statusAtivo.id,
      tipoUsuarioAccountId: tipoViewerAccount.id,
    },
  });

  // =========================
  // Dados de exemplo
  // =========================
  const dadosSeed: Prisma.DadosUncheckedCreateInput[] = [
    {
      titulo: "Consulta de Rotina - Paciente Ana",
      descricao: "Consulta marcada para próxima terça-feira.",
      conteudo: "Pressão arterial, exames de sangue e ECG.",
      statusId: statusPendente.id,
      usuarioId: usuarioEnfermeiro.id,
      accountId: account.id,
    },
    {
      titulo: "Retorno - Paciente Ana",
      descricao: "Avaliação após resultados laboratoriais.",
      conteudo: "Ajustes na medicação e orientação nutricional.",
      statusId: statusAtivo.id,
      usuarioId: usuarioEnfermeiro.id,
      accountId: account.id,
    },
    {
      titulo: "Vacinação - Paciente Carlos",
      descricao: "Aplicação de segunda dose da vacina.",
      conteudo: "Vacina COVID-19, lote 12345, local: braço esquerdo.",
      statusId: statusAtivo.id,
      usuarioId: usuarioAdmin.id,
      accountId: account.id
    },
  ];

  for (const d of dadosSeed) {
    const dado = await prisma.dados.upsert({
      where: { titulo_accountId: { titulo: d.titulo, accountId: account.id } },
      update: {
        descricao: d.descricao,
        conteudo: d.conteudo,
        statusId: d.statusId,
      },
      create: {
        titulo: d.titulo,
        descricao: d.descricao,
        conteudo: d.conteudo,
        statusId: d.statusId,
        accountId: d.accountId,
        usuarioId: d.usuarioId
      },
    });

    await prisma.historico.create({
      data: {
        acao: Acao.CRIADO,
        descricao: `${d.usuarioId === enfermeiroAccount.usuarioId ? "Enfermeiro João" : "Administrador"} criou o registro: ${d.titulo}`,
        accountId: account.id,
        usuarioId: d.usuarioId,
        dadoId: dado.id,
      },
    });
  }

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
