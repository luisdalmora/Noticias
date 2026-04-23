import { getCache } from './_lib/cache.js';
import { runWorkflow } from './_lib/workflowService.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { data, lastUpdated } = getCache();
    
    // If cache is empty, try to fetch once
    if (!data || data.length === 0) {
      console.log('Cache empty, running initial workflow...');
      const freshData = await runWorkflow();
      return res.status(200).json(freshData);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('API News Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
