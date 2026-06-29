# PageTurner-API-Tests
Suíte de testes automatizados de API construída com Cypress, focada em validar o CRUD de Editoras de uma plataforma fictícia de gestão de catálogo (PageTurner). O projeto cobre não apenas os fluxos de sucesso, mas principalmente os cenários de erro e borda (autenticação, autorização, validação de dados e respostas de erro do servidor).

## 🎯 Sobre o projeto

Este projeto foi desenvolvido para testar de ponta a ponta os endpoints de uma API REST responsável pelo gerenciamento de editoras, incluindo:

- Autenticação de usuários (padrão e administrador)
- Consulta de editoras por CNPJ
- Consulta de integrações vinculadas a uma editora
- Atualização (PATCH) de dados de uma editora

### O que é testado

- ✅ Respostas de sucesso (`200`) com validação de schema e valores de retorno
- ✅ Autenticação ausente, inválida ou expirada (`401`)
- ✅ Acesso negado por perfil de permissão (`403`)
- ✅ Requisições malformadas — tipos incompatíveis, campos vazios, CNPJs inválidos (`400`)
- ✅ Erros inesperados de servidor (`500`)
- ✅ Persistência de dados após atualização (round-trip PATCH → GET)

## 🛠️ Tecnologias utilizadas

- [Cypress](https://www.cypress.io/) — framework de testes
- JavaScript (ES Modules)
- Cypress `cy.request()` para testes de API (sem necessidade de interface gráfica)
- Fixtures (`.json`) para massa de dados de teste

## 📁 Estrutura do projeto

```
├── cypress/
│   ├── e2e/
│   │   └── editoras.cy.js          # Spec principal com os cenários de teste
│   ├── fixtures/
│   │   └── payloads/
│   │       └── editoras.payload.json
│   └── functions/
│       ├── api/
│       │   ├── auth.js             # Função de autenticação
│       │   ├── crud_Editoras.js    # Funções de chamada aos endpoints
│       │   └── utils.js            # Helpers de asserção (expectUnauthorized, etc.)
│       └── utils/
│           └── envVariaveis.js     # Centralização de variáveis de ambiente
├── cypress.env.example.json        # Modelo de variáveis de ambiente
├── cypress.config.js
└── package.json
```

## ⚙️ Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- npm (já vem com o Node.js) ou yarn

## 🚀 Como instalar e rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/pageturner-api-tests.git
cd pageturner-api-tests
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas próprias credenciais e URL de API:

```bash
cp cypress.env.example.json cypress.env.json
```

Edite o `cypress.env.json` com os dados do seu ambiente de teste:

```json
{
    "url": {
        "api_base": "https://sua-api-aqui.com/api/"
    },
    "usuario": {
        "user_email": "seu-usuario@example.com",
        "user_password": "sua-senha",
        "user_adm": "admin@example.com",
        "user_password_adm": "senha-admin",
        "token_incorreto": "token-invalido-para-testes",
        "token_expirado": "token-expirado-para-testes",
        "token_expirado_Adm": "token-expirado-admin-para-testes"
    }
}
```

> ⚠️ **Importante:** o arquivo `cypress.env.json` contém credenciais e **não deve ser commitado**. Ele já está incluído no `.gitignore`.

### 4. Execute os testes

**Modo interativo (com interface do Cypress):**

```bash
npx cypress open
```

Em seguida, selecione **E2E Testing** e clique no arquivo `editoras.cy.js`.

**Modo headless (via terminal, ideal para CI/CD):**

```bash
npx cypress run
```

**Executando apenas o spec de Editoras:**

```bash
npx cypress run --spec "cypress/e2e/editoras.cy.js"
```

## 📋 Scripts disponíveis

Caso o `package.json` tenha scripts configurados, você também pode rodar:

```bash
npm run test          # roda os testes em modo headless
npm run test:open     # abre a interface do Cypress
```

## 📝 Notas

- Os dados utilizados nos testes (CNPJs, e-mails, tokens) são **fictícios** e servem apenas para fins de demonstração.
- Alguns testes estão marcados com `.skip` propositalmente, com comentário explicando o motivo (ex: comportamento de API em revisão).
- O projeto segue uma arquitetura em camadas (config → autenticação → funções de API → testes) para facilitar manutenção e reuso.

## 🔭 Próximos passos

- [ ] Reduzir uso de magic numbers/strings centralizando em constantes
- [ ] Resolver encadeamento de Promises no hook `before` para evitar condições de corrida
- [ ] Adicionar testes de contrato/schema mais robustos
- [ ] Integrar execução em pipeline de CI (GitHub Actions)

---

Projeto desenvolvido como prática de automação de testes de API com Cypress.
