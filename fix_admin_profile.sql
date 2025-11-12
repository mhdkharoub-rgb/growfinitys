-- Ensure admin role for Mohammad
DO $$
DECLARE
  uid uuid;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE email = 'mhdkharoub@gmail.com';
  IF uid IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (uid, 'mhdkharoub@gmail.com', 'Mohammad Kharoub', 'admin')
    ON CONFLICT (id)
    DO UPDATE SET role = 'admin', email = EXCLUDED.email, full_name = EXCLUDED.full_name;
  END IF;
END $$;
