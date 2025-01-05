import { base_url_image } from "../configs/base_api";

export const formatImagePath = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") {
    return undefined;
  }

  const sanitizedPath = encodeURIComponent(imagePath.trim()).replace(
    /%2F/g,
    "/"
  );

  return `${base_url_image}${sanitizedPath}`;
};
