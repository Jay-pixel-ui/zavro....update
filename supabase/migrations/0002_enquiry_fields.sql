-- Extra enquiry fields captured by the website form, plus email delivery tracking.
alter table public.leads
  add column if not exists reference text unique,
  add column if not exists service text,
  add column if not exists timing text,
  add column if not exists contact_method text,
  add column if not exists source_page text,
  add column if not exists from_nova boolean not null default false,
  add column if not exists utm jsonb not null default '{}'::jsonb,
  add column if not exists email_status text not null default 'pending';

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (lower(email));

-- Admins need to see all team members to assign leads (profiles policy already allows admin).
-- Team members can read basic lead_activities of leads they can see (policy in 0001).
