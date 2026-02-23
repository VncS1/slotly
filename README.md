<div align="center">
  
# 🚀 Slotly

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Laravel](https://img.shields.io/badge/laravel-%23FF2D20.svg?style=for-the-badge&logo=laravel&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

*Uma plataforma profissional e moderna para agendamento de serviços. O Slotly conecta prestadores aos seus clientes, oferecendo uma experiência fluida de marcação de horários, prevenção inteligente de conflitos na agenda e gestão completa de perfis.*

</div>

---

## ✨ Funcionalidades

- **Motor de Disponibilidade Inteligente**: O backend calcula os horários livres dinamicamente, impedindo *double-booking* (agendamentos duplos) em tempo real.
- **Gestão de Fusos Horários**: Tratamento robusto de datas convertendo UTC do servidor para o timezone local do usuário (ex: America/Sao_Paulo).
- **Perfis de Usuário (Roles)**: 
  - **Prestador (Provider)**: Gerencia serviços, horários de atendimento e acompanha a agenda.
  - **Cliente (Client)**: Agenda, visualiza histórico e cancela compromissos.
- **Interface Reativa**: Atualizações de UI em tempo real e cache inteligente utilizando TanStack Query.
- **Validação Rigorosa**: Formulários blindados no frontend (com Zod) e no backend (com Laravel Form Requests).
- **Design Moderno e Acessível**: Feedback visual claro para horários ocupados, estados de carregamento (Loaders) e tratamento elegante de erros.

## 🛠️ Tech Stack

**Frontend (SPA)**
- **Framework**: React.js (via Vite) + TypeScript
- **Roteamento**: TanStack Router (Type-safe file-based routing)
- **Gerenciamento de Estado/Cache**: TanStack Query (React Query)
- **Estilização**: Tailwind CSS + Lucide React (Ícones)
- **Formulários e Validação**: React Hook Form + Zod
- **Componentes**: Radix UI (Acessibilidade)

**Backend (API RESTful)**
- **Framework**: Laravel (PHP)
- **Banco de Dados**: MySQL
- **Autenticação**: Laravel Sanctum (Baseada em Tokens/Cookies para SPA)
- **Manipulação de Datas**: Carbon

---

## 🚀 Instalação e Execução Local

Como o projeto é dividido entre API (Backend) e SPA (Frontend), você precisará rodar ambos os ambientes.

### Pré-requisitos
- PHP 8.1+ e Composer
- Node.js 18+ e npm/yarn
- MySQL rodando localmente

### 1. Configurando o Backend (Laravel)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/slotly.git
cd slotly/slotly-back

# Instale as dependências do PHP
composer install

# Configure o ambiente
cp .env.example .env

# Gere a chave da aplicação
php artisan key:generate

# Configure as credenciais do seu banco de dados no arquivo .env
# DB_DATABASE=slotly_db
# DB_USERNAME=root
# DB_PASSWORD=

# Rode as migrações (criação das tabelas)
php artisan migrate

# Inicie o servidor da API (rodará em http://localhost:8000)
php artisan serve
```

### 2. Configurando o Frontend (React)

Abra uma nova aba no seu terminal:

```bash
cd slotly/slotly-front

# Instale as dependências do Node
npm install

# Configure as variáveis de ambiente do Frontend
cp .env.example .env
# Certifique-se de apontar para a sua API: VITE_API_URL="http://localhost:8000/api"

# Inicie o servidor de desenvolvimento (rodará em http://localhost:5173)
npm run dev
```

> **Acesse a aplicação no navegador em:** `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```text
slotly/
├── slotly-back/                  # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/ # Lógica de negócio (Appointment, Service, etc.)
│   │   └── Models/           # Modelos do Eloquent (Relações do banco)
│   ├── database/             # Migrations do MySQL
│   └── routes/
│       └── api.php           # Definição dos endpoints REST
│
└── slotly-front/                 # Aplicação React
    ├── src/
    │   ├── components/       # Componentes de UI reutilizáveis (Inputs, Toggles)
    │   ├── lib/              # Configurações globais (Instância do Axios/API)
    │   └── routes/           # Rotas baseadas em arquivos (TanStack Router)
    │       ├── _client/      # Área logada do Cliente (Meus Agendamentos, Perfil)
    │       └── _dashboard/   # Área logada do Prestador
    └── package.json
```

---

## 🔐 Modelo de Dados Principais

* **User**: Tabela central de usuários (Diferenciados por roles: provider/client).
* **Service**: Serviços oferecidos pelos prestadores (ex: "Corte Masculino", Duração, Preço).
* **Appointment**: Agendamentos realizados. Relaciona um `client_id`, um `provider_id`, o `service_id` e o intervalo de tempo (`start_time` e `end_time` em DATETIME).
* **ScheduleConfig**: Configuração de dias úteis e horários de almoço do prestador.

---

## 📊 Roadmap e Próximos Passos

### MVP (Fase Atual)
- [x] Autenticação segura (Login/Cadastro).
- [x] Motor de busca de horários disponíveis.
- [x] Agendamento de serviços com trava contra conflitos.
- [x] Painel do Cliente (Visualização e Cancelamento de agendamentos).
- [x] Gestão de perfil e upload de avatar.

### Fase 2
- [x] Dashboard do Prestador (Visão da agenda do dia).
- [x] Alteração de status pelo profissional (Marcar como Concluído).
- [x] Configuração de grade de horários flexível pelo prestador.

### Fase 3
- [ ] Disparo de e-mails transacionais (Confirmação de Agendamento).
- [ ] Integração com WhatsApp para lembretes.
- [ ] Remarcação de horários sem precisar cancelar e agendar novamente.

---

## 🤝 Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona painel do barbeiro'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
