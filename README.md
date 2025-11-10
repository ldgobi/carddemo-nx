# CardDemo Nx Monorepo

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A modern, scalable monorepo implementation of the CardDemo application suite using Nx, Next.js, TypeScript, and Tailwind CSS.

## 🏗️ Architecture

This workspace contains **5 microfrontend applications** and **4 shared libraries**, all managed by Nx for optimal build performance and code sharing.

### Applications

All applications are built with **Next.js 14+**, **TypeScript**, **App Router**, and **Tailwind CSS**.

#### 1. **User Management** (`@carddemo-nx/user-management`)
- **Port**: 4201
- **Description**: User authentication and administration system
- **Features**: User sign-on, CRUD operations, role-based access control, keyboard-driven UI (F3-F12)

#### 2. **Account Management** (`@carddemo-nx/account-management`)
- **Port**: 4205
- **Description**: Account and card data management system
- **Features**: Search accounts, view/edit account details, SSN masking, credit utilization display

#### 3. **Bill Payment** (`@carddemo-nx/bill-payment`)
- **Port**: 4202
- **Description**: Online bill payment processing system
- **Features**: Balance retrieval, payment processing, transaction ID generation, automatic balance updates

#### 4. **Credit Card Management** (`@carddemo-nx/credit-card-management`)
- **Port**: 4204
- **Description**: Comprehensive credit card management microfrontend
- **Features**: Browse/filter cards, view masked data, update card details, concurrent modification detection

#### 5. **Transaction Management** (`@carddemo-nx/transaction-management`)
- **Port**: 4203
- **Description**: Full-featured transaction management system
- **Features**: Transaction CRUD, search/filter, account tracking, report generation (monthly/yearly/custom)

### Shared Libraries

- **`@carddemo-nx/ui-components`**: Reusable React components (buttons, forms, tables, etc.)
- **`@carddemo-nx/shared-types`**: TypeScript type definitions and interfaces
- **`@carddemo-nx/api-services`**: Shared API client services and HTTP utilities
- **`@carddemo-nx/utils`**: Utility functions (formatting, validation, constants)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Install dependencies
npm install

# Configure environment variables for each app
# Create .env.local in each app directory:
# apps/user-management/.env.local
# NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 📦 Development

### Running Applications

```bash
# Run a single application
npx nx serve user-management

# Run with custom port
npx nx serve account-management --port 4205
npx nx serve bill-payment --port 4202
npx nx serve credit-card-management --port 4204
npx nx serve transaction-management --port 4203

# Run multiple applications (requires separate terminal windows)
npx nx run-many --target=serve --projects=user-management,account-management
```

### Building Applications

```bash
# Build a single application
npx nx build user-management

# Build all applications
npx nx run-many --target=build --all

# Build only affected projects (after code changes)
npx nx affected:build
```

### Testing

```bash
# Run tests for a project
npx nx test user-management

# Run all tests
npx nx run-many --target=test --all

# Run E2E tests
npx nx e2e user-management-e2e

# Run affected tests only
npx nx affected:test
```

### Linting

```bash
# Lint a single project
npx nx lint user-management

# Lint all projects
npx nx run-many --target=lint --all

# Lint only affected projects
npx nx affected:lint
```

## 🔧 Nx Commands

### Visualize Dependencies

```bash
# View dependency graph in browser
npx nx graph
```

### Code Generation

```bash
# Generate a new component
npx nx g @nx/next:component MyComponent --project=user-management

# Generate a new page
npx nx g @nx/next:page my-page --project=user-management

# Generate a new library
npx nx g @nx/js:lib my-lib --directory=libs/my-lib
```

### Cache Management

```bash
# Clear Nx cache
npx nx reset

# View project details
npx nx show project user-management
```

## 📁 Workspace Structure

```
carddemo-nx/
├── apps/
│   ├── user-management/              # User management app
│   ├── account-management/           # Account management app
│   ├── bill-payment/                 # Bill payment app
│   ├── credit-card-management/       # Credit card management app
│   ├── transaction-management/       # Transaction management app
│   └── *-e2e/                        # E2E tests for each app
├── libs/
│   ├── ui-components/                # Shared UI components
│   ├── shared-types/                 # Shared TypeScript types
│   ├── api-services/                 # Shared API services
│   └── utils/                        # Shared utilities
├── nx.json                           # Nx workspace configuration
├── package.json                      # Root package.json
├── tsconfig.base.json                # Base TypeScript config
└── README.md                         # This file
```

## 🎯 Key Benefits

- **Code Sharing**: Reusable components and utilities across all apps
- **Smart Rebuilds**: Only rebuild affected projects
- **Computation Caching**: Cache build results for faster builds
- **Type Safety**: Shared TypeScript types ensure consistency
- **Developer Experience**: Single repository, consistent tooling
- **Scalability**: Easy to add new apps and libraries

## 🚀 Deployment

```bash
# Build all apps for production
npx nx run-many --target=build --all --configuration=production

# Build output location
dist/apps/user-management/
dist/apps/account-management/
dist/apps/bill-payment/
dist/apps/credit-card-management/
dist/apps/transaction-management/
```

Each app can be deployed independently to Vercel, AWS, Azure, or any Next.js hosting platform.

## 🔄 Migrating Existing Code

To migrate code from standalone Next.js apps:

1. Copy source files to the appropriate app directory
2. Update import paths to use workspace aliases (e.g., `@carddemo-nx/ui-components`)
3. Move shared code to libraries
4. Run `npx nx graph` to verify dependencies

## 📚 Resources

- [Nx Documentation](https://nx.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Built with ❤️ using Nx, Next.js, TypeScript, and Tailwind CSS**


You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/next?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
