import { v2 as cloudinary } from "cloudinary";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (image) => {
  try {
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(image, {
      resource_type: "image",
    });

    console.log("Upload successful:", uploadResult.secure_url);
    return uploadResult.secure_url;
  } catch (err) {
    console.error("Image upload error:", err.message);
    throw new Error(err.message);
  }
};

export default uploadImage;
