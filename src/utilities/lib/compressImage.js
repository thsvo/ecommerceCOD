import imageCompression from "browser-image-compression";

export const compressImage = async (file, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 2,
    maxWidthOrHeight: 3500,
    useWebWorker: true,
    initialQuality: 0.7,
    ...options,
  };

  try {
    const compressedBlob = await imageCompression(file, defaultOptions);

    const compressedFile = new File([compressedBlob], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });

    return compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);
    throw new Error("Image compression failed.");
  }
};
