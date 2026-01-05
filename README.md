# Bancada MVP 🛠️

> **O Marketplace Oficial dos Makers & Impressores 3D**

Bem-vindo ao repositório do **Bancada MVP**. Esta aplicação conecta criadores (Makers) a clientes, permitindo a venda de projetos, serviços de impressão e peças exclusivas.

![Bancada MVP Cover](./public/Tupana-A1.png)

## 🚀 Sobre o Projeto

A **Bancada** é uma plataforma desenvolvida para centralizar o ecossistema de impressão 3D. O objetivo é facilitar a conexão entre quem cria e quem procura soluções personalizadas.

### Funcionalidades Principais
* **🛒 Marketplace de Produtos Físicos:** Venda de peças prontas, action figures, gadgets e peças de reposição.
* **📂 Arquivos Digitais (STL/OBJ):** Comercialização segura de modelagens 3D para quem possui impressora.
* **🖨️ Serviços Sob Demanda:** Sistema para receber pedidos de impressão personalizados.
* **📊 Dashboard do Maker:** Área administrativa para gestão de produtos, pedidos e perfil.
* **🔐 Autenticação:** Sistema de login e registo integrado (Makers e Compradores).

## 🛠️ Stack Tecnológica

O projeto foi construído utilizando as tecnologias mais recentes do ecossistema React/Next.js:

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Backend & Base de Dados:** [Supabase](https://supabase.com/) (Auth, Database, Storage)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Qualidade de Código:** ESLint, Prettier

## 📦 Instalação e Configuração

Siga os passos abaixo para executar o projeto localmente:

### 1. Pré-requisitos
Certifique-se de ter instalado:
* Node.js (versão 18 ou superior)
* npm, yarn ou pnpm

### 2. Clonar o repositório

```bash
git clone [https://github.com/pedrohmour/bancada_mvp.git](https://github.com/pedrohmour/bancada_mvp.git)
cd bancada_mvp
```

### 3️⃣ Instalar dependências

```bash
npm install
# ou
yarn install
```

---

### 4️⃣ Configurar Variáveis de Ambiente

Crie um ficheiro `.env.local` na raiz do projeto e configure as credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

---

### 5️⃣ Executar o servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir **Issues** ou enviar **Pull Requests** com melhorias e correções.

1. Faça um **Fork** do projeto  
2. Crie uma **Branch** para a sua feature  
   ```bash
   git checkout -b feature/MinhaFeature
   ```
3. Faça o **Commit** das suas mudanças  
   ```bash
   git commit -m "Adiciona MinhaFeature"
   ```
4. Faça o **Push** para a branch  
   ```bash
   git push origin feature/MinhaFeature
   ```
5. Abra um **Pull Request**

---

> Desenvolvido por Makers para Makers. 🚀
