-- VisionGo Supabase Schema
-- Run this in the Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- SERVICE AREAS
CREATE TABLE service_areas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  region TEXT NOT NULL,
  province TEXT NOT NULL,
  municipality TEXT NOT NULL,
  barangay TEXT NOT NULL,
  is_serviceable BOOLEAN DEFAULT false,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON service_areas(barangay);
CREATE INDEX ON service_areas(municipality, province);

-- SUBSCRIBERS
CREATE TABLE subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_number TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  mobile TEXT UNIQUE NOT NULL,
  email TEXT,
  date_of_birth DATE,
  service_address TEXT,
  province TEXT,
  municipality TEXT,
  barangay TEXT,
  subscriber_type TEXT DEFAULT 'residential' CHECK (subscriber_type IN ('residential','business')),
  contact_preference TEXT DEFAULT 'sms' CHECK (contact_preference IN ('sms','email','call')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active','suspended','disconnected','pending')),
  is_employee BOOLEAN DEFAULT false,
  employee_id TEXT,
  hubspot_contact_id TEXT,
  referral_code TEXT UNIQUE,
  referred_by_code TEXT,
  points_balance INT DEFAULT 0,
  enrichment_score INT DEFAULT 0,
  enrichment_pct INT DEFAULT 0,
  app_first_login TIMESTAMPTZ,
  app_last_login TIMESTAMPTZ,
  push_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON subscribers(mobile);
CREATE INDEX ON subscribers(account_number);
CREATE INDEX ON subscribers(hubspot_contact_id);

-- PROSPECTS
CREATE TABLE prospects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  mobile TEXT NOT NULL,
  email TEXT,
  province TEXT,
  municipality TEXT,
  barangay TEXT,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  is_serviceable BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','converted','waitlist','dropped')),
  hubspot_contact_id TEXT,
  hubspot_deal_id TEXT,
  source TEXT DEFAULT 'app_area_check',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PLANS
CREATE TABLE plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plan_code TEXT UNIQUE NOT NULL,
  plan_name TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('fiber','cable','bundle','vas','addon')),
  speed_down_mbps INT,
  speed_up_mbps INT,
  monthly_fee DECIMAL(10,2) NOT NULL,
  install_fee DECIMAL(10,2) DEFAULT 0,
  contract_months INT DEFAULT 0,
  description TEXT,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUBSCRIBER PLANS
CREATE TABLE subscriber_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id),
  plan_code TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  monthly_fee DECIMAL(10,2) NOT NULL,
  speed_down_mbps INT,
  speed_up_mbps INT,
  activation_date DATE,
  contract_end_date DATE,
  lock_in_months INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BILLS
CREATE TABLE bills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  bill_number TEXT UNIQUE NOT NULL,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  due_date DATE NOT NULL,
  amount_due DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  balance DECIMAL(10,2),
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid','partial','paid','overdue')),
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON bills(subscriber_id);
CREATE INDEX ON bills(status);
CREATE INDEX ON bills(due_date);

-- PAYMENTS
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  bill_id UUID REFERENCES bills(id),
  paymongo_id TEXT UNIQUE,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('gcash','maya','card','bank_transfer','cash','auto_debit')),
  amount DECIMAL(10,2) NOT NULL,
  fee DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','cancelled','refunded')),
  paid_at TIMESTAMPTZ,
  reference_number TEXT UNIQUE,
  receipt_url TEXT,
  paymongo_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DEVICES
CREATE TABLE devices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  device_model TEXT,
  serial_number TEXT UNIQUE,
  mac_address TEXT,
  firmware_version TEXT,
  installation_date DATE,
  is_active BOOLEAN DEFAULT true,
  last_seen TIMESTAMPTZ,
  cpe_status TEXT DEFAULT 'unknown' CHECK (cpe_status IN ('online','offline','issue','unknown')),
  signal_tx DECIMAL(6,2),
  signal_rx DECIMAL(6,2),
  signal_quality TEXT CHECK (signal_quality IN ('good','fair','poor','none')),
  last_restart TIMESTAMPTZ,
  restart_count_7d INT DEFAULT 0,
  raw_status JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TICKETS
