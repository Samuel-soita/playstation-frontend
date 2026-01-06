import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  CreateGameSessionResponse,
  LoginResponse,
  PaymentFormData,
  ApiError,
} from '@/types';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Use relative path in development to leverage Vite proxy, or full URL in production
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 
      (import.meta.env.DEV ? '' : 'http://localhost:8000');
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor to add auth token if available
    this.api.interceptors.request.use((config) => {
      const sid = localStorage.getItem('sid');
      if (sid) {
        config.headers['Cookie'] = `sid=${sid}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('sid');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Login to Frappe backend
   */
  async login(usr: string, pwd: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('usr', usr);
    formData.append('pwd', pwd);

    const response = await this.api.post<LoginResponse>('/api/method/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Extract sid from Set-Cookie header or response cookies
    const setCookie = response.headers['set-cookie'];
    if (setCookie) {
      const sidMatch = setCookie[0]?.match(/sid=([^;]+)/);
      if (sidMatch) {
        localStorage.setItem('sid', sidMatch[1]);
      }
    } else {
      // Try to extract from document.cookie if set by proxy
      const cookies = document.cookie.split(';');
      const sidCookie = cookies.find(c => c.trim().startsWith('sid='));
      if (sidCookie) {
        const sidValue = sidCookie.split('=')[1];
        localStorage.setItem('sid', sidValue);
      }
    }

    return response.data;
  }

  /**
   * Logout from Frappe backend
   */
  async logout(): Promise<void> {
    try {
      await this.api.post('/api/method/logout');
    } finally {
      localStorage.removeItem('sid');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current user info
   */
  async getCurrentUser() {
    const response = await this.api.get('/api/method/frappe.auth.get_logged_user');
    return response.data.message;
  }

  /**
   * Create a new game session
   */
  async createGameSession(
    game_space_id: string,
    game_name: string
  ): Promise<CreateGameSessionResponse> {
    const response = await this.api.post<{ message: CreateGameSessionResponse }>(
      '/api/method/playstation_digital_system.frappe_playstation_digital_system.doctype.game_session.game_session.create_game_session',
      {
        game_space_id,
        game_name,
      }
    );
    return response.data.message;
  }

  /**
   * Terminate a game session
   */
  async terminateGameSession(game_space_id: string): Promise<string> {
    const response = await this.api.post<{ message: string }>(
      '/api/method/playstation_digital_system.frappe_playstation_digital_system.doctype.game_session.game_session.terminate_game_session',
      {
        game_space_id,
      }
    );
    return response.data.message;
  }

  /**
   * Create cash payment entry
   */
  async createCashPayment(data: PaymentFormData): Promise<string> {
    const response = await this.api.post<{ message: string }>(
      '/api/method/playstation_digital_system.frappe_playstation_digital_system.doctype.caffe.caffe.create_cash_payment_entry',
      {
        sales_invoice: data.sales_invoice,
        amount: data.amount,
        game_space_id: data.game_space_id,
      }
    );
    return response.data.message;
  }

  /**
   * Create M-Pesa payment entry
   */
  async createMpesaPayment(data: PaymentFormData): Promise<string> {
    if (!data.phone_number) {
      throw new Error('Phone number is required for M-Pesa payment');
    }
    const response = await this.api.post<{ message: string }>(
      '/api/method/playstation_digital_system.frappe_playstation_digital_system.doctype.caffe.caffe.create_mpesa_payment_entry',
      {
        sales_invoice: data.sales_invoice,
        phone_number: data.phone_number,
        amount: data.amount,
        game_space_id: data.game_space_id,
      }
    );
    return response.data.message;
  }

  /**
   * Create bank payment entry
   */
  async createBankPayment(data: PaymentFormData): Promise<string> {
    if (!data.bank_name) {
      throw new Error('Bank name is required for bank payment');
    }
    const response = await this.api.post<{ message: string }>(
      '/api/method/playstation_digital_system.frappe_playstation_digital_system.doctype.caffe.caffe.create_bank_payment_entry',
      {
        sales_invoice: data.sales_invoice,
        bank_name: data.bank_name,
        amount: data.amount,
        game_space_id: data.game_space_id,
      }
    );
    return response.data.message;
  }

  /**
   * Log caffe action
   */
  async logCaffeAction(message: string, caffe_name: string = 'Caffe'): Promise<{ status: string; message: string }> {
    const response = await this.api.post<{ message: { status: string; message: string } }>(
      '/api/method/playstation_digital_system.frappe_playstation_digital_system.doctype.caffe.caffe.log_caffe_action',
      {
        caffe_name,
        message,
      }
    );
    return response.data.message;
  }

  /**
   * Get list of documents (generic Frappe API)
   */
  async getList(doctype: string, filters?: Record<string, any>, fields?: string[]) {
    const response = await this.api.get('/api/resource/' + doctype, {
      params: {
        filters: filters ? JSON.stringify(filters) : undefined,
        fields: fields ? JSON.stringify(fields) : undefined,
      },
    });
    return response.data.data;
  }

  /**
   * Get a single document
   */
  async getDoc(doctype: string, name: string) {
    const response = await this.api.get(`/api/resource/${doctype}/${name}`);
    return response.data.data;
  }

  /**
   * Get all game spaces
   */
  async getGameSpaces() {
    return this.getList('Game Space', {}, [
      'name',
      'game_space_id',
      'playstation_type',
      'tv_type',
      'occupied',
    ]);
  }

  /**
   * Get all games
   */
  async getGames() {
    return this.getList('Games', {}, [
      'name',
      'name_of_the_game',
      'attach_image',
      'image_qmdy',
      'pricing_rate',
      'game_pricing',
      'rate_per_hour',
      'custom_duration',
    ]);
  }

  /**
   * Get active game sessions (docstatus = 0)
   */
  async getActiveSessions() {
    return this.getList('Game Session', [['docstatus', '=', 0]], [
      'name',
      'game_space_selected',
      'game_played',
      'created_by',
      'session_started_at',
      'duration',
    ]);
  }

  /**
   * Get today's invoices summary
   */
  async getTodaysInvoicesSummary(date?: string) {
    const response = await this.api.get<{ message: any }>(
      '/api/method/playstation_digital_system.apis.reports_api.get_todays_invoices_summary',
      {
        params: { date },
      }
    );
    return response.data.message;
  }

  /**
   * Get sales invoices
   */
  async getSalesInvoices(filters?: Record<string, any>) {
    return this.getList('Sales Invoice', filters || {}, [
      'name',
      'posting_date',
      'customer',
      'grand_total',
      'outstanding_amount',
      'status',
      'currency',
    ]);
  }

  /**
   * Initiate M-Pesa payment via TinyPesa
   */
  async payViaTinyPesa(phone: string, amount: number, invoice_id: string) {
    const response = await this.api.post<{ message: string }>(
      '/api/method/playstation_digital_system.apis.mpesa_payments.pay_via_tinypesa',
      {
        phone,
        amount,
        invoice_id,
      }
    );
    return response.data.message;
  }

  /**
   * Update Game Space occupied status
   * This follows the exact backend flow: update occupancy BEFORE creating session
   */
  async updateGameSpaceOccupancy(game_space_id: string, occupied: 'Occupied' | 'Not Occupied'): Promise<void> {
    // First, get the Game Space document name by game_space_id
    const gameSpaces = await this.getList('Game Space', { game_space_id }, ['name']);
    if (!gameSpaces || gameSpaces.length === 0) {
      throw new Error('Game Space not found');
    }
    
    const gameSpaceName = gameSpaces[0].name;
    
    // Update the occupied field using Frappe's set_value API
    await this.api.post('/api/method/frappe.client.set_value', {
      doctype: 'Game Space',
      name: gameSpaceName,
      fieldname: 'occupied',
      value: occupied,
    });
  }

  /**
   * Get Caffe document (single doctype)
   */
  async getCaffe() {
    const response = await this.api.get('/api/resource/Caffe/Caffe');
    return response.data.data;
  }

  /**
   * Get Caffe Settings document (single doctype)
   */
  async getCaffeSettings() {
    const response = await this.api.get('/api/resource/Caffe%20Settings/Caffe%20Settings');
    return response.data.data;
  }

  /**
   * Check if automatic closure is enabled
   */
  async isAutomaticClosureEnabled() {
    const response = await this.api.get<{ message: boolean }>(
      '/api/method/playstation_digital_system.frappe_playstation_digital_system.doctype.caffe_settings.caffe_settings.is_automatic_closure_enabled'
    );
    return response.data.message;
  }

  /**
   * Check if business is currently closed
   */
  async isBusinessClosed() {
    const response = await this.api.get<{ message: boolean }>(
      '/api/method/playstation_digital_system.frappe_playstation_digital_system.doctype.caffe_settings.caffe_settings.is_business_closed'
    );
    return response.data.message;
  }

  /**
   * Get M-Pesa transaction status
   */
  async getMpesaTransactionStatus(accountNo: string) {
    const response = await this.api.get(
      `/api/method/playstation_digital_system.apis.mpesa_payments.check_transaction_status?account_no=${accountNo}`
    );
    return response.data;
  }

  /**
   * Get M-Pesa transactions list
   */
  async getMpesaTransactions() {
    return this.getList('Mpesa Transactions', {}, [
      'name',
      'transaction_id',
      'amount',
      'msisdn',
      'is_complete',
      'sync_status',
      'external_reference',
      'mpesa_receipt',
      'created_at',
    ]);
  }

  /**
   * Terminate session for a specific game space (Caffe method)
   */
  async terminateSessionForSpace(gameSpaceId: string) {
    const response = await this.api.post<{ message: string }>(
      '/api/method/playstation_digital_system.frappe_playstation_digital_system.doctype.caffe.caffe.terminate_session_for_space',
      { game_space_id: gameSpaceId }
    );
    return response.data.message;
  }

  /**
   * Send transaction report as PDF via email
   */
  async sendTransactionReport(email: string, htmlContent: string, reportTitle: string) {
    const response = await this.api.post<{ message: { status: string; message: string } }>(
      '/api/method/playstation_digital_system.apis.pdf.send_transaction_report',
      {
        email,
        html_content: htmlContent,
        report_title: reportTitle,
      }
    );
    return response.data.message;
  }

  /**
   * Get custom accounts for the company
   */
  async getCustomAccounts(company?: string) {
    const response = await this.api.get<{ message: Record<string, string> }>(
      '/api/method/playstation_digital_system.apis.utils.get_custom_accounts',
      {
        params: { company },
      }
    );
    return response.data.message;
  }

  /**
   * M-Pesa payment confirmation (allow guest endpoint)
   * Note: This is typically called by M-Pesa gateway, not directly from frontend
   */
  async confirmMpesaPayment(data: any) {
    const response = await this.api.post(
      '/api/method/playstation_digital_system.apis.mpesa.confirm_mpesa',
      data
    );
    return response.data;
  }

  /**
   * Get all payment entries
   */
  async getPaymentEntries(filters?: Record<string, any>) {
    return this.getList('Payment Entry', filters || {}, [
      'name',
      'payment_type',
      'mode_of_payment',
      'party_type',
      'party',
      'received_amount',
      'reference_doctype',
      'reference_name',
      'posting_date',
      'remarks',
    ]);
  }

  /**
   * Get journal entries
   */
  async getJournalEntries(filters?: Record<string, any>) {
    return this.getList('Journal Entry', filters || {}, [
      'name',
      'posting_date',
      'title',
      'total_debit',
      'total_credit',
      'docstatus',
    ]);
  }

  /**
   * Get customers
   */
  async getCustomers(filters?: Record<string, any>) {
    return this.getList('Customer', filters || {}, [
      'name',
      'customer_name',
      'customer_group',
      'territory',
      'customer_type',
    ]);
  }

  /**
   * Get companies
   */
  async getCompanies() {
    return this.getList('Company', {}, [
      'name',
      'company_name',
      'abbr',
      'default_currency',
    ]);
  }

  /**
   * Get accounts
   */
  async getAccounts(filters?: Record<string, any>) {
    return this.getList('Account', filters || {}, [
      'name',
      'account_name',
      'account_type',
      'is_group',
      'company',
      'root_type',
    ]);
  }

  /**
   * Create/Update document (generic)
   */
  async saveDoc(doctype: string, doc: any) {
    const response = await this.api.post(`/api/resource/${doctype}`, doc);
    return response.data.data;
  }

  /**
   * Delete document
   */
  async deleteDoc(doctype: string, name: string) {
    await this.api.delete(`/api/resource/${doctype}/${name}`);
  }

  /**
   * Submit document
   */
  async submitDoc(doctype: string, name: string) {
    const response = await this.api.put(`/api/resource/${doctype}/${name}`, {
      docstatus: 1
    });
    return response.data.data;
  }

  /**
   * Cancel document
   */
  async cancelDoc(doctype: string, name: string) {
    const response = await this.api.put(`/api/resource/${doctype}/${name}`, {
      docstatus: 2
    });
    return response.data.data;
  }

  /**
   * Get document metadata
   */
  async getDocTypeMeta(doctype: string) {
    const response = await this.api.get(`/api/resource/DocType/${doctype}`);
    return response.data.data;
  }

  /**
   * Run a report
   */
  async runReport(reportName: string, filters?: Record<string, any>) {
    const response = await this.api.get('/api/method/frappe.desk.query_report.run', {
      params: {
        report_name: reportName,
        filters: filters ? JSON.stringify(filters) : '{}',
      },
    });
    return response.data.message;
  }

  /**
   * Get all game sessions (including completed ones)
   */
  async getAllGameSessions(filters?: Record<string, any>) {
    return this.getList('Game Session', filters || {}, [
      'name',
      'game_space_selected',
      'game_played',
      'created_by',
      'session_started_at',
      'session_ended_at',
      'duration',
      'docstatus',
    ]);
  }

  /**
   * Get items
   */
  async getItems(filters?: Record<string, any>) {
    return this.getList('Item', filters || {}, [
      'name',
      'item_code',
      'item_name',
      'item_group',
      'stock_uom',
      'is_stock_item',
    ]);
  }

  /**
   * Get sales orders
   */
  async getSalesOrders(filters?: Record<string, any>) {
    return this.getList('Sales Order', filters || {}, [
      'name',
      'customer',
      'transaction_date',
      'delivery_date',
      'status',
      'grand_total',
      'currency',
    ]);
  }

  /**
   * Get delivery notes
   */
  async getDeliveryNotes(filters?: Record<string, any>) {
    return this.getList('Delivery Note', filters || {}, [
      'name',
      'customer',
      'posting_date',
      'status',
      'grand_total',
      'currency',
    ]);
  }
}

export const apiService = new ApiService();
