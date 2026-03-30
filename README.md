# Playwright + TypeScript Automation Framework

A scalable, production-ready automation framework built with Playwright and TypeScript, following strict OOP principles, strong quality gates, and CI/CD best practices.

---

## Tech Stack

- Playwright
- TypeScript (strict mode)
- ESLint + Prettier
- Husky + lint-staged
- Commitlint
- detect-secrets

---

## Project Structure

```
src/
├── pages/        # Page Objects
├── api/          # API clients
├── fixtures/     # Test setup/teardown
├── utils/        # Helpers
└── constants/    # Config data

tests/
├── ui/           # UI tests
└── api/          # API tests

.github/workflows/ # CI/CD pipelines
playwright.config.ts
```

---

## Setup

```bash
npm install
npx playwright install
npm run prepare
```

---

## Running Tests

```bash
npm test                 # All tests
npm run test:smoke       # Smoke tests
npm run test:e2e         # Complete customer journey
npx playwright test --headed
npx playwright test --debug
```

---

## The Complete Banking Journey Test

This framework features a single, comprehensive **business-readable end-to-end test** (`tests/ui/e2e-banking-journey.spec.ts`) that tells the complete story of a customer's interaction with the ParaBank application:

✅ **Registration** - Customer creates a new account  
✅ **Authentication** - Customer logs in  
✅ **Navigation** - Customer discovers features  
✅ **Account Management** - Customer opens a savings account  
✅ **Fund Transfer** - Customer transfers money  
✅ **Bill Payment** - Customer pays a bill

**Why one test?** It reflects real user workflows, is easy to understand for business stakeholders (non-technical people), and provides true integration validation.

For detailed information, see [BUSINESS-FOCUSED-TESTING.md](./BUSINESS-FOCUSED-TESTING.md)

---

## Test Strategy

Tag-based execution:

- `@smoke` – critical flows
- `@sanity` – quick validation
- `@regression` – full suite

```ts
test('Login @smoke', async ({ page }) => {
  // test steps
});
```

---

## Design Principles

### OOP + SOLID

- Page Object Model (POM)
- Private locators, public actions
- No assertions inside page objects

### Best Practices

- Avoid hard waits (`waitForTimeout`)
- Avoid XPath selectors
- Use Playwright auto-waiting
- Ensure test isolation

---

## Quality Gates (Pre-commit)

- Lint and format
- Type checking (`tsc --noEmit`)
- Secret scanning

Optional: smoke tests

---

## Security

- No hardcoded credentials
- Use `.env` for configuration
- Secret scanning enabled

---

## CI/CD

- GitHub Actions integration
- Parallel execution
- Multi-browser testing (Chromium, Firefox, WebKit)
- Test reports and artifacts

---
