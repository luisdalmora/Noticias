import fs from 'fs';
import path from 'path';

export class StorageService {
  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  saveData(data) {
    // Current date format: YYYY-MM-DD
    const today = new Date();
    // Use local timezone format if needed, but ISO is safer for filenames
    const dateStr = today.toISOString().split('T')[0];
    
    const dailyPath = path.join(this.dataDir, `${dateStr}.json`);
    const latestPath = path.join(this.dataDir, 'latest.json');

    const jsonStr = JSON.stringify(data, null, 2);

    fs.writeFileSync(dailyPath, jsonStr, 'utf8');
    fs.writeFileSync(latestPath, jsonStr, 'utf8');
    
    console.log(`Data saved to ${dailyPath} and latest.json`);
  }

  getLatestData() {
    const latestPath = path.join(this.dataDir, 'latest.json');
    if (fs.existsSync(latestPath)) {
      return JSON.parse(fs.readFileSync(latestPath, 'utf8'));
    }
    return [];
  }
}

export const storage = new StorageService();