CREATE TABLE tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  ticket_type TEXT NOT NULL CHECK (ticket_type IN ('technical','billing','other')),
  category TEXT,
  subject TEXT NOT NULL,
  description TEXT,
  photos TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed','cancelled')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  self_help_attempted BOOLEAN DEFAULT false,
  cpe_status_at_filing TEXT,
  estimated_resolution TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  hubspot_ticket_id TEXT,
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ticket_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  message TEXT,
  updated_by TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENRICHMENT
CREATE TABLE enrichment_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE UNIQUE,
  household_size INT,
  has_wfh_member BOOLEAN,
  has_gaming_user BOOLEAN,
  has_student_user BOOLEAN,
  has_ofw_member BOOLEAN,
  device_types TEXT[] DEFAULT '{}',
  primary_usage TEXT[],
  internet_hours_daily INT,
  streaming_services TEXT[] DEFAULT '{}',
  work_type TEXT,
  answers JSONB DEFAULT '{}',
  completed_questions INT DEFAULT 0,
  total_questions INT DEFAULT 8,
  synced_to_hubspot BOOLEAN DEFAULT false,
  last_synced_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enrichment_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_key TEXT UNIQUE NOT NULL,
  question_text TEXT NOT NULL,
  answer_type TEXT NOT NULL CHECK (answer_type IN ('boolean','number','select','multiselect','text')),
  options JSONB,
  points_reward INT DEFAULT 30,
  hubspot_property TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- REFERRALS
