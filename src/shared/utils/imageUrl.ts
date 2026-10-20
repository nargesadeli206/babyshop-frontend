const BASE_URL = (import.meta.env.VITE_API_URL || 'https://localhost:7168/api').replace('/api', '');

export function getImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) {
    return 'https://placekitten.com/300/300';
  }
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  return `${BASE_URL}${imageUrl}`;
}