-- First-party, privacy-friendly visitor analytics. No IP addresses or cookies are stored:
-- visitor_hash is a salted SHA-256 that rotates daily, so people cannot be tracked across days.
create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  path text not null,
  referrer_host text,
  country text,
  region text,
  city text,
  device text,
  browser text,
  os text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  visitor_hash text not null
);
create index if not exists page_views_created_idx on public.page_views (created_at desc);
alter table public.page_views enable row level security;  -- no policies: only the service role can read or write

create or replace function public.analytics_summary(p_days int default 30)
returns jsonb
language sql stable security definer set search_path = '' as $$
  with v as (
    select * from public.page_views
    where created_at >= now() - make_interval(days => greatest(1, least(p_days, 365)))
  )
  select jsonb_build_object(
    'days', greatest(1, least(p_days, 365)),
    'views', (select count(*) from v),
    'visitors', (select count(distinct visitor_hash) from v),
    'today_views', (select count(*) from v where created_at >= date_trunc('day', now())),
    'today_visitors', (select count(distinct visitor_hash) from v where created_at >= date_trunc('day', now())),
    'daily', (select coalesce(jsonb_agg(jsonb_build_object('d', d::date, 'views', coalesce(x.views,0), 'visitors', coalesce(x.visitors,0)) order by d), '[]'::jsonb)
              from generate_series(date_trunc('day', now()) - make_interval(days => greatest(1, least(p_days, 365)) - 1), date_trunc('day', now()), interval '1 day') d
              left join (select date_trunc('day', created_at) as dy, count(*) as views, count(distinct visitor_hash) as visitors from v group by 1) x on x.dy = d),
    'pages', (select coalesce(jsonb_agg(r), '[]'::jsonb) from (select path as name, count(*) views from v group by 1 order by 2 desc limit 12) r),
    'countries', (select coalesce(jsonb_agg(r), '[]'::jsonb) from (select coalesce(country,'??') as name, count(*) views, count(distinct visitor_hash) visitors from v group by 1 order by 2 desc limit 20) r),
    'cities', (select coalesce(jsonb_agg(r), '[]'::jsonb) from (select coalesce(city,'Unknown') || coalesce(', ' || country,'') as name, count(*) views from v group by 1 order by 2 desc limit 12) r),
    'referrers', (select coalesce(jsonb_agg(r), '[]'::jsonb) from (select coalesce(referrer_host,'Direct / none') as name, count(*) views from v group by 1 order by 2 desc limit 12) r),
    'devices', (select coalesce(jsonb_agg(r), '[]'::jsonb) from (select coalesce(device,'unknown') as name, count(*) views from v group by 1 order by 2 desc) r),
    'browsers', (select coalesce(jsonb_agg(r), '[]'::jsonb) from (select coalesce(browser,'unknown') as name, count(*) views from v group by 1 order by 2 desc limit 8) r),
    'systems', (select coalesce(jsonb_agg(r), '[]'::jsonb) from (select coalesce(os,'unknown') as name, count(*) views from v group by 1 order by 2 desc limit 8) r),
    'campaigns', (select coalesce(jsonb_agg(r), '[]'::jsonb) from (select coalesce(utm_source,'') || coalesce(' / ' || utm_medium,'') || coalesce(' / ' || utm_campaign,'') as name, count(*) views from v where utm_source is not null group by 1 order by 2 desc limit 10) r),
    'recent', (select coalesce(jsonb_agg(r), '[]'::jsonb) from (select created_at, path, country, city, device, browser, referrer_host from v order by created_at desc limit 25) r)
  );
$$;
revoke all on function public.analytics_summary(int) from public, anon, authenticated;
