-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users PRIMARY KEY,
    first_name text,
    last_name text,
    role text DEFAULT 'employee',
    team text,
    location text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create time_logs table
CREATE TABLE IF NOT EXISTS public.time_logs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) NOT NULL,
    clock_in timestamp with time zone NOT NULL,
    clock_out timestamp with time zone,
    shift_type text NOT NULL,
    expected_end timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Managers can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own time logs" ON public.time_logs;
DROP POLICY IF EXISTS "Users can insert their own time logs" ON public.time_logs;
DROP POLICY IF EXISTS "Users can update their own time logs" ON public.time_logs;

-- Create profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Managers can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'manager'
        )
    );

-- Create time_logs policies
CREATE POLICY "Users can view their own time logs"
    ON public.time_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own time logs"
    ON public.time_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own time logs"
    ON public.time_logs FOR UPDATE
    USING (auth.uid() = user_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_time_logs_updated_at ON public.time_logs;
CREATE TRIGGER handle_time_logs_updated_at
    BEFORE UPDATE ON public.time_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to automatically create profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, role)
    VALUES (
        NEW.id,
        COALESCE((NEW.raw_user_meta_data->>'first_name'), ''),
        COALESCE((NEW.raw_user_meta_data->>'last_name'), ''),
        'employee'
    );
    RETURN NEW;
END;
$$ language plpgsql;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_time_logs_user_active
    ON public.time_logs(user_id)
    WHERE clock_out IS NULL;

CREATE INDEX IF NOT EXISTS idx_time_logs_user_date
    ON public.time_logs(user_id, clock_in);

-- Insert default teams and locations if needed
DO $$
BEGIN
    -- Update existing profiles with default values if null
    UPDATE public.profiles
    SET 
        team = CASE 
            WHEN team IS NULL THEN 'Kitchen'
            ELSE team
        END,
        location = CASE 
            WHEN location IS NULL THEN 'Main Location'
            ELSE location
        END
    WHERE team IS NULL OR location IS NULL;
END $$;
