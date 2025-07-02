import { appConfig } from '../config/appConfig';

export interface LinkInfo {
  id: string;
  originalUrl: string;
  alias: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LinkAnalytics {
  id: string;
  originalUrl: string;
  alias: string | null;
  clicks: number;
  recentIps: string[];
  isExpired: boolean;
}

export interface CreateLinkRequest {
  originalUrl: string;
  alias?: string;
  expiresAt?: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    timestamp: string;
  };
}

class LinksApi {
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${appConfig.api.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Произошла ошибка');
    }

    return data;
  }

  async createLink(request: CreateLinkRequest): Promise<ApiResponse<LinkInfo>> {
    return this.request<ApiResponse<LinkInfo>>('/shorten', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getLinkInfo(identifier: string): Promise<ApiResponse<LinkInfo>> {
    return this.request<ApiResponse<LinkInfo>>(`/info/${identifier}`);
  }

  async deleteLink(
    identifier: string,
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(
      `/delete/${identifier}`,
      {
        method: 'DELETE',
      },
    );
  }

  async getLinkAnalytics(
    identifier: string,
  ): Promise<ApiResponse<LinkAnalytics>> {
    return this.request<ApiResponse<LinkAnalytics>>(`/analytics/${identifier}`);
  }
}

export const linksApi = new LinksApi();
