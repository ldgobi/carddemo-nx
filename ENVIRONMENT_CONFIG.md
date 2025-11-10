# Environment Configuration Guide

## 📋 Overview

Each application in the CardDemo Nx monorepo has its own environment configuration that connects to a specific backend service. This document explains the environment variables and API proxy configuration for each application.

## 🏗️ Architecture

### Backend Services (Ports)

Each microservice runs on a different port:

| Application | Frontend Port | Backend Port | Backend URL |
|------------|---------------|--------------|-------------|
| User Management | 4201 | 8081 | http://localhost:8081/api |
| Account Management | 4205 | 8085 | http://localhost:8085/api |
| Bill Payment | 4202 | 8082 | http://localhost:8082/api |
| Transaction Management | 4203 | 8083 | http://localhost:8083/api |
| Credit Card Management | 4204 | 8084 | http://localhost:8084/api |

### API Proxy Configuration

Each Next.js application uses rewrites to proxy API calls to its respective backend service:

```javascript
// Example: User Management (apps/user-management/next.config.js)
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8081/api/:path*',
    },
  ];
}
```

This means:
- Frontend calls: `http://localhost:4200/api/users`
- Gets proxied to: `http://localhost:8081/api/users`

## 📁 Environment Files

Each application has two environment files:

### `.env.local` (Actual Configuration)
Used for local development. **Not committed to Git**.

### `.env.example` (Template)
Template file committed to Git showing required variables.

## 🔧 Configuration by Application

### 1. User Management

**Location**: `apps/user-management/`

**`.env.local`**:
```env
# Backend API URL (User Management Service)
NEXT_PUBLIC_API_URL=http://localhost:8081/api

# Application Settings
NEXT_PUBLIC_APP_NAME=User Management
NEXT_PUBLIC_APP_PORT=4201
```

**Backend Service**: User Management API (Port 8081)

**Features**:
- User authentication (sign-on)
- User CRUD operations
- Role-based access control
- Admin and regular user menus

**API Endpoints**:
- `POST /api/auth/signon` - User sign-on
- `GET /api/users` - List users
- `GET /api/users/{userId}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{userId}` - Update user
- `DELETE /api/users/{userId}` - Delete user

---

### 2. Account Management

**Location**: `apps/account-management/`

**`.env.local`**:
```env
# Backend API URL (Account Management Service)
NEXT_PUBLIC_API_URL=http://localhost:8085/api

# Application Settings
NEXT_PUBLIC_APP_NAME=Account Management
NEXT_PUBLIC_APP_PORT=4205
```

**Backend Service**: Account Management API (Port 8085)

**Features**:
- Account search by ID
- View account details
- Edit account information
- Customer data management

**API Endpoints**:
- `GET /api/accounts/{accountId}` - Get account details
- `PUT /api/accounts/{accountId}` - Update account
- `GET /api/accounts/{accountId}/customer` - Get customer info

---

### 3. Bill Payment

**Location**: `apps/bill-payment/`

**`.env.local`**:
```env
# Backend API URL (Bill Payment Service)
NEXT_PUBLIC_API_URL=http://localhost:8082/api

# Application Settings
NEXT_PUBLIC_APP_NAME=Bill Payment
NEXT_PUBLIC_APP_PORT=4202
```

**Backend Service**: Bill Payment API (Port 8082)

**Features**:
- Account balance retrieval
- Payment processing
- Transaction ID generation
- Payment confirmation

**API Endpoints**:
- `GET /api/bill-payment/account/{accountId}/balance` - Get balance
- `POST /api/bill-payment/process` - Process payment

---

### 4. Credit Card Management

**Location**: `apps/credit-card-management/`

**`.env.local`**:
```env
# Backend API URL (Credit Card Management Service)
NEXT_PUBLIC_API_URL=http://localhost:8084/api

# Application Settings
NEXT_PUBLIC_APP_NAME=Credit Card Management
NEXT_PUBLIC_APP_PORT=4204
```

**Backend Service**: Credit Card Management API (Port 8084)

**Features**:
- Credit card listing
- Card search and filtering
- Card details view
- Card information updates

**API Endpoints**:
- `GET /api/credit-cards` - List cards with pagination
- `GET /api/credit-cards/{cardNumber}` - Get card details
- `PUT /api/credit-cards/{cardNumber}` - Update card
- `GET /api/credit-cards/search` - Search cards

---

### 5. Transaction Management

**Location**: `apps/transaction-management/`

