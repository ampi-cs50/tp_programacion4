/**
 * Helper to ensure product images always resolve to a working URL.
 * Prefers the local static catalog images in /products/ to avoid ActiveStorage token expiry.
 */
export function getProductImageUrl(item) {
  if (!item) return null;

  const url = item.image_url || item.image_file;
  if (!url) return null;

  // Already a local path
  if (url.startsWith('/products/')) {
    return url;
  }

  // ActiveStorage URL: extract the filename (e.g. .../align_leggings.jpg -> /products/align_leggings.jpg)
  if (url.includes('/rails/active_storage/') || url.includes('/blobs/')) {
    const match = url.match(/([a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|webp))$/i);
    if (match && match[1]) {
      return `/products/${match[1]}`;
    }
  }

  return url;
}
