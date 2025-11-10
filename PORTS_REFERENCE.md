# 🚀 Quick Reference: Application Ports & Backend URLs

## Application Overview

| # | Application | Frontend | Backend | Backend URL |
|---|-------------|----------|---------|-------------|
| 1 | **User Management** | :4201 | :8081 | http://localhost:8081/api |
| 2 | **Account Management** | :4205 | :8085 | http://localhost:8085/api |
| 3 | **Bill Payment** | :4202 | :8082 | http://localhost:8082/api |
| 4 | **Credit Card Management** | :4204 | :8084 | http://localhost:8084/api |
| 5 | **Transaction Management** | :4203 | :8083 | http://localhost:8083/api |

---

## 🏃 Quick Start Commands

```bash
# User Management
npx nx serve user-management
# → http://localhost:4201

# Account Management
npx nx serve account-management --port 4205
# → http://localhost:4205

# Bill Payment
npx nx serve bill-payment --port 4202
# → http://localhost:4202

# Credit Card Management
npx nx serve credit-card-management --port 4204
# → http://localhost:4204

# Transaction Management
npx nx serve transaction-management --port 4203
# → http://localhost:4203
```

---

## 📁 Environment Files Location

```
apps/
├── user-management/.env.local          (Port 8081)
├── account-management/.env.local       (Port 8085)
├── bill-payment/.env.local             (Port 8082)
├── credit-card-management/.env.local   (Port 8084)
└── transaction-management/.env.local   (Port 8083)
```

---

## 🔧 Environment Variable Pattern

Each `.env.local` follows this pattern:

```env
NEXT_PUBLIC_API_URL=http://localhost:808X/api
NEXT_PUBLIC_APP_NAME=Application Name
NEXT_PUBLIC_APP_PORT=420X
```

---

## ✅ Configuration Status

- [x] All 5 applications configured
- [x] Environment variables set
- [x] API proxies configured
- [x] Documentation complete
- [x] `.gitignore` updated
- [x] Ready for development

---

## 📖 Documentation Files

- `ENVIRONMENT_CONFIG.md` - Full configuration guide
- `ENV_CONFIG_SUMMARY.md` - Detailed summary
- `README.md` - Main workspace documentation
- `QUICK_START.md` - Quick start guide

---

**Status**: ✅ Ready  
**Date**: November 10, 2025
