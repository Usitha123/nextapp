import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { items } = await req.json()

    const line_items = items.map(item => ({
      price_data: {
        currency: 'lkr',
        product_data: { name: item.mealName },
        unit_amount: item.mealPrice * 100,
      },
      quantity: item.mealQuantity,
    }))

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/payment/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/payment/cancel`,
    })

    return Response.json({ url: session.url })
  } catch (error) {
    console.error('Stripe Checkout Error:', error)
    return new Response(JSON.stringify({ error: 'Checkout session failed.' }), {
      status: 500,
    })
  }
}
