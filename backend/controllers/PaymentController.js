const stripe = require("stripe")(process.env.STRIPE_KEY);
const User = require("../models/User");
const OrderModel = require("../models/OrderModel");
const ProductModel = require("../models/ProductModel");
class PaymentController {
  async paymentProcess(req, res) {
    const { cart, id } = req.body;
    try {
      const user = await User.findOne({ _id: id });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const orderData = cart.map((item) => {
        return {
          _id: item._id,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          userId: user._id,
        };
      });
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: user.email,
        metadata: {
          userId: user._id.toString(),
          cart: JSON.stringify(orderData),
        },
        shipping_address_collection: {
          allowed_countries: ["PK", "IN", "BD","US"],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 0,
                currency: "usd",
              },
              display_name: "Free shipping",
              // Delivers between 5-7 business days
              delivery_estimate: {
                minimum: {
                  unit: "business_day",
                  value: 5,
                },
                maximum: {
                  unit: "business_day",
                  value: 7,
                },
              },
            },
          },
        ],
        line_items: cart.map((item) => {
          const percentage = item.discount / 100;
          let actualPrice = item.price - item.price * percentage;
          actualPrice = parseFloat(actualPrice);
          actualPrice = actualPrice * 100;
          actualPrice = actualPrice.toFixed(1);
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.title,
              },
              unit_amount_decimal: actualPrice,
            },
            quantity: item.quantity,
          };
        }),
        success_url: `${process.env.CLIENT}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT}/cart`,
      });
      
      return res.json({ url: session.url });
    } catch (error) {
      console.error('Payment process error:', error);
      return res.status(500).json({ error: "Payment session creation failed" });
    }
  }
  async checkOutSession(request, response) {
    let event;

    try {
      const sig = request.headers["stripe-signature"];
      
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        process.env.ENDPOINTSECRET
      );
      
      console.log('Webhook received:', event.type);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      try {
        // Get user ID from metadata
        const userId = session.metadata && session.metadata.userId;
        if (!userId) {
          throw new Error('User ID not found in session metadata');
        }
        
        // Parse cart data from session metadata
        let cartItems = [];
        try {
          if (session.metadata && session.metadata.cart) {
            cartItems = JSON.parse(session.metadata.cart);
          } else {
            // Fall back to customer metadata if needed
            const customer = await stripe.customers.retrieve(session.customer);
            cartItems = JSON.parse(customer?.metadata?.cart || '[]');
          }
          
          if (!Array.isArray(cartItems) || cartItems.length === 0) {
            throw new Error('Invalid cart data format');
          }
        } catch (parseError) {
          console.error('Error parsing cart data:', parseError);
          throw new Error(`Cart data parsing failed: ${parseError.message}`);
        }
        
        // Check if order already exists for this payment intent
        const existingOrder = await OrderModel.findOne({
          payment_intent: session.payment_intent,
        });
        
        if (existingOrder) {
          console.log('Order already exists for this payment, skipping creation');
          return response.json({ received: true, status: 'duplicate' });
        }
        
        // Process each item in the cart
        for (const item of cartItems) {
          // Validate item data
          if (!item._id || !item.userId || !item.quantity) {
            console.warn('Skipping invalid cart item:', item);
            continue;
          }
          
          // Check if product exists
          const product = await ProductModel.findById(item._id);
          if (!product) {
            console.warn(`Product not found: ${item._id}`);
            continue;
          }
          
          // Check if this user has already reviewed this product
          let reviewStatus = false;
          const findOrder = await OrderModel.findOne({
            productId: item._id,
            userId: item.userId,
            review: true
          });
          
          if (findOrder) {
            reviewStatus = true;
          }

          // Create the order with payment details
          await OrderModel.create({
            productId: item._id,
            userId: item.userId,
            size: item.size,
            color: item.color,
            quantities: item.quantity,
            address: session.customer_details?.address,
            review: reviewStatus,
            payment_intent: session.payment_intent,
            payment_status: session.payment_status,
            customer_details: session.customer_details,
            shipping_details: session.shipping_details,
            amount_total: session.amount_total,
            currency: session.currency,
            created: new Date()
          });

          // Update product stock with safety checks
          if (product && typeof item.quantity === 'number') {
            // Calculate new stock, ensure it doesn't go below 0
            let newStock = Math.max(0, product.stock - item.quantity);
            
            await ProductModel.findByIdAndUpdate(
              item._id,
              { stock: newStock },
              { new: true }
            );
          }
        }
        
        console.log('Order processing completed successfully');
        return response.json({ received: true, status: 'success' });
        
      } catch (error) {
        console.error('Order processing error:', error);
        return response.status(500).json({ 
          error: "Order processing failed",
          details: error.message 
        });
      }
    } else {
      console.log(`Unhandled event type ${event.type}`);
      // Return a 200 response for other event types
      return response.json({ received: true });
    }
  }
  async paymentVerify(req, res) {
    const { id } = req.params;
    try {
      // Verify session exists
      if (!id) {
        return res.status(400).json({
          error: "Session ID is required"
        });
      }

      // Retrieve session from Stripe
      const session = await stripe.checkout.sessions.retrieve(id);
      
      if (!session) {
        return res.status(404).json({ 
          error: "Session not found" 
        });
      }

      // Handle different payment statuses
      if (session.payment_status === 'paid') {
        // Return success response for paid status
        return res.status(200).json({
          msg: "Your payment has been verified successfully",
          status: session.payment_status,
          success: true
        });
      } else {
        return res.status(400).json({
          error: "Payment has not been completed",
          status: session.payment_status,
          success: false
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return res.status(500).json({
        error: "Payment verification failed",
        details: error.message
      });
    }
  }
}

module.exports = new PaymentController();
