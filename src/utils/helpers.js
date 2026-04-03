// Helper module for common visual formatting

/**
 * Converts a raw number to Rupee currency format
 */
export const toRupeeFormat = (val) => {
  const parsedValue = Number(val);
  return `₹${parsedValue.toFixed(2)}`;
};

/**
 * Transforms standard dates into readable format
 */
export const getDisplayDate = (isoDate) => {
  const dateObj = new Date(isoDate);
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
