-- Add new columns to time_logs table
ALTER TABLE public.time_logs
ADD COLUMN IF NOT EXISTS shift_type text,
ADD COLUMN IF NOT EXISTS expected_end timestamp with time zone;

-- Create email queue table
CREATE TABLE IF NOT EXISTS public.email_queue (
    id uuid default uuid_generate_v4() primary key,
    to_email text not null,
    subject text not null,
    content text not null,
    sent boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_time_logs_user_clock_in ON public.time_logs(user_id, clock_in);
CREATE INDEX IF NOT EXISTS idx_time_logs_active ON public.time_logs(user_id) WHERE clock_out IS NULL;
