import axios from 'axios';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export async function sendSlackNotification(message: string, imageUrl: string) {
  if (!SLACK_WEBHOOK_URL) {
    console.warn('Slack Webhook URL is not configured');
    return;
  }

  const payload = {
    text: message,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message,
        },
        accessory: {
          type: 'image',
          image_url: imageUrl,
          alt_text: 'Test result image',
        },
      },
    ],
  };

  await axios.post(SLACK_WEBHOOK_URL, payload);
}
