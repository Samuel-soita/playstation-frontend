// Backend API Response Types
export interface GameSession {
  name: string;
  game_space_selected: string;
  game_played: string;
  created_by: string;
  session_started_at: string;
  session_ended_at?: string;
  duration?: number;
  docstatus: number;
}

export interface GameSpace {
  name: string;
  game_space_id: string;
  playstation_type?: 'PS3' | 'PS4' | 'PS5';
  tv_type?: string;
  occupied: 'Occupied' | 'Not Occupied';
  status?: string;
}

export interface Game {
  name: string;
  name_of_the_game: string;
  attach_image?: string;
  image_qmdy?: string;
  pricing_rate: 'Pay Per Game Minutes' | 'Custom Pricing' | 'Pay Per Hour' | 'Pay Per 15 Minutes';
  game_pricing?: number;
  rate_per_hour?: number;
  custom_duration?: string;
}

export interface SalesInvoice {
  name: string;
  customer: string;
  posting_date: string;
  grand_total: number;
  outstanding_amount?: number;
  status: string;
  docstatus: number;
  currency?: string;
}

export interface TodaysInvoicesSummary {
  total_unpaid: number;
  total_paid: number;
  total_expected_revenue: number;
  invoices: SalesInvoice[];
}

export interface PaymentEntry {
  name: string;
  payment_type: string;
  mode_of_payment: 'Cash' | 'Mpesa' | 'Bank';
  party: string;
  received_amount: number;
  reference_name: string;
}

export interface CreateGameSessionResponse {
  game_session_name: string;
  game_space: string;
  game_played: string;
  session_started_at: string;
}

export interface LoginResponse {
  message: string;
  full_name: string;
  sid: string;
}

export interface ApiError {
  exception?: string;
  exc_type?: string;
  _server_messages?: string;
  message?: string;
}

// Additional Entity Types
export interface PaymentEntry {
  name: string;
  payment_type: string;
  mode_of_payment: 'Cash' | 'Mpesa' | 'Bank';
  party_type: string;
  party: string;
  received_amount: number;
  reference_doctype: string;
  reference_name: string;
  posting_date: string;
  remarks?: string;
}

export interface JournalEntry {
  name: string;
  posting_date: string;
  title: string;
  total_debit: number;
  total_credit: number;
  docstatus: number;
}

export interface Customer {
  name: string;
  customer_name: string;
  customer_group: string;
  territory: string;
  customer_type: string;
}

export interface Company {
  name: string;
  company_name: string;
  abbr: string;
  default_currency: string;
}

export interface Account {
  name: string;
  account_name: string;
  account_type?: string;
  is_group: number;
  company: string;
  root_type?: string;
}

export interface Item {
  name: string;
  item_code: string;
  item_name: string;
  item_group: string;
  stock_uom: string;
  is_stock_item: number;
}

export interface SalesOrder {
  name: string;
  customer: string;
  transaction_date: string;
  delivery_date?: string;
  status: string;
  grand_total: number;
  currency: string;
}

export interface DeliveryNote {
  name: string;
  customer: string;
  posting_date: string;
  status: string;
  grand_total: number;
  currency: string;
}

export interface MpesaTransaction {
  name: string;
  transaction_id: string;
  amount: number;
  msisdn: string;
  is_complete: number;
  sync_status?: string;
  external_reference?: string;
  mpesa_receipt?: string;
  link_id?: string;
  created_at: string;
}

export interface CaffeSettings {
  name: string;
  automatic_closing_of_register: number;
  start_time?: string;
  end_time?: string;
  auto_email_daily_sales_reports: number;
  auto_email_daily_session_logs_reports: number;
  specific_emails?: string;
  specific_addresses?: string;
}

export interface Caffe {
  name: string;
  custom_register_open: number;
  custom_custom_logs?: string;
}

// Form Types
export interface LoginFormData {
  usr: string;
  pwd: string;
}

export interface CreateSessionFormData {
  game_space_id: string;
  game_name: string;
}

export interface PaymentFormData {
  sales_invoice: string;
  amount: number;
  game_space_id: string;
  phone_number?: string; // For M-Pesa
  bank_name?: string; // For Bank
}

export interface TransactionReportFormData {
  email: string;
  htmlContent: string;
  reportTitle: string;
}

export interface DocumentFormData {
  doctype: string;
  name?: string;
  data: Record<string, any>;
}