**`.env.local`**:
```env
# Backend API URL (Transaction Management Service)
NEXT_PUBLIC_API_URL=http://localhost:8083/api

# Application Settings
NEXT_PUBLIC_APP_NAME=Transaction Management
NEXT_PUBLIC_APP_PORT=4203
```

**Backend Service**: Transaction Management API (Port 8083)

**Features**:
- Transaction listing
- Transaction search and filter
- Create new transactions
- Report generation

**API Endpoints**:
- `GET /api/transactions` - List transactions
- `GET /api/transactions/{id}` - Get transaction details
- `POST /api/transactions` - Create transaction
- `GET /api/accounts` - List accounts
- `GET /api/accounts/{id}` - Get account details

---

## 🚀 Setup Instructions

### Step 1: Copy Environment Files

Each application already has `.env.local` files created. If you need to recreate them:

```bash
cd carddemo-nx

# User Management
cp apps/user-management/.env.example apps/user-management/.env.local

# Account Management
cp apps/account-management/.env.example apps/account-management/.env.local

# Bill Payment
cp apps/bill-payment/.env.example apps/bill-payment/.env.local

# Credit Card Management
cp apps/credit-card-management/.env.example apps/credit-card-management/.env.local

# Transaction Management
cp apps/transaction-management/.env.example apps/transaction-management/.env.local
```

### Step 2: Verify Backend Services

Ensure all backend services are running on their respective ports:

```bash
# Check if services are running
curl http://localhost:8081/api/health  # User Management
curl http://localhost:8085/api/health  # Account Management
curl http://localhost:8082/api/health  # Bill Payment
curl http://localhost:8084/api/health  # Credit Card Management
curl http://localhost:8083/api/health  # Transaction Management
```

### Step 3: Start Frontend Applications

```bash
# Start all applications (in separate terminals)
npx nx serve user-management              # Port 4201
npx nx serve account-management --port 4205
npx nx serve bill-payment --port 4202
npx nx serve credit-card-management --port 4204
npx nx serve transaction-management --port 4203
```

## 🔒 Security Considerations

### Environment Variables Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use `.env.example`** - Template for required variables
3. **Validate URLs** - Ensure backend URLs are correct
4. **Use HTTPS in production** - Change `http://` to `https://` for production

### Production Configuration

For production deployments, update environment variables:

```env
# Production Example
NEXT_PUBLIC_API_URL=https://api.carddemo.com/user-management/api
NEXT_PUBLIC_APP_NAME=User Management
NEXT_PUBLIC_APP_PORT=443
```

## 🔍 Troubleshooting

### Issue: API calls return 404

**Solution**: Verify backend service is running on the correct port:
```bash
# Check User Management backend
curl http://localhost:8081/api/health
```

### Issue: CORS errors

**Solution**: Backend services should be configured to allow requests from frontend ports (4200-4204).

### Issue: Environment variables not loading

**Solution**: 
1. Restart the Next.js dev server
2. Verify `.env.local` file exists
3. Check variable names start with `NEXT_PUBLIC_`

### Issue: Wrong backend being called

**Solution**: 
1. Check `next.config.js` rewrites configuration
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Clear Next.js cache: `npx nx reset`

## 📊 Environment Variable Reference

### Available Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL | `http://localhost:8081/api` |
| `NEXT_PUBLIC_APP_NAME` | Yes | Application display name | `User Management` |
| `NEXT_PUBLIC_APP_PORT` | Yes | Frontend port number | `4200` |

### Using Environment Variables in Code

```typescript
// In any component or service
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const appName = process.env.NEXT_PUBLIC_APP_NAME;

// Example: Making an API call
const response = await fetch(`${apiUrl}/users`);
```

### Next.js Config Access

```javascript
// In next.config.js
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api',
  },
};
```

## 🔄 Updating Configuration

### Change Backend URL

1. Update `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://new-backend:8081/api
```

2. Restart the dev server:
```bash
npx nx serve user-management
```

### Add New Environment Variable

1. Add to `.env.local`:
```env
NEXT_PUBLIC_NEW_VAR=value
```

2. Add to `.env.example`:
```env
NEXT_PUBLIC_NEW_VAR=example_value
```

3. Add to `next.config.js`:
```javascript
env: {
  NEXT_PUBLIC_NEW_VAR: process.env.NEXT_PUBLIC_NEW_VAR,
}
```

4. Restart dev server

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Nx Environment Variables](https://nx.dev/recipes/tips-n-tricks/define-environment-variables)
- [Next.js Rewrites](https://nextjs.org/docs/api-reference/next.config.js/rewrites)

---

**Last Updated**: November 10, 2025  
**Configuration Version**: 1.0.0
