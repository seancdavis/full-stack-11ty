import { getStore } from '@netlify/blobs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { email } = await req.json();
    
    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const store = getStore({
      name: 'waitlist',
    });

    await store.set(email, {
      email,
      createdAt: new Date().toISOString()
    });

    // Set cookie with success message
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Set-Cookie': 'feedback=Successfully joined the waitlist!; Path=/; Max-Age=60',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return Response.json({ error: 'Failed to process request' }, { status: 500 });
  }
}