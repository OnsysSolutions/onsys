#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [, , templateName, projectName] = process.argv;

  if (!templateName || !projectName) {
    console.log("❌ Uso:");
    console.log("   npx create-onsys <template> <nome-do-projeto>");
    process.exit(1);
  }

  const templatesDir = path.join(__dirname, "..", "templates");
  const templateDir = path.join(templatesDir, templateName);

  if (!fs.existsSync(templateDir)) {
    console.log(`❌ Template não encontrado: ${templateName}`);
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), projectName);

  console.log("📁 Criando projeto:", projectName);
  console.log("📦 Template:", templateName);

  await fs.copy(templateDir, targetDir);

  // Atualiza o package.json do template
  const pkgPath = path.join(targetDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }

  console.log("✅ Projeto criado com sucesso!");
  console.log(`➡️ Entre na pasta: cd ${projectName}`);
}

main();
