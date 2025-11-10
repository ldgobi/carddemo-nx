# Migrating Existing CardDemo Apps to Nx Monorepo

This guide explains how to migrate your existing standalone Next.js applications into the new Nx monorepo structure.

## 📋 Overview

You currently have 5 standalone Next.js applications:
1. User Management
2. Account Management
3. Bill Payment
4. Credit Card Management
5. Transaction Management

The new Nx workspace has been created with scaffolding for all 5 apps. Now we need to migrate the actual implementation code.

## 🎯 Migration Strategy

### Phase 1: Prepare (Before Migration)
1. Commit all changes in existing apps
2. Create backup of current code
3. Document any custom configurations

### Phase 2: Migrate Core Files
1. Move source code
2. Update imports
3. Extract shared code to libraries
4. Configure app-specific settings

### Phase 3: Test & Validate
1. Run each application
2. Fix import errors
3. Test functionality
4. Update documentation

## 📦 Step-by-Step Migration

### Step 1: User Management App

#### 1.1 Copy Source Files

```bash
# From: modern-carddemo-user-management/generated_code_9f4fd67f-b5a9-4c1b-a1a2-cb78c069e134-frontend/
# To:   carddemo-nx/apps/user-management/

# Copy app directory
cp -r ../modern-carddemo-user-management/generated_code_9f4fd67f-b5a9-4c1b-a1a2-cb78c069e134-frontend/src/app/* apps/user-management/src/app/

# Copy services
cp -r ../modern-carddemo-user-management/generated_code_9f4fd67f-b5a9-4c1b-a1a2-cb78c069e134-frontend/src/services apps/user-management/src/

# Copy types
cp -r ../modern-carddemo-user-management/generated_code_9f4fd67f-b5a9-4c1b-a1a2-cb78c069e134-frontend/src/types apps/user-management/src/

# Copy public assets
cp -r ../modern-carddemo-user-management/generated_code_9f4fd67f-b5a9-4c1b-a1a2-cb78c069e134-frontend/public/* apps/user-management/public/
```

#### 1.2 Copy Configuration Files

```bash
# Copy environment variables
cp ../modern-carddemo-user-management/generated_code_9f4fd67f-b5a9-4c1b-a1a2-cb78c069e134-frontend/.env.local apps/user-management/

# Merge next.config settings if needed
# Review and merge any custom configurations from:
# ../modern-carddemo-user-management/generated_code_9f4fd67f-b5a9-4c1b-a1a2-cb78c069e134-frontend/next.config.ts
```

#### 1.3 Update Imports

If the app uses relative imports, update them to use workspace aliases:

```typescript
// Before:
import { userService } from '../../../services/userService';
import { User } from '../../../types/user';

// After (if moved to shared libraries):
import { userService } from '@carddemo-nx/api-services';
import { User } from '@carddemo-nx/shared-types';
```

#### 1.4 Extract Shared Code

**Move shared types to `libs/shared-types/`**:

```bash
# Example: User types
cp apps/user-management/src/types/user.ts libs/shared-types/src/lib/
```

Update `libs/shared-types/src/index.ts`:
```typescript
export * from './lib/user';
```

**Move API services to `libs/api-services/`**:

```bash
cp apps/user-management/src/services/userService.ts libs/api-services/src/lib/
```

Update `libs/api-services/src/index.ts`:
```typescript
export * from './lib/userService';
```

#### 1.5 Test the App

```bash
npx nx serve user-management
```

Visit `http://localhost:4200` and verify functionality.

### Step 2: Account Management App

Repeat the same process for Account Management:

```bash
# Copy source files
cp -r ../modern-carddemo-account-management/generated_code_2e9328cf-97da-4283-995f-e937197b8b94/src/app/* apps/account-management/src/app/
cp -r ../modern-carddemo-account-management/generated_code_2e9328cf-97da-4283-995f-e937197b8b94/src/services apps/account-management/src/
cp -r ../modern-carddemo-account-management/generated_code_2e9328cf-97da-4283-995f-e937197b8b94/src/types apps/account-management/src/
cp -r ../modern-carddemo-account-management/generated_code_2e9328cf-97da-4283-995f-e937197b8b94/public/* apps/account-management/public/

# Copy config
cp ../modern-carddemo-account-management/generated_code_2e9328cf-97da-4283-995f-e937197b8b94/.env.local apps/account-management/

# Extract shared types to libraries
# (Move account-related types to libs/shared-types/)
# (Move account API services to libs/api-services/)

# Test
npx nx serve account-management --port 4201
```

### Step 3: Bill Payment App

