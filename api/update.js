import { runWorkflow } from './_lib/workflowService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('Forcing manual update...');
    const freshData = await runWorkflow();
    
    return res.status(200).json({ 
      status: 'success', 
      message: 'Workflow executado com sucesso',
      count: freshData.length 
    });
  } catch (error) {
    console.error('API Update Error:', error);
    return res.status(500).json({ error: 'Erro ao executar o workflow', details: error.message });
  }
}
