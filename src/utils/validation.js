
// Simple email validation without external dependencies
export const validateEmail = (email) => {
  if (!email) return false;
  
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase());
};

// Add other validation functions as needed
export const validatePhone = (phone) => {
  if (!phone) return false;
  
  // Basic phone validation (10+ digits)
  const phoneRegex = /^\d{10,}$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(cleaned);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

export const validateLength = (value, min, max) => {
  if (!value) return false;
  const length = value.length;
  return length >= min && length <= max;
};