```bash
# Copy source files
cp -r ../modern-carddemo-bill-payment/generated_code_71c60bc1-3a82-4252-8583-ea2269512b0d/src/app/* apps/bill-payment/src/app/
cp -r ../modern-carddemo-bill-payment/generated_code_71c60bc1-3a82-4252-8583-ea2269512b0d/src/services apps/bill-payment/src/
cp -r ../modern-carddemo-bill-payment/generated_code_71c60bc1-3a82-4252-8583-ea2269512b0d/src/types apps/bill-payment/src/
cp -r ../modern-carddemo-bill-payment/generated_code_71c60bc1-3a82-4252-8583-ea2269512b0d/public/* apps/bill-payment/public/

# Copy config
cp ../modern-carddemo-bill-payment/generated_code_71c60bc1-3a82-4252-8583-ea2269512b0d/.env.local apps/bill-payment/

# Extract shared code
# (Move bill payment types to libs/shared-types/)
# (Move payment API services to libs/api-services/)

# Test
npx nx serve bill-payment --port 4202
```

### Step 4: Credit Card Management App

```bash
# Copy source files
cp -r ../modern-carddemo-credit-card-management/generated_code_769be939-6851-44b6-a272-2e75852f4e39/src/app/* apps/credit-card-management/src/app/
cp -r ../modern-carddemo-credit-card-management/generated_code_769be939-6851-44b6-a272-2e75852f4e39/src/services apps/credit-card-management/src/
cp -r ../modern-carddemo-credit-card-management/generated_code_769be939-6851-44b6-a272-2e75852f4e39/src/types apps/credit-card-management/src/
cp -r ../modern-carddemo-credit-card-management/generated_code_769be939-6851-44b6-a272-2e75852f4e39/public/* apps/credit-card-management/public/

# Copy config
cp ../modern-carddemo-credit-card-management/generated_code_769be939-6851-44b6-a272-2e75852f4e39/.env.local apps/credit-card-management/

# Extract shared code
# (Move credit card types to libs/shared-types/)
# (Move card API services to libs/api-services/)

# Test
npx nx serve credit-card-management --port 4203
```

### Step 5: Transaction Management App

```bash
# Copy source files
cp -r ../modern-carddemo-transaction-management/generated_code_2b026d93-6adc-4df5-9e4f-b7ee10c4d7c3/src/app/* apps/transaction-management/src/app/
cp -r ../modern-carddemo-transaction-management/generated_code_2b026d93-6adc-4df5-9e4f-b7ee10c4d7c3/src/services apps/transaction-management/src/
cp -r ../modern-carddemo-transaction-management/generated_code_2b026d93-6adc-4df5-9e4f-b7ee10c4d7c3/src/types apps/transaction-management/src/
cp -r ../modern-carddemo-transaction-management/generated_code_2b026d93-6adc-4df5-9e4f-b7ee10c4d7c3/public/* apps/transaction-management/public/

# Copy config
cp ../modern-carddemo-transaction-management/generated_code_2b026d93-6adc-4df5-9e4f-b7ee10c4d7c3/.env.local apps/transaction-management/

# Extract shared code
# (Move transaction types to libs/shared-types/)
# (Move transaction API services to libs/api-services/)

# Test
npx nx serve transaction-management --port 4204
```

## 🔧 Common Shared Code to Extract

### Shared Types (`libs/shared-types/`)

Create these type files:

```typescript
// libs/shared-types/src/lib/user.types.ts
export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  password: string;
  userType: 'A' | 'U';
}

// libs/shared-types/src/lib/account.types.ts
export interface Account {
  accountId: string;
  accountStatus: string;
  currentBalance: number;
  creditLimit: number;
  // ... other fields
}

// libs/shared-types/src/lib/transaction.types.ts
export interface Transaction {
  transactionId: string;
  accountId: string;
  amount: number;
  transactionType: string;
  // ... other fields
}

// libs/shared-types/src/lib/credit-card.types.ts
export interface CreditCard {
  cardNumber: string;
  accountId: string;
  embossedName: string;
  // ... other fields
}

// libs/shared-types/src/lib/bill-payment.types.ts
export interface BillPayment {
  accountId: string;
  balance: number;
  paymentAmount: number;
  // ... other fields
}
```

Update `libs/shared-types/src/index.ts`:
```typescript
export * from './lib/user.types';
export * from './lib/account.types';
export * from './lib/transaction.types';
export * from './lib/credit-card.types';
export * from './lib/bill-payment.types';
```

### Shared API Services (`libs/api-services/`)

