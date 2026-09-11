/**
 * Centralized API Client for Django REST Framework (DRF) Backend
 * Connects the ILA Global React frontend to the DRF API endpoints.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    full_name: string;
    is_staff: boolean;
    is_superuser: boolean;
    profile?: {
      role: string;
      department: string;
      staff_id: string;
      scope: string;
      phone: string;
      avatar_url: string;
    };
  };
  message?: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  role?: string;
  department?: string;
  phone?: string;
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
    return localStorage.getItem('ilas_drf_token');
  }

  public setToken(token: string): void {
    localStorage.setItem('ilas_drf_token', token);
  }

  public clearToken(): void {
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
      headers['Authorization'] = `Token ${token}`;
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
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (typeof data === 'object' && data !== null && (data.error || data.detail || data.message)) ||
        `Request failed with status ${response.status}`;
      const err = new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
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
    login: async (identifier: string, password: string): Promise<AuthResponse> => {
      const res = await this.post<AuthResponse>('auth/login/', { identifier, password });
      if (res?.token) {
        this.setToken(res.token);
      }
      return res;
    },

    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
      const res = await this.post<AuthResponse>('auth/register/', payload);
      if (res?.token) {
        this.setToken(res.token);
      }
      return res;
    },

    me: async (): Promise<{ user: any; authenticated?: boolean }> => {
      return this.get('auth/me/');
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

    logout: (): void => {
      this.clearToken();
      localStorage.removeItem('ilas_auth_role');
      localStorage.removeItem('ilas_team_role');
      localStorage.removeItem('ilas_team_scope');
      localStorage.removeItem('ilas_user_name');
      window.dispatchEvent(new CustomEvent('ilas-auth-state-changed'));
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
