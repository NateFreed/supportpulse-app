-- SupportPulse Database Schema

create table if not exists sp_workspaces (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique not null,
  name text not null,
  widget_color text default '#14b8a6',
  widget_greeting text default 'Hi! How can we help?',
  plan text check (plan in ('free', 'pro', 'business')) default 'free',
  created_at timestamptz default now()
);

create table if not exists sp_conversations (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references sp_workspaces(id) on delete cascade not null,
  visitor_name text default 'Visitor',
  visitor_email text default '',
  status text check (status in ('open', 'assigned', 'resolved', 'closed')) default 'open',
  assigned_to text,
  channel text check (channel in ('widget', 'email')) default 'widget',
  ai_handled boolean default false,
  last_message_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists sp_messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references sp_conversations(id) on delete cascade not null,
  sender_type text check (sender_type in ('visitor', 'agent', 'ai')) not null,
  sender_name text not null,
  content text not null,
  ai_confidence integer,
  created_at timestamptz default now()
);

create table if not exists sp_knowledge_articles (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references sp_workspaces(id) on delete cascade not null,
  title text not null,
  content text not null,
  category text default 'General',
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists sp_agents (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references sp_workspaces(id) on delete cascade not null,
  name text not null,
  email text not null,
  role text check (role in ('admin', 'agent')) default 'agent',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- RLS
alter table sp_workspaces enable row level security;
alter table sp_conversations enable row level security;
alter table sp_messages enable row level security;
alter table sp_knowledge_articles enable row level security;
alter table sp_agents enable row level security;

create policy "Users manage their workspace" on sp_workspaces for all using (auth.uid() = user_id);

create policy "Workspace owners manage conversations" on sp_conversations
  for all using (workspace_id in (select id from sp_workspaces where user_id = auth.uid()));
create policy "Visitors can create conversations" on sp_conversations for insert with check (true);

create policy "Workspace owners read messages" on sp_messages
  for all using (conversation_id in (
    select c.id from sp_conversations c join sp_workspaces w on c.workspace_id = w.id where w.user_id = auth.uid()
  ));
create policy "Anyone can send messages" on sp_messages for insert with check (true);

create policy "Workspace owners manage articles" on sp_knowledge_articles
  for all using (workspace_id in (select id from sp_workspaces where user_id = auth.uid()));
create policy "Public can read published articles" on sp_knowledge_articles
  for select using (is_published = true);

create policy "Workspace owners manage agents" on sp_agents
  for all using (workspace_id in (select id from sp_workspaces where user_id = auth.uid()));

-- Indexes
create index if not exists idx_sp_workspaces_user_id on sp_workspaces(user_id);
create index if not exists idx_sp_conversations_workspace_id on sp_conversations(workspace_id);
create index if not exists idx_sp_conversations_status on sp_conversations(status);
create index if not exists idx_sp_messages_conversation_id on sp_messages(conversation_id);
create index if not exists idx_sp_knowledge_workspace_id on sp_knowledge_articles(workspace_id);
create index if not exists idx_sp_agents_workspace_id on sp_agents(workspace_id);
