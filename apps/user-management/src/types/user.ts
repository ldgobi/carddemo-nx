export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  userType: 'A' | 'U';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  userId: string;
  firstName: string;
  lastName: string;
  password: string;
  userType: 'A' | 'U';
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  password: string;
  userType: 'A' | 'U';
}

export interface SignOnRequest {
  userId: string;
  password: string;
}

export interface SignOnResponse {
  userId: string;
  userType: 'A' | 'U';
  message: string;
  success: boolean;
}

export interface UserResponse {
  message: string;
  user: User;
}

export interface DeleteUserResponse {
  message: string;
}

export interface UserListResponse {
  content: User[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  firstUserId: string;
  lastUserId: string;
}

export interface UserListParams {
  search?: string;
  page?: number;
  size?: number;
}

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  order: number;
  userType?: 'A' | 'U' | 'BOTH';
}

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    label: 'User List',
    path: '/admin/users',
    order: 1,
    userType: 'A',
  },
  {
    id: '2',
    label: 'Add User',
    path: '/admin/users/add',
    order: 2,
    userType: 'A',
  },
  {
    id: '3',
    label: 'Reports',
    path: '/admin/reports',
    order: 3,
    userType: 'A',
  },
  {
    id: '4',
    label: 'System Settings',
    path: '/admin/settings',
    order: 4,
    userType: 'A',
  },
];

export const USER_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    label: 'Dashboard',
    path: '/dashboard',
    order: 1,
    userType: 'U',
  },
  {
    id: '2',
    label: 'My Profile',
    path: '/profile',
    order: 2,
    userType: 'U',
  },
  {
    id: '3',
    label: 'View Transactions',
    path: '/transactions',
    order: 3,
    userType: 'U',
  },
];

export const USER_TYPE_LABELS: Record<'A' | 'U', string> = {
  A: 'Administrator',
  U: 'Regular User',
};

export const DEFAULT_PAGE_SIZE = 10;

export const USER_ID_MAX_LENGTH = 8;
export const FIRST_NAME_MAX_LENGTH = 20;
export const LAST_NAME_MAX_LENGTH = 20;
export const PASSWORD_MAX_LENGTH = 8;
