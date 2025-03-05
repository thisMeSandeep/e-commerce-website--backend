import OrderModel from "../models/order.model.js";
import Razorpay from "razorpay";

//------------------COD order controller---------------------------
export const codOrderController = async (req, res) => {
    const userId = req.id;
    const { product, amount, cartItems } = req.body;
  
    try {
      if (!product && !cartItems) {
        return res.status(400).json({
          success: false,
          message: "All details are required",
        });
      }
  
      let products = [];
  
      if (cartItems) {
        // User is ordering all cart items
        products = cartItems.map((item) => ({
          productId: item.productId,
          title: item.title,
          thumbnail: item.thumbnail,
          price: item.price,
          quantity: item.quantity, 
        }));
      } else {
        // User is ordering a single product
        products.push({
          productId: product.productId,
          title: product.title,
          thumbnail: product.thumbnail,
          price: product.price,
          quantity: product.quantity, 
        });
      }
  
      // Check if the user already has a pending COD order
      const existingOrder = await OrderModel.findOne({
        userId,
        paymentStatus: "pending",
      });
  
      if (existingOrder) {
        // Update existing order
        existingOrder.products.push(...products);
        existingOrder.amount += amount;
        await existingOrder.save();
      } else {
        // Create a new order 
        await OrderModel.create({
          userId,
          products,
          amount,
          paymentMethod: "COD",
          paymentStatus: "pending",
          orderDate: new Date().toISOString(),
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Order Placed",
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  
//----------------------online payment controller------------------

// flow - create a razorpay  order ->pay amount on frontend->verify payment ->create product order

// razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.kEY_SECRET,
});

// ----------------------create order----------------------------
export const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;

  try {
    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "Amount is required" });
    }

    // razorpay options
    const options = {
      amount: amount * 100,
      currency: process.env.currency,
      receipt: `receipt_${Date.now()}`,
    };

    //  create order
    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Razorpay Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//-----------------------Verify Payment & Place Order-------------
export const verifyPaymentAndPlaceOrder = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    product,
    quantity,
    amount,
  } = req.body;

  try {
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !product ||
      !quantity ||
      !amount
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All details are required" });
    }

    // Verify payment signature
    const hmac = crypto.createHmac("sha256", process.env.KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    // Payment is successful, create an order in DB
    await OrderModel.create({
      userId: req.id,
      products: [
        {
          productId: product.productId,
          title: product.title,
          thumbnail: product.thumbnail,
          price: product.price,
          quantity: quantity,
        },
      ],
      amount: amount,
      paymentMethod: "Online",
      paymentStatus: "paid",
      orderStatus: "pending",
      orderDate: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified & order placed",
    });
  } catch (err) {
    console.error("Payment Verification Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
