import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { items } = await req.json()
    
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY environment variable')
      return new Response(
        JSON.stringify({ error: 'Server configuration error.' }), 
        { status: 500 }
      )
    }
    
    if (!process.env.BASE_URL) {
      console.error('Missing BASE_URL environment variable')
      return new Response(
        JSON.stringify({ error: 'Server configuration error.' }), 
        { status: 500 }
      )
    }

    const line_items = items.map(item => ({
      price_data: {
        currency: 'LKR',
        product_data: { name: item.mealName },
        unit_amount: Math.round(item.mealPrice * 100),
      },
      quantity: item.mealQuantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/payment/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/payment/cancel`,
    })

    if (!session || !session.url) {
      console.error('Stripe session created but no URL returned:', session)
      return new Response(
        JSON.stringify({ error: 'Failed to generate checkout URL' }), 
        { status: 500 }
      )
    }

    return Response.json({ url: session.url })
  } catch (error) {
    console.error('Stripe Checkout Error:', error.message, error.stack)
    return new Response(
      JSON.stringify({ 
        error: 'Checkout session failed.', 
        details: error.message 
      }), 
      { status: 500 }
    )
  }
}