```typescript
// libs/api-services/src/lib/http-client.ts
export const httpClient = {
  get: async (url: string) => { /* implementation */ },
  post: async (url: string, data: any) => { /* implementation */ },
  put: async (url: string, data: any) => { /* implementation */ },
  delete: async (url: string) => { /* implementation */ },
};

// libs/api-services/src/lib/user-api.service.ts
export const userApi = {
  signOn: async (userId: string, password: string) => { /* ... */ },
  getUsers: async () => { /* ... */ },
  getUserById: async (userId: string) => { /* ... */ },
  createUser: async (user: User) => { /* ... */ },
  updateUser: async (userId: string, user: User) => { /* ... */ },
  deleteUser: async (userId: string) => { /* ... */ },
};

// Similar for account-api.service.ts, transaction-api.service.ts, etc.
```

### Shared UI Components (`libs/ui-components/`)

Create common components:

```typescript
// libs/ui-components/src/lib/Button/Button.tsx
export const Button = ({ children, onClick, variant }) => {
  // Implementation
};

// libs/ui-components/src/lib/Input/Input.tsx
export const Input = ({ label, value, onChange, type }) => {
  // Implementation
};

// libs/ui-components/src/lib/Card/Card.tsx
export const Card = ({ title, children }) => {
  // Implementation
};
```

### Shared Utilities (`libs/utils/`)

```typescript
// libs/utils/src/lib/formatters.ts
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US').format(date);
};

export const maskSSN = (ssn: string) => {
  return `XXX-XX-${ssn.slice(-4)}`;
};

// libs/utils/src/lib/validators.ts
export const validateUserId = (userId: string) => {
  return userId.length <= 8;
};

export const validateAccountId = (accountId: string) => {
  return accountId.length === 11;
};
```

## 🔍 Import Path Updates

After extracting shared code, update imports throughout your apps:

```typescript
// Before:
import { User } from '../types/user';
import { userService } from '../services/userService';
import { formatCurrency } from '../utils/formatters';

// After:
import { User } from '@carddemo-nx/shared-types';
import { userApi } from '@carddemo-nx/api-services';
import { formatCurrency } from '@carddemo-nx/utils';
```

## ✅ Verification Checklist

After migration, verify each application:

### User Management
- [ ] Sign-on page loads
- [ ] User list displays
- [ ] Add user works
- [ ] Update user works
- [ ] Delete user works
- [ ] Admin menu accessible
- [ ] Regular user menu accessible

### Account Management
- [ ] Account search works
- [ ] Account details display
- [ ] Account edit functions
- [ ] SSN masking works

### Bill Payment
- [ ] Balance retrieval works
- [ ] Payment processing works
- [ ] Transaction ID generates

### Credit Card Management
- [ ] Card list displays
- [ ] Card details show
- [ ] Card update works
- [ ] Search functions

### Transaction Management
- [ ] Transaction list displays
- [ ] Transaction details show
- [ ] Add transaction works
- [ ] Report generation works

## 🧪 Testing After Migration

```bash
# Test all apps
npx nx run-many --target=test --all

# Build all apps
npx nx run-many --target=build --all

# Run E2E tests
npx nx run-many --target=e2e --all
```

## 📊 Benefits After Migration

✅ **Single Command**: Run all apps with one command  
✅ **Shared Code**: No duplication of common logic  
✅ **Faster Builds**: Nx caches and rebuilds only what changed  
✅ **Type Safety**: Shared types ensure consistency  
✅ **Easy Refactoring**: Change once, update everywhere  
✅ **Better DX**: Consistent structure and tooling  

## 🚨 Common Issues & Solutions

### Issue: Module not found errors

**Solution**: Check `tsconfig.base.json` path mappings:
```json
{
  "paths": {
    "@carddemo-nx/ui-components": ["libs/ui-components/src/index.ts"],
    "@carddemo-nx/shared-types": ["libs/shared-types/src/index.ts"],
    "@carddemo-nx/api-services": ["libs/api-services/src/index.ts"],
    "@carddemo-nx/utils": ["libs/utils/src/index.ts"]
  }
}
```

### Issue: Styles not loading

**Solution**: Ensure Tailwind is configured per app or migrate to shared styles.

### Issue: API calls failing

**Solution**: Check environment variables are copied to each app's `.env.local`.

## 📚 Next Steps After Migration

1. **Optimize Shared Libraries**: Continue extracting common code
2. **Set Up CI/CD**: Configure pipelines to leverage Nx caching
3. **Add Testing**: Write tests for shared libraries
4. **Documentation**: Update app-specific docs
5. **Performance**: Use Nx Cloud for distributed caching

---

**Ready to migrate?** Start with one app and verify it works before moving to the next!
