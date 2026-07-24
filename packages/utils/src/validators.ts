export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return (
    cleaned.length === 10 ||
    (cleaned.length === 12 && cleaned.startsWith("91"))
  );
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}

export function validateRequired(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}
