import { request } from '@playwright/test';
import { waitForSeconds } from '../e2e/utils/delay';
import * as cheerio from 'cheerio';
import * as quotedPrintable from 'quoted-printable';

export async function getAuthCodeFromEmail(
  email: string
): Promise<string | null> {
  const MAIL_HOST = process.env.MAIL_HOST;
  const context = await request.newContext();
  await waitForSeconds(5);
  const response = await context.get(`https://${MAIL_HOST}/api/v2/messages`);

  if (!response.ok()) {
    console.error(
      `Failed to fetch messages from MailHog. Status: ${response.status()}`
    );
    return null;
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    console.log('No messages found in MailHog');
    return null;
  }

  const matchingMessage = data.items.find((msg: any) =>
    msg.To?.some((to: any) => to.Mailbox + '@' + to.Domain === email)
  );

  if (!matchingMessage) {
    console.log(`No messages found for recipient ${email}`);
    return null;
  }

  const body = matchingMessage.Content.Body as string;

  const match = body.match(/\b\d{6}\b/);

  if (match) {
    const code = match[0];
    console.log(`Authorization code found: ${code}`);
    return code;
  } else {
    console.log('Authorization code not found in message body');
    return null;
  }
}

export async function getResetPasswordTokenFromEmail(
  email: string,
  maxWaitMs = 15000,
  pollIntervalMs = 1000
): Promise<string | null> {
  const MAIL_HOST = process.env.MAIL_HOST;
  const context = await request.newContext();
  const start = Date.now();
  let matchingMessage: any = null;

  while (Date.now() - start < maxWaitMs) {
    const response = await context.get(`https://${MAIL_HOST}/api/v2/messages`);

    if (!response.ok()) {
      console.error(
        `Failed to fetch messages from MailHog. Status: ${response.status()}`
      );
      return null;
    }

    const data = await response.json();

    matchingMessage = data.items.find((msg: any) =>
      msg.To?.some((to: any) => `${to.Mailbox}@${to.Domain}` === email)
    );

    if (matchingMessage) {
      break;
    }

    await new Promise((res) => setTimeout(res, pollIntervalMs));
  }

  if (!matchingMessage) {
    console.log(`No messages found for recipient ${email}`);
    return null;
  }

  const rawBody = matchingMessage.Content.Body;
  // @ts-ignore
  const decodedBody = quotedPrintable.decode(rawBody).toString('utf-8');

  const $ = cheerio.load(decodedBody);

  const link = $('a')
    .filter((_, el) => $(el).text().trim() === 'Reset Your Password')
    .attr('href');

  if (!link) {
    console.error('Reset password link not found in the email body.');
    return null;
  }

  const urlObj = new URL(link);
  const token = urlObj.searchParams.get('token');

  if (!token) {
    console.error('Token not found in the reset password link.');
    return null;
  }

  return token;
}
