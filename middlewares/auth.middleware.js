import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    // Get JWT token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Decode token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Assign user id to req object
    req.id = decodedToken.id;
    next();
  } catch (err) {
    console.log("Auth Error:", err.message);
    return res.status(401).json({
      success: false,
      message:
        err.name === "JsonWebTokenError" || err.name === "TokenExpiredError"
          ? "Invalid or expired token"
          : "Authentication failed",
    });
  }
};

export default authMiddleware;
