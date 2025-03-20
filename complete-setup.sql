-- Update RLS policies for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Managers can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Managers can create profiles" ON public.profiles;

-- Create improved policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    -- Prevent role self-elevation
    (role = OLD.role) OR 
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Managers can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Managers can create and invite profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

-- Add constraints
ALTER TABLE public.profiles 
  ADD CONSTRAINT valid_roles 
  CHECK (role IN ('employee', 'manager', 'admin'));

ALTER TABLE public.profiles 
  ADD CONSTRAINT valid_status 
  CHECK (status IN ('invited', 'active', 'inactive'));
