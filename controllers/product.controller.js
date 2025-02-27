import ProductModel from "../models/product.model.js";

// Get products
// filters-category, price filters, pagination, search, and sorting

export const getProductsController = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, sort } = req.query;
    const filter = {};
    const limit = 15; // Products per page
    const skip = (page - 1) * limit; // Skip products for pagination

    // Apply category filter
    if (category) {
      filter.category = category;
    }

    // Apply price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Apply search filter (for name suggestions)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Sorting logic
    let sortOption = {};
    if (sort === "asc") {
      sortOption.price = 1; // Sort by price low to high
    } else if (sort === "desc") {
      sortOption.price = -1; // Sort by price high to low
    }

    // Fetch filtered, sorted & paginated products
    const products = await ProductModel.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalProducts = await ProductModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
