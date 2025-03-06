import OrderModel from "../models/order.model.js";
import Razorpay from "razorpay";
import ProductModel from "../models/product.model.js";

//------------------COD Order Controller---------------------------
export const codOrderController = async (req, res) => {
  const userId = req.id;
  const { order } = req.body; // order is an array of objects containing productId and quantity

  try {
    if (!order || order.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please choose a product to make an order",
      });
    }

    // Fetch product details for all products in the order
    const productIds = order.map((item) => item.productId);
    const products = await ProductModel.find({ _id: { $in: productIds } });

    // Create order objects
    const userOrders = order.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      return {
        userId,
        productId: item.productId,
        productDetails: {
          title: product.title,
          price: product.price,
          discountPercentage: product.discountPercentage,
          thumbnail: product.thumbnail,
        },
        quantity: item.quantity,
        amount:
          item.quantity *
          (product.price - (product.discountPercentage * product.price) / 100),
        paymentMethod: "COD",
        paymentStatus: "pending",
        orderStatus: "pending",
        orderDate: new Date().toISOString(),
      };
    });

    // Insert orders into the database
    await OrderModel.insertMany(userOrders);

    res.status(200).json({
      success: true,
      message: "Order Placed",
    });
  } catch (err) {
    console.error("Error placing COD order:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//----------------------online payment controller------------------

// flow - create a razorpay  order -> pay amount on frontend-> verify payment -> create product order

// razorpay instance
const razorpayInstance = new Razorpay({
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
      amount: Math.floor(amount) * 100,
      currency: process.env.currency,
      receipt: `receipt_${Date.now()}`,
    };

    //  create order
    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("Razorpay Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//-----------------------Verify Payment & Place Order-------------
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const userId = req.id;
    const { razorpay_order_id, order } = req.body;

    if (!order || order.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please choose a product to make an order",
      });
    }

    // Razorpay
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      // Fetch product details for all products in the order
      const productIds = order.map((item) => item.productId);
      const products = await ProductModel.find({ _id: { $in: productIds } });

      // Create order objects
      const userOrders = order.map((item) => {
        const product = products.find(
          (p) => p._id.toString() === item.productId
        );
        return {
          userId,
          productId: item.productId,
          productDetails: {
            title: product.title,
            price: product.price,
            discountPercentage: product.discountPercentage,
            thumbnail: product.thumbnail,
          },
          quantity: item.quantity,
          amount:
            item.quantity *
            (product.price -
              (product.discountPercentage * product.price) / 100),
          paymentMethod: "Online",
          paymentStatus: "paid",
          orderStatus: "shipped",
          orderDate: new Date().toISOString(),
        };
      });

      // Insert orders into the database
      await OrderModel.insertMany(userOrders);

      return res.status(200).json({
        success: true,
        message: "Order Placed",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Payment failed",
    });
  } catch (err) {
    console.error("Payment Verification Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ----------------------get all orders---------------------------
export const getAllOrdersController = async (req, res) => {
  try {
    const userId = req.id;

    // Fetch all orders
    const orders = await OrderModel.find({ userId }).sort({orderDate:-1});

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// cancel order

export const cancelOrderController = async (req, res) => {
  const userId = req.id;
  const { id } = req.params;
  
  console.log("id:",id)

  try {
    const order = await OrderModel.findOneAndUpdate(
      { userId, _id: id },
      { $set: { orderStatus: "cancelled" } },
      { new: true } 
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order Cancelled",
      order, 
    });
  } catch (err) {
    console.error("Order Cancellation Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
