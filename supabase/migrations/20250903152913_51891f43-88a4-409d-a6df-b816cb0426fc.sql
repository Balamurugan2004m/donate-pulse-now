-- Create blood donation system database schema

-- Create enum types
CREATE TYPE public.blood_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE public.request_status AS ENUM ('pending', 'fulfilled', 'urgent', 'canceled');
CREATE TYPE public.donor_availability AS ENUM ('available', 'unavailable', 'busy');
CREATE TYPE public.user_role AS ENUM ('donor', 'hospital', 'admin');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  user_role user_role NOT NULL DEFAULT 'donor',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donors table
CREATE TABLE public.donors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blood_type blood_type NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 65),
  weight DECIMAL(5,2) CHECK (weight >= 50),
  location TEXT NOT NULL,
  availability donor_availability NOT NULL DEFAULT 'available',
  last_donation_date DATE,
  medical_conditions TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create hospitals table  
CREATE TABLE public.hospitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hospital_name TEXT NOT NULL,
  license_number TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create blood requests table
CREATE TABLE public.blood_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  blood_type blood_type NOT NULL,
  units_needed INTEGER NOT NULL CHECK (units_needed > 0),
  urgency_level INTEGER NOT NULL CHECK (urgency_level BETWEEN 1 AND 5),
  required_by TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  medical_reason TEXT,
  status request_status NOT NULL DEFAULT 'pending',
  fulfilled_by UUID REFERENCES public.donors(id),
  fulfilled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for donors
CREATE POLICY "Anyone can view donors" ON public.donors
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own donor profile" ON public.donors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own donor profile" ON public.donors
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for hospitals
CREATE POLICY "Anyone can view verified hospitals" ON public.hospitals
  FOR SELECT USING (verified = true);

CREATE POLICY "Users can view their own hospital" ON public.hospitals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hospital profile" ON public.hospitals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hospital profile" ON public.hospitals
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for blood requests
CREATE POLICY "Anyone can view blood requests" ON public.blood_requests
  FOR SELECT USING (true);

CREATE POLICY "Hospitals can create blood requests" ON public.blood_requests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.hospitals 
      WHERE user_id = auth.uid() AND id = hospital_id
    )
  );

CREATE POLICY "Hospitals can update their own requests" ON public.blood_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.hospitals 
      WHERE user_id = auth.uid() AND id = hospital_id
    )
  );

-- Create functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donors_updated_at
  BEFORE UPDATE ON public.donors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hospitals_updated_at
  BEFORE UPDATE ON public.hospitals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blood_requests_updated_at
  BEFORE UPDATE ON public.blood_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();