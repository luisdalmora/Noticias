import { sendDiscordNotification } from './services/discordService.js';
import { storage } from './services/storageService.js';

async function run() {
  console.log('Fetching latest data for Discord...');
  const data = storage.getLatestData();
  if (data && data.length > 0) {
    await sendDiscordNotification(data);
    console.log('Discord notification sent successfully.');
  } else {
    console.log('No data to send.');
  }
  process.exit(0);
}

run();
