-- Extensão para UUID (se ainda não existir)
create extension if not exists pgcrypto;

-- Criação da tabela de usuários (idempotente)
create table if not exists public.usuarios (
    id uuid primary key default gen_random_uuid(),
    email varchar unique not null,
    nome varchar not null,
    avatar_url varchar,
    is_admin boolean default false,
    is_online boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_seen timestamp with time zone default timezone('utc'::text, now())
);

-- Remover coluna legada 'senha' se ainda existir
alter table public.usuarios drop column if exists senha;

-- Habilitando RLS (Row Level Security)
alter table public.usuarios enable row level security;

-- Criação da tabela de publicações (idempotente)
create table if not exists public.publicacoes (
    id uuid primary key default gen_random_uuid(),
    conteudo text not null,
    usuario_id uuid references public.usuarios(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    atualizado_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitando RLS
alter table public.publicacoes enable row level security;

-- Criação da tabela de mensagens (idempotente)
create table if not exists public.mensagens (
    id uuid primary key default gen_random_uuid(),
    remetente_id uuid references public.usuarios(id) on delete cascade not null,
    destinatario_id uuid references public.usuarios(id) on delete cascade not null,
    conteudo text not null,
    lida boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitando RLS
alter table public.mensagens enable row level security;

-- Tabela de likes (curtidas) para publicações
create table if not exists public.likes (
    id uuid primary key default gen_random_uuid(),
    post_id uuid references public.publicacoes(id) on delete cascade not null,
    usuario_id uuid references public.usuarios(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (post_id, usuario_id)
);

alter table public.likes enable row level security;

-- Policies para usuários
-- Policies de usuarios (idempotentes via DO blocks)
DO $$ BEGIN
    CREATE POLICY "Usuários podem ver outros usuários" ON public.usuarios FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.usuarios FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Usuários podem inserir seu próprio perfil" ON public.usuarios FOR INSERT WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Policies para publicações
DO $$ BEGIN
    CREATE POLICY "Qualquer um pode ver publicações" ON public.publicacoes FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Usuários autenticados podem criar publicações" ON public.publicacoes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Usuários podem editar suas próprias publicações" ON public.publicacoes FOR UPDATE USING (auth.uid() = usuario_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Usuários podem deletar suas próprias publicações" ON public.publicacoes FOR DELETE USING (auth.uid() = usuario_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Policies para mensagens
DO $$ BEGIN
    CREATE POLICY "Usuários podem ver suas próprias mensagens" ON public.mensagens FOR SELECT USING (auth.uid() = remetente_id or auth.uid() = destinatario_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Usuários autenticados podem enviar mensagens" ON public.mensagens FOR INSERT WITH CHECK (auth.role() = 'authenticated' and auth.uid() = remetente_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Policies para likes
DO $$ BEGIN
    CREATE POLICY "Qualquer um pode ver likes" ON public.likes FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Usuários autenticados podem curtir" ON public.likes FOR INSERT WITH CHECK (auth.role() = 'authenticated' and auth.uid() = usuario_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Usuários podem remover seus likes" ON public.likes FOR DELETE USING (auth.uid() = usuario_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Funções para gerenciar status online
create or replace function public.atualizar_status_online()
returns trigger as $$
begin
    update public.usuarios
    set is_online = true,
        last_seen = now()
    where id = auth.uid();
    return new;
end;
$$ language plpgsql security definer;

DO $$ BEGIN
    CREATE TRIGGER on_auth_login
    AFTER INSERT ON auth.sessions
    FOR EACH ROW EXECUTE FUNCTION public.atualizar_status_online();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Função para marcar usuário como offline
create or replace function public.atualizar_status_offline()
returns trigger as $$
begin
    update public.usuarios
    set is_online = false,
        last_seen = now()
    where id = old.user_id;
    return old;
end;
$$ language plpgsql security definer;

DO $$ BEGIN
    CREATE TRIGGER on_auth_logout
    AFTER DELETE ON auth.sessions
    FOR EACH ROW EXECUTE FUNCTION public.atualizar_status_offline();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Criação automática de perfil ao criar usuário de auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.usuarios (id, email, nome)
    values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)))
    on conflict (id) do nothing;
    return new;
end;
$$ language plpgsql security definer;

DO $$ BEGIN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
