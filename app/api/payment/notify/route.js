import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Verify the payment with PayHere (optional but recommended)
    // This would typically involve comparing the received merchant_id, 
    // order_id, and payment status against your expected values
    
    // Sample validation logic
    const { merchant_id, order_id, payment_id, payhere_amount, payhere_currency, status_code } = body;
    
    // Validate merchant ID
    if (merchant_id !== process.env.PAYHERE_MERCHANT_ID) {
      return NextResponse.json({ message: 'Invalid merchant ID' }, { status: 400 });
    }
    
    // Check payment status (1 = success)
    if (status_code === 2) {
      // Payment is successful, update your database
      // await updateOrderStatus(order_id, 'paid');
      
      return NextResponse.json({ message: 'Payment successfully processed' });
    } else {
      // Payment failed or pending
      // await updateOrderStatus(order_id, 'failed');
      
      return NextResponse.json({ message: 'Payment failed or pending' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing payment notification:', error);
    return NextResponse.json({ message: 'Error processing payment' }, { status: 500 });
  }
}