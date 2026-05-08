import { enhanceTopNewsWithAI } from './src/services/aiService.js';

const mockNews = [
  {
    id: "mrr9fccb8",
    title: "Masters of Albion Review: Peter Molyneux’s ‘last game’ is a veritable megamix of his greatest hits",
    summary: "Early Access Review: 22Cans' god sim resurrects much that was good about Fable, Dungeon Keeper and Black & White, but it needs more…",
    category: "Nintendo",
    link: "http://test",
    impact: "Alta",
    type: "Oficial",
    source: "VGC",
    pubDate: "Thu, 23 Apr 2026",
    thumbnail: null
  }
];

async function run() {
  console.log('Testing AI Service...');
  try {
    const result = await enhanceTopNewsWithAI(mockNews);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
  }
}

run();