CREATE TABLE referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  referrer_code TEXT NOT NULL,
  referee_mobile TEXT NOT NULL,
  referee_subscriber_id UUID REFERENCES subscribers(id),
  referee_prospect_id UUID REFERENCES prospects(id),
  referral_type TEXT DEFAULT 'subscriber' CHECK (referral_type IN ('subscriber','employee')),
  status TEXT DEFAULT 'invited' CHECK (status IN ('invited','registered','activated','cancelled')),
  reward_amount DECIMAL(10,2),
  reward_type TEXT CHECK (reward_type IN ('bill_credit','points','free_month')),
  reward_credited BOOLEAN DEFAULT false,
  reward_credited_at TIMESTAMPTZ,
  hubspot_deal_id TEXT,
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE points_ledger (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  points INT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earn','redeem','expire','bonus')),
  reason TEXT NOT NULL,
  reference_id UUID,
  balance_after INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- UPGRADE REQUESTS
CREATE TABLE upgrade_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  current_plan_id UUID REFERENCES plans(id),
  requested_plan_id UUID REFERENCES plans(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','contacted','scheduled','completed','cancelled')),
  notes TEXT,
  hubspot_deal_id TEXT,
  assigned_agent TEXT,
  scheduled_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  sent_via TEXT[] DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROMOS
CREATE TABLE promos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  body TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_url TEXT,
  promo_type TEXT DEFAULT 'announcement' CHECK (promo_type IN ('announcement','discount','new_plan','event','tip')),
  target_tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HUBSPOT SYNC LOG
CREATE TABLE hubspot_sync_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  hubspot_object_type TEXT NOT NULL,
  hubspot_object_id TEXT,
  action TEXT NOT NULL CHECK (action IN ('create','update','delete')),
  payload JSONB,
  response JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','success','failed','skipped')),
  error_message TEXT,
  attempts INT DEFAULT 0,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUTO-UPDATE TIMESTAMPS
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_subscribers BEFORE UPDATE ON subscribers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_bills BEFORE UPDATE ON bills FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_tickets BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_referrals BEFORE UPDATE ON referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_upgrade_requests BEFORE UPDATE ON upgrade_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ROW LEVEL SECURITY
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrichment_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscribers_own_data" ON subscribers FOR ALL USING (auth.uid() = auth_user_id);
CREATE POLICY "bills_own_data" ON bills FOR ALL USING (subscriber_id IN (SELECT id FROM subscribers WHERE auth_user_id = auth.uid()));
CREATE POLICY "payments_own_data" ON payments FOR ALL USING (subscriber_id IN (SELECT id FROM subscribers WHERE auth_user_id = auth.uid()));
CREATE POLICY "devices_own_data" ON devices FOR ALL USING (subscriber_id IN (SELECT id FROM subscribers WHERE auth_user_id = auth.uid()));
CREATE POLICY "tickets_own_data" ON tickets FOR ALL USING (subscriber_id IN (SELECT id FROM subscribers WHERE auth_user_id = auth.uid()));
CREATE POLICY "enrichment_own_data" ON enrichment_profiles FOR ALL USING (subscriber_id IN (SELECT id FROM subscribers WHERE auth_user_id = auth.uid()));
CREATE POLICY "referrals_own_data" ON referrals FOR ALL USING (referrer_id IN (SELECT id FROM subscribers WHERE auth_user_id = auth.uid()));
CREATE POLICY "notifications_own_data" ON notifications FOR ALL USING (subscriber_id IN (SELECT id FROM subscribers WHERE auth_user_id = auth.uid()));
CREATE POLICY "service_areas_public" ON service_areas FOR SELECT USING (true);
CREATE POLICY "plans_public" ON plans FOR SELECT USING (is_active = true);
CREATE POLICY "promos_public" ON promos FOR SELECT USING (is_active = true);

-- SEED ENRICHMENT QUESTIONS
INSERT INTO enrichment_questions (question_key, question_text, answer_type, options, points_reward, hubspot_property, sort_order) VALUES
('household_size', 'How many people live in your household?', 'select', '["Just me","2-3 people","4-5 people","6 or more"]', 50, 'household_size', 1),
('has_wfh_member', 'Does anyone in your household work from home regularly?', 'boolean', null, 40, 'has_wfh_member', 2),
('has_student_user', 'Do your children use the internet for school or online learning?', 'boolean', null, 40, 'has_student_user', 3),
('has_gaming_user', 'Does anyone in the household game online?', 'boolean', null, 40, 'has_gaming_user', 4),
('has_ofw_member', 'Is anyone in the household working or living abroad (OFW)?', 'boolean', null, 50, 'has_ofw_member', 5),
('streaming_services', 'Which streaming services do you use at home?', 'multiselect', '["Netflix","YouTube","Disney+","Vivamax","iWantTFC","Spotify","None"]', 30, 'streaming_services', 6),
('device_types', 'What devices do you regularly connect at home?', 'multiselect', '["Smartphones","Laptops","Smart TV","Gaming consoles","Tablets","Security cameras","Smart home devices"]', 30, 'device_types', 7),
('contact_preference', 'How would you prefer us to contact you?', 'select', '["SMS","Email","Phone call"]', 20, 'preferred_contact_method', 8);

-- SEED DEMO PLANS
INSERT INTO plans (plan_code, plan_name, plan_type, speed_down_mbps, speed_up_mbps, monthly_fee, install_fee, contract_months, description, features, is_active, is_featured, tags, sort_order) VALUES
('FIBER-50', 'Fiber 50', 'fiber', 50, 50, 1299, 0, 12, 'Perfect for light browsing and streaming', '["50 Mbps download","50 Mbps upload","No data cap","Free installation"]', true, false, '{"starter"}', 1),
('FIBER-100', 'Fiber 100', 'fiber', 100, 100, 1799, 0, 12, 'Ideal for families with multiple devices', '["100 Mbps download","100 Mbps upload","No data cap","Free installation","Free modem"]', true, true, '{"popular","family"}', 2),
('FIBER-200', 'Fiber 200', 'fiber', 200, 200, 2499, 0, 12, 'Best for work-from-home and gaming households', '["200 Mbps download","200 Mbps upload","No data cap","Free installation","Free modem","Priority support"]', true, false, '{"wfh","gaming","ofw"}', 3),
('FIBER-500', 'Fiber 500', 'fiber', 500, 500, 3299, 0, 12, 'Ultra-fast for heavy users and businesses', '["500 Mbps download","500 Mbps upload","No data cap","Free installation","Free modem","Dedicated support","Static IP available"]', true, false, '{"business","gaming"}', 4);

-- SEED DEMO PROMOS
INSERT INTO promos (title, subtitle, body, cta_text, promo_type, is_active) VALUES
('OFW Family Package', 'Stay connected with family abroad', 'Upgrade to Fiber 200 and get 2 months free!', 'Learn More', 'discount', true),
('Refer a Neighbor', 'Earn PHP 200 bill credit', 'Every successful referral gives you PHP 200 off your next bill.', 'Share My Code', 'announcement', true),
('Free Installation', 'Until July 31, 2025', 'New subscribers get free installation on all Fiber plans.', 'Refer a Friend', 'discount', true);
