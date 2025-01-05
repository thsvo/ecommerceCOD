export const generateInvoice = () => {
  const timestamp = Date.now();
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INV-${timestamp}-${randomChars}`;
};
