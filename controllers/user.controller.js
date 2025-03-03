import UserModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js";
import generateToken from "../config/generateToken.js";
import bcrypt from "bcryptjs";
import uploadImage from "../config/cloudinaryConfig.js";

// ---------------Register Controller--------------
export const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const isEmailExists = await UserModel.findOne({ email });
    if (isEmailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // update last login
    const date = new Date();
    const lastLoginDate = date.toLocaleDateString();

    await UserModel.findByIdAndUpdate(newUser._id, {
      $set: { lastLoginDate: lastLoginDate },
    });

    // Generate JWT Token
    await generateToken(newUser._id, res);

    // Send response
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      },
    });
  } catch (err) {
    console.error("Error in registration:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ---------------------Login controller--------------
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check for email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Get user
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found , check your email",
      });
    }

    // Match password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Password didn't match",
      });
    }

    // update last login
    const date = new Date();
    const lastLoginDate = date.toLocaleDateString();

    await UserModel.findByIdAndUpdate(user._id, {
      $set: { lastLoginDate: lastLoginDate },
    });

    // Generate token and set in cookie
    await generateToken(user._id, res);

    // Return user data (excluding password)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.log("Error in login:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// -------------------Logout Controller--------------
export const logoutController = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Logout Successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// --------------------get user information----------------

export const getUserDataController = async (req, res) => {
  const userId = req.id;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User data not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data found",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// -------------------update avatar and name-----------------------

export const updateUserInfoController = async (req, res) => {
  const userId = req.id;
  const { name } = req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
    if (!imagePath && !name) {
      return res.status(400).json({
        success: false,
        message: "No data provided for update",
      });
    }

    let updateData = {};

    // Upload image if provided
    if (imagePath) {
      const responseUrl = await uploadImage(imagePath);
      updateData.avatar = responseUrl;
    }

    // Update name if provided
    if (name) {
      updateData.name = name;
    }

    console.log("Update Data to be saved:", updateData);

    // Update user data
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data updated successfully",
    });
  } catch (err) {
    console.error("Update error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ------------------Add address --------------------------------

export const addUserAddressController = async (req, res) => {
  const userId = req.id;
  const { fullAddress, city, state, country, mobile, zipCode } = req.body;

  try {
    if (!fullAddress || !city || !state || !country || !mobile || !zipCode) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required",
      });
    }

    // Check if user already has an address
    const existingAddress = await AddressModel.findOne({ userId });

    if (existingAddress) {
      return res.status(400).json({
        success: false,
        message: "Address already exists. Please update it instead.",
      });
    }

    const newAddress = await AddressModel.create({
      userId,
      fullAddress,
      city,
      state,
      country,
      mobile,
      zipCode,
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      newAddress,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// update addresss

export const updateUserAddressController = async (req, res) => {
  const userId = req.id;

  try {
    const updatedAddress = await AddressModel.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      updatedAddress,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//get address
export const getAddressesController = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await AddressModel.find({ userId });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

//delete address
export const deleteAddressController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const address = await AddressModel.findOne({ _id: id, userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Delete the address
    await AddressModel.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};
