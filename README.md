# Autotests

### What needs to be installed for automated tests to work:

1. Playwright

```bash
npx playwright install --with-deps
```

2. Package manager

```bash
apt-get update && apt-get install -y wget
```

3. Allure ctl

```bash
wget https://github.com/allure-framework/allurectl/releases/latest/download/allurectl_linux_amd64 -O ./allurectl
```

### How the test environment is selected:

Currently, there are variables in GitLab:

1. BASE_URL – the default URL for API tests (e.g., https://api-stage03.casino.scalefinal.io)
2. BASE_URL_E2E – the default URL for E2E tests (e.g., https://front-stage03.casino.scalefinal.io)

### How to run automated tests:

Runs all tests using the Allure reporter

```bash
npx playwright test --reporter=allure-playwright
```

Run all tests for the specific service (user-service is example, you can use other names)

```bash
npx playwright test --reporter=allure-playwright --grep @user-service
```

### Local Use

You can use console commands to run autotests locally. The full list of which can be viewed at
the [link](https://playwright.dev/docs/test-cli).

The basic command to run the entire test suite is

```bash
npx playwright test
```
