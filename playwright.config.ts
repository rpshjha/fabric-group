import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const baseURL = process.env.BASE_URL || 'https://parabank.parasoft.com';
const headless =
  process.env.HEADLESS === undefined ? true : process.env.HEADLESS.toLowerCase() !== 'false';

const slowMo = process.env.CI ? 0 : process.env.SLOW_MO ? parseInt(process.env.SLOW_MO, 10) : 300;

const timeout = parseInt(process.env.TIMEOUT || '60000', 10);
const expectTimeout = parseInt(process.env.EXPECT_TIMEOUT || '5000', 10);

console.log('CWD:', process.cwd());
console.log('HEADLESS ENV:', process.env.HEADLESS);
console.log('GLOBAL TIMEOUT:', timeout);
console.log('EXPECT TIMEOUT:', expectTimeout);

const viewportWidth = process.env.VIEWPORT_WIDTH
  ? parseInt(process.env.VIEWPORT_WIDTH, 10)
  : undefined;

const viewportHeight = process.env.VIEWPORT_HEIGHT
  ? parseInt(process.env.VIEWPORT_HEIGHT, 10)
  : undefined;

const browsers = (process.env.BROWSERS || 'chromium').split(',').map((b) => b.trim());

const allProjects: Record<string, any> = {
  chromium: {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      headless,
    },
  },
  firefox: {
    name: 'firefox',
    use: {
      ...devices['Desktop Firefox'],
      headless,
    },
  },
  webkit: {
    name: 'webkit',
    use: {
      ...devices['Desktop Safari'],
      headless,
    },
  },
};

const selectedProjects = browsers.map((browser) => {
  if (!allProjects[browser]) {
    throw new Error(`Invalid browser in BROWSERS env: ${browser}`);
  }
  return {
    ...allProjects[browser],
    use: {
      ...allProjects[browser].use,
      ...(viewportWidth &&
        viewportHeight && {
          viewport: {
            width: viewportWidth,
            height: viewportHeight,
          },
        }),
    },
  };
});

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',

  outputDir: 'test-output/artifacts',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  timeout,
  expect: {
    timeout: expectTimeout,
  },

  reporter: [
    ['html', { outputFolder: 'test-output/report' }],
    ['json', { outputFile: 'test-output/results/results.json' }],
    ['junit', { outputFile: 'test-output/results/junit.xml' }],
    ['list'],
    [path.join(process.cwd(), 'src/reporters/email-reporter.ts')],
  ],

  use: {
    baseURL,
    headless,
    launchOptions: {
      slowMo,
    },
    trace: 'on-first-retry',
    screenshot: {
      mode: 'only-on-failure',
    },
    video: 'retain-on-failure',
    actionTimeout: 10000,
  },

  projects: selectedProjects,
});
