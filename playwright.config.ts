import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL || 'https://parabank.parasoft.com';
const headless =
  process.env.HEADLESS === undefined ? true : process.env.HEADLESS.toLowerCase() !== 'false';

const slowMo = process.env.CI ? 0 : process.env.SLOW_MO ? parseInt(process.env.SLOW_MO, 10) : 300;

const timeout = parseInt(process.env.TIMEOUT || '60000', 10);
const expectTimeout = parseInt(process.env.EXPECT_TIMEOUT || '5000', 10);
const retries = process.env.RETRIES ? parseInt(process.env.RETRIES, 10) : 2;

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
  retries: process.env.CI ? retries : 0,
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
  ],

  use: {
    baseURL,
    headless,
    launchOptions: {
      slowMo,
    },
    screenshot: 'only-on-failure',
    video: 'on',
    trace: 'on',
    actionTimeout: 10000,
  },

  projects: selectedProjects,
});
