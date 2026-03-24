# HabitRa — Especificação inicial (MVP)

## Visão do produto
Aplicativo mobile de rastreamento de hábitos com:
- Suporte a múltiplos idiomas desde a primeira abertura (onboarding).
- Cadastro/login com verificação de e-mail.
- Username único por usuário.
- Hábitos individuais (privados) e hábitos em grupo com amigos.
- Integração com calendário para visualizar progresso conjunto.
- Notificações para lembrar hábitos e tarefas.

## Fluxo principal de usuário
1. **Tela de idioma (primeira tela):** usuário escolhe idioma (ex.: Português, English, Español).
2. **Autenticação:** entrar ou criar conta.
3. **Criar conta:**
   - Campos: e-mail, nome de usuário, senha.
   - Regras:
     - e-mail único.
     - nome de usuário único (não permitir duplicados).
4. **Verificação de e-mail:**
   - Enviar código (OTP) ou link mágico para o e-mail informado.
   - Usuário só prossegue após confirmar o código/link.
5. **Home:**
   - Criar hábito privado (só o dono vê).
   - Adicionar amigos.
   - Criar hábitos em grupo (ex.: estudar) para acompanhar juntos.
6. **Calendário:**
   - Visualização diária/semanal/mensal.
   - Hábitos compartilhados mostram progresso de cada membro.
   - Hábitos privados aparecem apenas para o dono.

## Requisitos funcionais (MVP)

### 1) Internacionalização (i18n)
- Detectar idioma do sistema como sugestão.
- Sempre permitir troca manual de idioma.
- Persistir escolha localmente e no perfil (quando logado).

### 2) Autenticação e conta
- Login por e-mail + senha.
- Cadastro com validação de formato de e-mail e senha forte.
- Verificação de e-mail obrigatória para ativar conta.
- Recuperação de senha por e-mail.

### 3) Username único
- Campo `username` com índice único no banco.
- Verificação em tempo real no cadastro (disponível/indisponível).
- Normalizar para minúsculas para evitar colisões (`Ana` = `ana`).

### 4) Amigos e hábitos em grupo
- Convite por username ou e-mail.
- Estados: pendente, aceito, recusado, bloqueado.
- Criação de hábito colaborativo com membros selecionados.
- Marcação de conclusão por pessoa (cada membro marca seu próprio progresso).

### 5) Privacidade
- Hábito `private`: visível só ao dono.
- Hábito `group`: visível apenas aos membros.
- Nunca exibir metas privadas no calendário de amigos.

### 6) Calendário e notificações
- Sincronização com calendário nativo (Google/Apple) opcional.
- Eventos de hábito com recorrência (diário, semanal, customizado).
- Notificações locais e push:
  - lembrete antes do horário,
  - lembrete de hábito não concluído,
  - resumo diário.

## Modelo de dados sugerido

### Tabela `users`
- `id` (UUID)
- `email` (único)
- `email_verified_at` (nullable)
- `username` (único, normalizado)
- `password_hash`
- `language`
- `created_at`, `updated_at`

### Tabela `friendships`
- `id` (UUID)
- `requester_id` (FK users)
- `addressee_id` (FK users)
- `status` (`pending|accepted|rejected|blocked`)
- `created_at`, `updated_at`
- Constraint de unicidade para evitar duplicidade do par.

### Tabela `habits`
- `id` (UUID)
- `owner_id` (FK users)
- `title`
- `description`
- `visibility` (`private|group`)
- `schedule_rule` (RRULE/JSON)
- `start_date`
- `is_active`
- `created_at`, `updated_at`

### Tabela `habit_members`
- `habit_id` (FK habits)
- `user_id` (FK users)
- `role` (`owner|member`)
- PK composta (`habit_id`, `user_id`)

### Tabela `habit_checkins`
- `id` (UUID)
- `habit_id` (FK habits)
- `user_id` (FK users)
- `date` (dia da execução)
- `status` (`done|skipped|missed`)
- índice único (`habit_id`, `user_id`, `date`)

### Tabela `verification_codes`
- `id` (UUID)
- `user_id` (FK users)
- `code_hash`
- `expires_at`
- `consumed_at`

## API (esqueleto)
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/email/send-verification`
- `POST /auth/email/verify`
- `GET /users/username-availability?username=`
- `POST /friends/request`
- `POST /friends/respond`
- `POST /habits`
- `POST /habits/{id}/members`
- `POST /habits/{id}/checkins`
- `GET /calendar?from=&to=`

## Regras de negócio críticas
- Usuário não verificado não pode criar hábitos compartilhados.
- Username é imutável por X dias após criação (opcional, evita abuso).
- Ao remover amizade, hábitos compartilhados existentes podem:
  - manter histórico,
  - impedir novos check-ins do membro removido.

## Stack sugerida
- **Mobile:** Flutter ou React Native.
- **Backend:** Node.js (NestJS) ou Python (FastAPI).
- **Banco:** PostgreSQL.
- **Auth/Push:** Firebase Auth + FCM, ou solução própria com JWT + provedor SMTP.
- **Calendário:** Google Calendar API e EventKit (iOS).

## Roadmap curto
1. **Sprint 1:** i18n + login/cadastro + verificação de e-mail + username único.
2. **Sprint 2:** CRUD de hábitos privados + calendário local + notificações locais.
3. **Sprint 3:** amigos + hábitos em grupo + feed de progresso.
4. **Sprint 4:** integração com calendários externos + push notifications.

## Próximos passos imediatos
- Validar este escopo de MVP.
- Escolher stack final.
- Criar backlog técnico (épicos/histórias).
- Iniciar protótipo de telas: idioma, auth, calendário, hábito compartilhado.
