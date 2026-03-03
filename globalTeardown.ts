import { sendSlackNotification } from './api/utils/slackNotifier';
import { exec } from 'child_process';
import util from 'util';
import { request } from '@playwright/test';
import { FAIL, SUCCESS } from './core/constants/pictures';
import { waitForSeconds } from './e2e/utils/delay';

const execPromise = util.promisify(exec);

const reporter = process.env.REPORTER || '';
const isAllureEnabled = reporter.includes('allure');
const ALLURE_SERVER = process.env.ALLURE_SERVER;
const PROJECT_ID = process.env.ALLURE_PROJECT_ID;
const ALLURE_TOKEN = process.env.ALLURE_TOKEN;

async function getJwtToken(): Promise<string | null> {
  if (!ALLURE_TOKEN) {
    console.error(
      '❌ ERROR: Allure API token is missing. Set ALLURE_TOKEN in .env'
    );
    return null;
  }

  try {
    const context = await request.newContext();
    console.log(`Attempting to get JWT token using the user token`);

    const response = await context.post(
      `${ALLURE_SERVER}/api/uaa/oauth/token`,
      {
        headers: {
          Authorization: `Bearer ${ALLURE_TOKEN}`,
          Accept: 'application/json',
        },
        form: {
          grant_type: 'apitoken',
          scope: 'openid',
          token: ALLURE_TOKEN,
        },
      }
    );

    if (response.ok()) {
      const responseBody = await response.json();
      const jwtToken = responseBody.access_token;
      console.log(`✅ Successfully obtained JWT token`);
      return jwtToken;
    } else {
      const errorDetails = await response.text();
      throw new Error(
        `❌ Failed to get JWT token: ${response.status()} ${errorDetails}`
      );
    }
  } catch (error) {
    console.error(`❌ ERROR: ${error}`);
    return null;
  }
}

async function closeTestRun(launchId: string) {
  if (!ALLURE_TOKEN) {
    console.error(
      '❌ ERROR: Allure API token is missing. Set ALLURE_TOKEN in .env'
    );
    return;
  }

  const jwtToken = await getJwtToken();
  if (!jwtToken) {
    console.error('❌ ERROR: JWT token is missing. Cannot close test run.');
    return;
  }

  const context = await request.newContext();
  try {
    console.log(`Attempting to close test run with ID: ${launchId}`);

    if (!launchId) {
      throw new Error('❌ Launch ID is missing or invalid.');
    }

    const stopResponse = await context.post(
      `${ALLURE_SERVER}/api/launch/${launchId}/close`,
      {
        headers: { Authorization: `Bearer ${jwtToken}` },
      }
    );

    if (stopResponse.ok()) {
      console.log(`✅ Successfully closed test run with ID: ${launchId}`);
    } else {
      const errorDetails = await stopResponse.text();
      throw new Error(
        `Failed to stop test run: ${stopResponse.status()} ${errorDetails}`
      );
    }
  } catch (error) {
    console.error(`❌ ERROR: ${error}`);
  } finally {
    await context.dispose();
  }
}

async function uploadAllureResults() {
  console.log(`📢 Uploading test results to Allure TestOps`);

  try {
    const { stdout, stderr } = await execPromise(
      `allurectl upload --endpoint ${ALLURE_SERVER} --token ${ALLURE_TOKEN} --project-id ${PROJECT_ID} --launch-name "Test Run ${new Date().getTime()}" allure-results`
    );
    if (stderr) {
      console.error('Error uploading results:', stderr);
    }
    const match = stdout.match(/Launch \[(\d+)]/);
    if (match) {
      const launchId = match[1];
      console.log(`Launch ID: ${launchId}`);

      const allureReportUrl = `${ALLURE_SERVER}/launch/${launchId}`;
      console.log(`Test run URL: ${allureReportUrl}`);

      await waitForSeconds(10);
      await closeTestRun(launchId);

      return allureReportUrl;
    } else {
      new Error('Launch ID not found in allurectl output');
    }
  } catch (error) {
    console.error('Error executing allurectl upload:', error);
    return null;
  }
}

export default async function globalTeardown() {
  if (!isAllureEnabled) {
    console.log(
      '⏩ Allure report is disabled. Skipping report generation and Slack notification.'
    );
    return;
  }

  const allureReportUrl = await uploadAllureResults();

  if (allureReportUrl) {
    await sendSlackNotification(
      `✅ Tests completed successfully! 🎉 View the report: ${allureReportUrl}`,
      SUCCESS
    );
  } else {
    await sendSlackNotification(
      `⚠️ Tests completed, but the report was not uploaded!`,
      FAIL
    );
  }
}
