import ProductModel from "../models/product.model.js";

// get all products based on filters
export const getProductsController = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, sort } = req.query;
    const limit = 20; // 20 products per page
    const skip = (page - 1) * limit;

    const filter = {};

    // Category filter
    if (category && category !== "all") filter.category = category;

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && !isNaN(minPrice)) filter.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(maxPrice)) filter.price.$lte = Number(maxPrice);
    }

    // Search filter 
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    const sortOption = sort === "desc" ? { price: -1 } : { price: 1 }; // Default to asc

    // Fetch products and total count
    const totalProducts = await ProductModel.countDocuments(filter);
    const products = await ProductModel.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page),
      totalProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};


// Get a single product by ID
export const getSingleProductController = async (req, res) => {
  const { id } = req.params; 

 console.log("id",id)

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Fetch product data
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product found",
      product, 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
