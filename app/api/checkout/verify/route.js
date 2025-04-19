import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Session ID missing' }), { status: 400 });
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Payment was successful
      return new Response(JSON.stringify({
        success: true,
        userId: session.metadata.userId, // Assuming you stored userId in metadata
        items: session.metadata.items, // Order items saved in metadata
        totalAmount: session.amount_total / 100, // Amount in cents, convert to dollars
      }), { status: 200 });
    } else {
      // Payment was not successful
      return new Response(JSON.stringify({ success: false }), { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(JSON.stringify({ error: 'Payment verification failed' }), { status: 500 });
  }
}
