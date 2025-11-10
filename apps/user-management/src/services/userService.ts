import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  SignOnRequest, 
  SignOnResponse,
  UserResponse,
  DeleteUserResponse,
  UserListResponse,
  UserListParams
} from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class UserService {
  private getAuthHeaders(): Record<string, string> {
    if (typeof window === 'undefined') {
      return {
        'Content-Type': 'application/json',
      };
    }
    
    const token = localStorage.getItem('user_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private toUpperCase(value: string): string {
    return value.toUpperCase();
  }

  async signOn(data: SignOnRequest): Promise<SignOnResponse> {
    const payload = {
      userId: this.toUpperCase(data.userId),
      password: this.toUpperCase(data.password),
    };

    const response = await fetch(`${API_BASE_URL}/auth/signon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Sign on failed' }));
      throw new Error(error.message || 'Sign on failed');
    }

    return response.json();
  }

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    const payload = {
      ...data,
      userId: this.toUpperCase(data.userId),
      password: this.toUpperCase(data.password),
    };

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create user' }));
      throw new Error(error.message || 'Failed to create user');
    }

    return response.json();
  }

  async getUserById(userId: string): Promise<User> {
    const upperUserId = this.toUpperCase(userId);
    
    const response = await fetch(`${API_BASE_URL}/users/${upperUserId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch user' }));
      throw new Error(error.message || 'Failed to fetch user');
    }

    return response.json();
  }

  async updateUser(userId: string, data: UpdateUserRequest): Promise<UserResponse> {
    const upperUserId = this.toUpperCase(userId);
    const payload = {
      ...data,
      ...(data.password && { password: this.toUpperCase(data.password) }),
    };

    const response = await fetch(`${API_BASE_URL}/users/${upperUserId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update user' }));
      throw new Error(error.message || 'Failed to update user');
    }

    return response.json();
  }

  async deleteUser(userId: string): Promise<DeleteUserResponse> {
    const upperUserId = this.toUpperCase(userId);
    
    const response = await fetch(`${API_BASE_URL}/users/${upperUserId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete user' }));
      throw new Error(error.message || 'Failed to delete user');
    }

    return response.json();
  }

  async listUsers(params?: UserListParams): Promise<UserListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      queryParams.append('size', params.size.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString 
      ? `${API_BASE_URL}/users?${queryString}`
      : `${API_BASE_URL}/users`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch users' }));
      throw new Error(error.message || 'Failed to fetch users');
    }

    return response.json();
  }

  async getNextPage(lastUserId: string, size?: number): Promise<UserListResponse> {
    const upperLastUserId = this.toUpperCase(lastUserId);
    const queryParams = new URLSearchParams();
    
    queryParams.append('lastUserId', upperLastUserId);
    if (size !== undefined) {
      queryParams.append('size', size.toString());
    }

    const response = await fetch(
      `${API_BASE_URL}/users/page/next?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch next page' }));
      throw new Error(error.message || 'Failed to fetch next page');
    }

    return response.json();
  }

  async getPreviousPage(firstUserId: string, size?: number): Promise<UserListResponse> {
    const upperFirstUserId = this.toUpperCase(firstUserId);
    const queryParams = new URLSearchParams();
    
    queryParams.append('firstUserId', upperFirstUserId);
    if (size !== undefined) {
      queryParams.append('size', size.toString());
    }

    const response = await fetch(
      `${API_BASE_URL}/users/page/previous?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch previous page' }));
      throw new Error(error.message || 'Failed to fetch previous page');
    }

    return response.json();
  }

  // Helper methods for token management
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_token', token);
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('user_token');
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_token');
      localStorage.removeItem('current_user');
    }
  }

  setCurrentUser(user: SignOnResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_user', JSON.stringify(user));
    }
  }

  getCurrentUser(): SignOnResponse | null {
    if (typeof window === 'undefined') {
      return null;
    }
    
    const userStr = localStorage.getItem('current_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      localStorage.removeItem('current_user');
      return null;
    }
  }
}

export const userService = new UserService();
