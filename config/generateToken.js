import jwt from "jsonwebtoken";

const generateToken = async (id, res) => {
  try {
    const payload = { id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Cookie options
    const options = {
      httpOnly: true,
      sameSite: "strict",  
      secure: process.env.NODE_ENV === "production", 
      maxAge: 7 * 24 * 60 * 60 * 1000,  
    };

    // Set cookie
    res.cookie("token", token, options);

  } catch (err) {
    console.log("Error generating token:", err.message);
  }
};

export default generateToken;
