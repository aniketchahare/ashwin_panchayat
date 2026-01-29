/**
 * Get full image URL from backend
 * @param {String} imageUrl - Relative URL from backend (e.g., /uploads/filename.jpg)
 * @returns {String} - Full URL to the image
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Get backend base URL (remove /api suffix if present)
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const backendUrl = apiUrl.replace('/api', '');
  
  // Ensure imageUrl starts with /
  const cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  
  return `${backendUrl}${cleanUrl}`;
};

