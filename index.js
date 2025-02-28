import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectDb from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import wishListRouter from "./routes/wishlist.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.get("/", (req, res) => res.send("Hello World!"));

//user API
app.use("/api/user", userRouter);
// product API
app.use("/api/products", productRouter);
// cart api
app.use("/api/cart", cartRouter);
// wishlist api
app.use("/api/wishlist", wishListRouter);

// Start server
async function startServer() {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Problem in starting server:", err.message);
  }
}

startServer();
