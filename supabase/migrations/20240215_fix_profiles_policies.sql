-- First, drop existing policies
DROP POLICY IF EXISTS "Allow admins to insert employees" ON profiles;
DROP POLICY IF EXISTS "Allow admins to update employees" ON profiles;
DROP POLICY IF EXISTS "Allow users to view profiles" ON profiles;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON profiles TO authenticated;

-- Create comprehensive RLS policies
CREATE POLICY "Allow admins to insert employees"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
    AND status = 'active'
  )
);

CREATE POLICY "Allow admins to update employees"
ON profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
    AND status = 'active'
  )
);

CREATE POLICY "Allow users to view profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  -- Users can see their own profile
  id = auth.uid()
  OR
  -- Admins can see all profiles
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
    AND status = 'active'
  )
);

-- Add role validation
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS valid_roles;
ALTER TABLE profiles ADD CONSTRAINT valid_roles 
  CHECK (role IN ('admin', 'manager', 'employee'));

-- Add status validation
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE profiles ADD CONSTRAINT valid_status 
  CHECK (status IN ('active', 'invited', 'inactive'));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role_status 
  ON profiles(role, status);
