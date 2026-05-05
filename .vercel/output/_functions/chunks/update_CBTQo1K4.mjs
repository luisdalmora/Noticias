import { p as performUpdate } from './workflow-service_D2HR1-Ji.mjs';

const GET = async ({ request }) => {
  return await handleUpdate(request);
};

const POST = async ({ request }) => {
  return await handleUpdate(request);
};

async function handleUpdate(request) {
  const authHeader = request.headers.get('Authorization');
  const url = new URL(request.url);
  const keyParam = url.searchParams.get('key');
  
  const cronSecret = process.env.CRON_SECRET || 'dev-secret';

  // Check auth (either Header or Query param for easy testing)
  if ((!authHeader || authHeader !== `Bearer ${cronSecret}`) && keyParam !== cronSecret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const result = await performUpdate();
    
    return new Response(JSON.stringify(result), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "Falha crítica na atualização.",
      error: error.message
    }), { status: 500 });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
