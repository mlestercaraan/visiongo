export interface Subscriber {
  id: string;
  auth_user_id?: string;
  account_number: string;
  first_name: string;
  last_name: string;
  mobile: string;
  email?: string;
  service_address?: string;
  province?: string;
  municipality?: string;
  barangay?: string;
  subscriber_type: 'residential' | 'business';
  subscription_status: 'active' | 'suspended' | 'disconnected' | 'pending';
  is_employee: boolean;
  employee_id?: string;
  referral_code?: string;
  referred_by_code?: string;
  points_balance: number;
  enrichment_score: number;
  enrichment_pct: number;
  push_token?: string;
  app_last_login?: string;
  hubspot_contact_id?: string;
}

export interface Plan {
  id: string;
  plan_code: string;
  plan_name: string;
  plan_type: 'fiber' | 'cable' | 'bundle' | 'vas' | 'addon';
  speed_down_mbps?: number;
  speed_up_mbps?: number;
  monthly_fee: number;
  install_fee?: number;
  contract_months?: number;
  description?: string;
  features: string[];
  is_active: boolean;
  is_featured: boolean;
  tags: string[];
}

export interface SubscriberPlan {
  id: string;
  subscriber_id: string;
  plan_id?: string;
  plan_code: string;
  plan_name: string;
  monthly_fee: number;
  speed_down_mbps?: number;
  speed_up_mbps?: number;
  activation_date?: string;
  contract_end_date?: string;
  lock_in_months: number;
  is_primary: boolean;
}

export interface Bill {
  id: string;
  subscriber_id: string;
  bill_number: string;
  billing_period_start: string;
  billing_period_end: string;
  due_date: string;
  amount_due: number;
  amount_paid: number;
  balance: number;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
  pdf_url?: string;
}

export interface Payment {
  id: string;
  subscriber_id: string;
  bill_id?: string;
  payment_method: 'gcash' | 'maya' | 'card' | 'bank_transfer' | 'cash' | 'auto_debit';
  amount: number;
  fee: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  paid_at?: string;
  reference_number?: string;
  receipt_url?: string;
}

export interface Device {
  id: string;
  subscriber_id: string;
  device_model?: string;
  serial_number?: string;
  mac_address?: string;
  firmware_version?: string;
  installation_date?: string;
  is_active: boolean;
  last_seen?: string;
  cpe_status: 'online' | 'offline' | 'issue' | 'unknown';
  signal_tx?: number;
  signal_rx?: number;
  signal_quality?: 'good' | 'fair' | 'poor' | 'none';
  last_restart?: string;
  restart_count_7d: number;
}

export interface Ticket {
  id: string;
  ticket_number: string;
  subscriber_id: string;
  ticket_type: 'technical' | 'billing' | 'other';
  category?: string;
  subject: string;
  description?: string;
  photos: string[];
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  self_help_attempted: boolean;
  estimated_resolution?: string;
  resolved_at?: string;
  hubspot_ticket_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TicketUpdate {
  id: string;
  ticket_id: string;
  status: string;
  message?: string;
  updated_by: string;
  created_at: string;
}

export interface EnrichmentProfile {
  id: string;
  subscriber_id: string;
  household_size?: number;
  has_wfh_member?: boolean;
  has_gaming_user?: boolean;
  has_student_user?: boolean;
  has_ofw_member?: boolean;
  device_types: string[];
  primary_usage: string[];
  internet_hours_daily?: number;
  streaming_services: string[];
  work_type?: string;
  answers: Record<string, unknown>;
  completed_questions: number;
  total_questions: number;
}

export interface EnrichmentQuestion {
  id: string;
  question_key: string;
  question_text: string;
  answer_type: 'boolean' | 'number' | 'select' | 'multiselect' | 'text';
  options?: string[];
  points_reward: number;
  hubspot_property?: string;
  sort_order: number;
  is_active: boolean;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referrer_code: string;
  referee_mobile: string;
  referral_type: 'subscriber' | 'employee';
  status: 'invited' | 'registered' | 'activated' | 'cancelled';
  reward_amount?: number;
  reward_type?: 'bill_credit' | 'points' | 'free_month';
  reward_credited: boolean;
  activated_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  subscriber_id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  is_read: boolean;
  sent_at?: string;
  read_at?: string;
  created_at: string;
}

export interface Promo {
  id: string;
  title: string;
  subtitle?: string;
  body?: string;
  image_url?: string;
  cta_text?: string;
  cta_url?: string;
  promo_type: 'announcement' | 'discount' | 'new_plan' | 'event' | 'tip';
  is_active: boolean;
  starts_at: string;
  ends_at?: string;
}

export interface UpgradeRequest {
  id: string;
  subscriber_id: string;
  current_plan_id?: string;
  requested_plan_id?: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  hubspot_deal_id?: string;
  assigned_agent?: string;
  scheduled_date?: string;
  created_at: string;
}
