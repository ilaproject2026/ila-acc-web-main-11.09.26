/**
 * Centralized API Client for Django REST Framework (DRF) Backend
 * Connects the ILA Global React frontend to the DRF API endpoints.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export interface UserProfile {
  id: number;
  unique_id?: string;
  username: string;
  email: string | null;
  phone?: string | null;
  fullname?: string | null;
  full_name?: string | null;
  role?: string;
  department?: string | null;
  avatar?: string | null;
  is_verified?: boolean;
  referral_code?: string | null;
  referred_by?: number | null;
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  date_joined?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  profile?: {
    role: string;
    department: string;
    staff_id?: string;
    scope?: string;
    phone?: string;
    avatar_url?: string;
  };
}

export interface AuthResponse {
  token?: string;
  access?: string;
  refresh?: string;
  user: UserProfile;
  message?: string;
}

export interface RegisterRequestPayload {
  identifier: string;
  username: string;
  password?: string;
  password_confirm?: string;
  confirm_password?: string;
  password2?: string;
  referral_code?: string;
}

export interface VerifyOtpPayload {
  identifier: string;
  otp: string;
  password: string;
  referral_code?: string;
}

export interface RegisterPayload {
  full_name?: string;
  email?: string;
  identifier?: string;
  username?: string;
  password?: string;
  role?: string;
  department?: string;
  phone?: string;
  referral_code?: string;
}

export interface StaffCreationPayload {
  name: string;
  email: string;
  password?: string;
  department?: string;
  role?: string;
  staff_id?: string;
  scope?: string;
  phone?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL.replace(/\/+$/, '');
  }

  public getToken(): string | null {
    return localStorage.getItem('ila_access_token') || localStorage.getItem('ilas_drf_token');
  }

  public setToken(token: string, refresh?: string): void {
    localStorage.setItem('ila_access_token', token);
    localStorage.setItem('ilas_drf_token', token);
    if (refresh) {
      localStorage.setItem('ila_refresh_token', refresh);
    }
  }

  public clearToken(): void {
    localStorage.removeItem('ila_access_token');
    localStorage.removeItem('ila_refresh_token');
    localStorage.removeItem('ilas_drf_token');
  }

  private getHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      // Support both JWT Bearer and legacy Token auth
      headers['Authorization'] = token.includes('.') ? `Bearer ${token}` : `Bearer ${token}`;
    }

    return headers;
  }

  public async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`;

    const headers = this.getHeaders(options.headers as Record<string, string>);

    const response = await fetch(url, {
      credentials: 'include', // Transmit access_token and refresh_token cookies
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      let errorMessage: string | null = null;
      if (typeof data === 'object' && data !== null) {
        if (data.error) errorMessage = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
        else if (data.detail) errorMessage = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        else if (data.message) errorMessage = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
        else if (data.username) errorMessage = Array.isArray(data.username) ? data.username[0] : String(data.username);
        else if (data.identifier) errorMessage = Array.isArray(data.identifier) ? data.identifier[0] : String(data.identifier);
        else if (data.password) errorMessage = Array.isArray(data.password) ? data.password[0] : String(data.password);
        else if (data.non_field_errors) errorMessage = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : String(data.non_field_errors);
        else if (data.errors && typeof data.errors === 'object') {
          const firstErr = Object.values(data.errors)[0];
          errorMessage = Array.isArray(firstErr) ? firstErr[0] : String(firstErr);
        }
      }
      if (!errorMessage) {
        errorMessage = `Request failed with status ${response.status}`;
      }
      const err = new Error(errorMessage);
      (err as any).status = response.status;
      (err as any).data = data;
      throw err;
    }

    return data as T;
  }

  public get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  public post<T = any>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  public put<T = any>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  public patch<T = any>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  public delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  // Authentication services
  public auth = {
    // Step 1: Dispatch OTP to email/phone with identifier, username, password, password_confirm
    register: async (payload: RegisterRequestPayload | RegisterPayload): Promise<{ message: string; [key: string]: any }> => {
      const cleanIdentifier = ((payload as any).identifier || (payload as any).email || '').trim();
      const cleanUsername = ((payload as any).username || cleanIdentifier.split('@')[0] || 'student').trim();
      const pass = (payload as any).password;
      const passConfirm = (payload as any).password_confirm || (payload as any).confirm_password || (payload as any).password2 || pass;

      const reqPayload = {
        identifier: cleanIdentifier,
        email: cleanIdentifier,
        username: cleanUsername,
        password: pass,
        password_confirm: passConfirm,
        confirm_password: passConfirm,
        password2: passConfirm,
        referral_code: (payload as any).referral_code || undefined,
      };
      return this.post('auth/register/', reqPayload);
    },

    // Step 1.5: Resend registration OTP
    resendOtp: async (payload: { identifier: string; username?: string; referral_code?: string }): Promise<{ message: string }> => {
      return this.post('auth/resend-otp/', payload);
    },

    // Step 2: Verify OTP and activate account with permanent password
    verifyOtp: async (payload: VerifyOtpPayload): Promise<{ message: string }> => {
      return this.post('auth/verify-otp/', payload);
    },

    // Standard Login: Email / Username / Phone + Password + Role + Department
    login: async (
      identifier: string,
      password: string,
      role?: string,
      department?: string
    ): Promise<AuthResponse> => {
      const clean = identifier.trim();
      const payload: Record<string, any> = {
        identifier: clean,
        username: clean,
        email: clean,
        password,
      };
      if (role) {
        payload.role = role;
        payload.portal_role = role;
      }
      if (department) {
        payload.department = department;
      }
      const res = await this.post<AuthResponse>('auth/login/', payload);
      const token = res?.access || (res as any)?.token;
      if (token) {
        this.setToken(token, res?.refresh);
      }
      return res;
    },

    // Silent Token Refresh
    refreshToken: async (refresh?: string): Promise<{ access: string; message?: string }> => {
      const storedRefresh = refresh || localStorage.getItem('ila_refresh_token');
      const res = await this.post<{ access: string; message?: string }>('auth/token/refresh/', {
        refresh: storedRefresh || undefined,
      });
      if (res?.access) {
        this.setToken(res.access);
      }
      return res;
    },

    // Check login status without throwing 401
    checkLogin: async (): Promise<{ is_logged_in: boolean; user?: UserProfile }> => {
      return this.get('auth/check-login/');
    },

    me: async (): Promise<{ user: any; authenticated?: boolean }> => {
      return this.get('auth/me/');
    },

    // Elevated Security Gate PIN (default: 7890 / ILA2026)
    verifySecurityGate: async (pin: string): Promise<{ valid: boolean; message: string; elevated_token?: string }> => {
      const res = await this.post<{ valid: boolean; message: string; elevated_token?: string }>('auth/verify-security-gate/', { pin });
      if (res?.valid && res.elevated_token) {
        sessionStorage.setItem('ila_security_gate_token', res.elevated_token);
      }
      return res;
    },

    changePassword: async (new_password: string, email?: string): Promise<{ message: string; token?: string }> => {
      const res = await this.post<{ message: string; token?: string }>('auth/change-password/', {
        new_password,
        email,
      });
      if (res?.token) {
        this.setToken(res.token);
      }
      return res;
    },

    createStaffUser: async (payload: StaffCreationPayload): Promise<{ message: string; user: any }> => {
      return this.post('auth/create-staff/', payload);
    },

    logout: async (): Promise<void> => {
      try {
        await this.post('auth/logout/');
      } catch {
        // ignore network error on logout
      } finally {
        this.clearToken();
        sessionStorage.removeItem('ila_security_gate_token');
        localStorage.removeItem('ilas_auth_role');
        localStorage.removeItem('ilas_team_role');
        localStorage.removeItem('ilas_team_scope');
        localStorage.removeItem('ilas_user_name');
        window.dispatchEvent(new CustomEvent('ilas-auth-state-changed'));
      }
    },
  };

  // Intake & Inquiry services (dynamic form ingestion)
  public intake = {
    submit: async (data: Record<string, any>): Promise<any> => {
      return this.post('intake-tracking/inquiries/', data);
    },

    getInquiries: async (params?: Record<string, string>): Promise<any> => {
      let queryStr = '';
      if (params && Object.keys(params).length > 0) {
        queryStr = '?' + new URLSearchParams(params).toString();
      }
      return this.get(`intake-tracking/inquiries/${queryStr}`);
    },

    updateStatus: async (id: number | string, status: string): Promise<any> => {
      return this.patch(`intake-tracking/inquiries/${id}/`, { status });
    },
  };

  // Live Consultant Chatbot Services
  public consultant = {
    createSession: async (data: {
      session_id?: string;
      user_name?: string;
      user_email?: string;
      topic?: string;
      metadata?: any;
    }): Promise<any> => {
      return this.post('communication-engine/chat-sessions/', data);
    },

    recordMessage: async (
      sessionId: string,
      data: { sender: string; content: string; topic?: string; id?: string }
    ): Promise<any> => {
      return this.post(`communication-engine/chat-sessions/${sessionId}/message/`, data);
    },

    syncSession: async (data: {
      session_id: string;
      user_name?: string;
      user_email?: string;
      topic?: string;
      messages: any[];
      metadata?: any;
    }): Promise<any> => {
      return this.post('communication-engine/chat-sessions/sync/', data);
    },

    getSessions: async (params?: Record<string, string>): Promise<any> => {
      let queryStr = '';
      if (params && Object.keys(params).length > 0) {
        queryStr = '?' + new URLSearchParams(params).toString();
      }
      return this.get(`communication-engine/chat-sessions/${queryStr}`);
    },

    getSession: async (sessionId: string): Promise<any> => {
      return this.get(`communication-engine/chat-sessions/${sessionId}/`);
    },
  };
}

export const apiClient = new ApiClient();
export default apiClient;
