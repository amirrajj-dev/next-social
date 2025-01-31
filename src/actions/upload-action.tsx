"use server";

import { uploadImageToCloudinary } from "@/utils/cloudinary/cloudinary";

export const uploadAction = async (
  file: File
): Promise<string | { message: string; success: boolean }> => {
  const MAX_SIZE_MB = 1 * 1_000_000;
  console.log('yes');
  if (file.size > MAX_SIZE_MB) {
    return {
      message: "File size is too large. Please upload a file less than 1MB.",
      success: false,
    };
  }
  // Convert the File object to a Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload the buffer to Cloudinary
  const uploadResult = await uploadImageToCloudinary(buffer, "post_images");
  return uploadResult.secure_url;
};
