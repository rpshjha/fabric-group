# Playwright + TypeScript Automation Framework

A test automation framework built with Playwright and TypeScript.

ParaBank is a realistic online banking application that allows users to manage financial transactions.

This project implements an end-to-end (E2E) automation framework covering:

- UI Test Automation
- API Test Automation
- CI/CD Integration (GitHub Actions)
- Email Reporting

Application URL: https://parabank.parasoft.com/

---

## Tech Stack

- Playwright
- TypeScript

---

## Prerequisites

Before setting up the project, ensure the following tools are installed:

- **Node.js** (v18 or higher recommended)  
- **npm** (comes with Node.js)  
- **Git** (for cloning the repository)  

### Optional (Recommended)

- **VS Code** or any IDE with TypeScript support   

---

### Verify Installation

```bash
node -v
npm -v
git --version
```

## Setup

```bash
npm install
npx playwright install
npm run prepare

```

## Running Tests

```bash
npm run test
npm run test:e2e
npm run test:api
npx playwright test --headed
npx playwright test --debug
```

## CI/CD

Runs on every commit using GitHub Actions
Executes full UI + API suite
Generates reports and sends email summary

## Test Scenarios Covered

### 🏦 End-to-End Banking Journey

- User registers a new account with unique credentials
- User logs into the application
- User verifies global navigation menu and account services
- User views account overview and balance details
- User opens a new Savings account
- User transfers funds between accounts
- User pays a bill successfully
