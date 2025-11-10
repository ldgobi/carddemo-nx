# CardDemo Nx - Quick Start Guide

## 🎯 What You Just Created

You now have a modern **Nx monorepo** with:

✅ **5 Next.js Applications**:
- User Management (Port 4200)
- Account Management (Port 4201)
- Bill Payment (Port 4202)
- Credit Card Management (Port 4203)
- Transaction Management (Port 4204)

✅ **4 Shared Libraries**:
- `@carddemo-nx/ui-components` - Reusable UI components
- `@carddemo-nx/shared-types` - TypeScript types
- `@carddemo-nx/api-services` - API client services
- `@carddemo-nx/utils` - Utility functions

✅ **Development Tools**:
- Nx for smart builds and caching
- Jest for unit testing
- Playwright for E2E testing
- ESLint + Prettier for code quality

## 🚀 Get Started in 3 Steps

### 1️⃣ Navigate to the Workspace

```bash
cd carddemo-nx
```

### 2️⃣ Configure Environment Variables

Create `.env.local` files for each app:

```bash
# Example: apps/user-management/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=User Management
```

Repeat for all 5 apps (adjust app name accordingly).

### 3️⃣ Start Developing!

```bash
# Run user management app
npx nx serve user-management

# Open http://localhost:4200 in your browser
```

## 📖 Common Commands

### Development

```bash
# Run any application
npx nx serve <app-name>

# Examples:
npx nx serve user-management           # Port 4200
npx nx serve account-management --port 4201
npx nx serve bill-payment --port 4202
npx nx serve credit-card-management --port 4203
npx nx serve transaction-management --port 4204
```

### Building

```bash
# Build single app
npx nx build user-management

# Build all apps
npx nx run-many --target=build --all

# Build only changed apps
npx nx affected:build
```

### Testing

```bash
# Test single app
npx nx test user-management

# Test all
npx nx run-many --target=test --all

# E2E test
npx nx e2e user-management-e2e
```

### Visualize Dependencies

```bash
# See how projects depend on each other
npx nx graph
```

## 🎨 Next Steps

### 1. Configure Tailwind CSS (if needed)

Each app has basic CSS. To use Tailwind:

```bash
# Generate tailwind config for an app
cd apps/user-management
npx tailwindcss init -p
```

Then update `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../libs/**/*.{js,ts,jsx,tsx}', // Include shared libs
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

And in `src/app/global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. Create Shared Components

```bash
# Generate a button component in ui-components library
npx nx g @nx/react:component Button --project=ui-components --export
```

Use it in any app:

```typescript
import { Button } from '@carddemo-nx/ui-components';
```

### 3. Add API Services

In `libs/api-services/src/lib/`, create service files:

```typescript
// libs/api-services/src/lib/user-api.service.ts
export const userApi = {
  getUsers: async () => {
    // Your API logic
  }
};
```

Import in apps:

```typescript
import { userApi } from '@carddemo-nx/api-services';
```

### 4. Define Shared Types

In `libs/shared-types/src/lib/`:

```typescript
// libs/shared-types/src/lib/user.types.ts
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userType: 'A' | 'U';
}
```

Import anywhere:

```typescript
import { User } from '@carddemo-nx/shared-types';
```

## 🔧 Workspace Structure

```
carddemo-nx/
├── apps/                        # All applications
│   ├── user-management/
│   │   ├── src/app/            # Next.js pages
│   │   ├── package.json
│   │   └── next.config.js
│   ├── account-management/
│   ├── bill-payment/
│   ├── credit-card-management/
│   └── transaction-management/
│
├── libs/                        # Shared libraries
│   ├── ui-components/
│   ├── shared-types/
│   ├── api-services/
│   └── utils/
│
├── nx.json                      # Nx configuration
├── package.json                 # Root dependencies
└── tsconfig.base.json          # Base TypeScript config
```

## 💡 Pro Tips

### 1. Use Nx Console Extension (VS Code)

Install "Nx Console" extension for VS Code for visual task running and code generation.

### 2. Smart Builds

Nx only rebuilds what changed:

```bash
# After making changes, build only affected apps
npx nx affected:build
```

### 3. Code Generation

Use generators for consistency:

```bash
# New component
npx nx g @nx/next:component MyComponent --project=user-management

# New page
npx nx g @nx/next:page my-page --project=user-management

# New library
npx nx g @nx/js:lib my-new-lib --directory=libs/my-new-lib
```

### 4. Dependency Graph

Always check dependencies before making changes:

```bash
npx nx graph
```

### 5. Parallel Execution

Run multiple tasks in parallel:

```bash
# Test all apps simultaneously
npx nx run-many --target=test --all --parallel=5
```

## 🐛 Troubleshooting

### Cache Issues

```bash
npx nx reset
rm -rf node_modules
npm install
```

### Port Already in Use

```bash
# Use different port
npx nx serve user-management --port 3001
```

### Import Errors

Check `tsconfig.base.json` for correct path mappings:

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

## 📚 Learn More

- **Nx Docs**: https://nx.dev
- **Next.js Docs**: https://nextjs.org/docs
- **TypeScript**: https://www.typescriptlang.org/docs

## 🎉 You're Ready!

Start building amazing applications with your new Nx monorepo! 

```bash
# Let's go! 🚀
npx nx serve user-management
```

---

**Questions?** Check the main [README.md](./README.md) or visit [Nx Documentation](https://nx.dev).
