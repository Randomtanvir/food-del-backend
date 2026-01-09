import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageInCloudinary = async (
  reqFile,
  folderName = "AI-Assistant"
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderName, // Save image inside folder >t
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    stream.end(reqFile.buffer); // MemoryStorage buffer >t
  });
};

export default cloudinary;
