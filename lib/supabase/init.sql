-- script that was ran in Supabase SQL editor
-- for documentation purposes only

create table public.tickets (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- link DIRECTLY to the hidden Supabase auth user
  user_id uuid references auth.users not null,
  -- payment data
  stripe_session_id text unique,
  amount_paid numeric,
  -- qr code content
  ticket_code uuid default gen_random_uuid() not null,
  -- status
  status text default 'valid'
);

alter table tickets enable row level security;

create policy "Users can view own tickets"
  on tickets
  for select
  using (auth.uid () = user_id);
