// app/api/addorders/route.js
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order"; // Import the correct model

export async function POST(request) {
  await connectMongoDB();

  try {
    const body = await request.json();

    // Destructure the body to get the user data
    const {
      userName,
      userEmail,
      canteenName,
      orderId,
      orderType,
      meals,
      paymentStatus,
    } = body;

    // Validate the required fields
    if (
      !userName ||
      !userEmail ||
      !canteenName ||
      !orderId ||
      !orderType ||
      !paymentStatus
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: userName, userEmail, canteenName, or orderType.",
        }),
        { status: 400 }
      );
    }

    // Validate the meal data structure
    if (
      !Array.isArray(meals) ||
      meals.some(
        (meal) =>
          !meal.mealId ||
          !meal.mealName ||
          !meal.mealQuantity ||
          !meal.mealPrice
      )
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Invalid meal data: each meal must have mealId, mealName, mealQuantity, and mealPrice.",
        }),
        { status: 400 }
      );
    }

    // Idempotency: if an order with this orderId already exists, return success
    const existing = await Order.findOne({ orderId });
    if (existing) {
      return new Response(
        JSON.stringify({ message: "Order already exists", order: existing }),
        { status: 200 }
      );
    }

    // Set a default orderStatus if it's not provided
    const orderStatus = "Pending"; // Default status, adjust if necessary

    // Create a new order document
    const newOrder = new Order({
      userName,
      userEmail,
      canteenName,
      orderId,
      orderType,
      orderStatus,
      paymentStatus,
      meals, // an array of meal objects
    });

    // Save the order to the database
    await newOrder.save();

    return new Response(
      JSON.stringify({
        message: "Order created successfully",
        order: newOrder,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create order. Please try again later.",
      }),
      { status: 500 }
    );
  }
}
