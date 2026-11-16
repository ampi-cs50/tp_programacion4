/**
 * Helper to ensure product images always resolve to a working URL.
 * Prefers the local static catalog images in /products/ to avoid ActiveStorage token expiry,
 * and supports per-color image switching when a color is selected.
 */

const COLOR_IMAGE_MAP = [
  {
    match: 'shoulder bag',
    defaultImage: '/products/shoulder_bag.jpg',
    colors: {
      'negro': '/products/shoulder_bag.jpg',
      'blanco hueso': '/products/shoulder_bag_white.jpg',
      'rosa lila': '/products/shoulder_bag_pink.jpg',
    }
  },
  {
    match: 'golf short',
    defaultImage: '/products/golf_short.jpg',
    colors: {
      'verde esmeralda': '/products/golf_short.jpg',
      'arena beige': '/products/golf_short_beige.jpg',
      'gris pizarra': '/products/golf_short_grey.jpg',
    }
  },
  {
    match: 'wide-leg pant',
    defaultImage: '/products/wide_leg_pant.jpg',
    colors: {
      'visón taupe': '/products/wide_leg_pant.jpg',
      'verde esmeralda': '/products/wide_leg_pant_green.jpg',
      'borgoña ciruela': '/products/wide_leg_pant_burgundy.jpg',
    }
  },
  {
    match: 'runner visor',
    defaultImage: '/products/runner_visor.jpg',
    colors: {
      'negro': '/products/runner_visor.jpg',
      'blanco': '/products/runner_visor_white.jpg',
      'blanco hueso': '/products/runner_visor_white.jpg',
      'celeste pastel': '/products/runner_visor_blue.jpg',
    }
  },
  {
    match: 'claw hair clip',
    defaultImage: '/products/claw_clip.jpg',
    colors: {
      'carey ámbar': '/products/claw_clip.jpg',
      'rosa cuarzo': '/products/claw_clip_pink.jpg',
      'nacarado marfil': '/products/claw_clip_pearl.jpg',
    }
  }
];

const NAME_FALLBACK_MAP = [
  { match: 'align™ tiro alto', image: '/products/align_leggings.jpg' },
  { match: 'energy bra', image: '/products/energy_bra.jpg' },
  { match: 'define jacket', image: '/products/define_jacket.jpg' },
  { match: 'biker short', image: '/products/biker_shorts.jpg' },
  { match: 'abc™', image: '/products/abc_jogger.jpg' },
  { match: 'metal vent', image: '/products/metal_vent_tee.jpg' },
  { match: 'pace breaker', image: '/products/pace_breaker_shorts.jpg' },
  { match: 'city sweat', image: '/products/city_sweat_hoodie.jpg' },
  { match: 'the mat', image: '/products/yoga_mat.jpg' },
  { match: 'belt bag', image: '/products/belt_bag.jpg' },
  { match: 'back to life', image: '/products/water_bottle.jpg' },
];

export function getProductImageUrl(item, selectedColor = '') {
  if (!item) return null;

  const itemName = (item.name || '').toLowerCase();
  const colorKey = (selectedColor || '').toLowerCase().trim();

  for (const entry of COLOR_IMAGE_MAP) {
    if (itemName.includes(entry.match)) {
      if (colorKey && entry.colors[colorKey]) {
        return entry.colors[colorKey];
      }
      // If item is a cart item with color in its name (e.g. "Product - Color / Size")
      for (const [cName, cImg] of Object.entries(entry.colors)) {
        if (itemName.includes(`- ${cName}`)) {
          return cImg;
        }
      }
      return entry.defaultImage;
    }
  }

  const url = item.image_url || item.image_file;
  if (url) {
    if (url.startsWith('/products/')) {
      return url;
    }
    if (!url.includes('/') && /\.(jpg|jpeg|png|webp)$/i.test(url)) {
      return `/products/${url}`;
    }
    if (url.includes('/rails/active_storage/') || url.includes('/blobs/')) {
      const match = url.match(/([a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|webp))$/i);
      if (match && match[1]) {
        return `/products/${match[1]}`;
      }
    }
    return url;
  }

  for (const entry of NAME_FALLBACK_MAP) {
    if (itemName.includes(entry.match)) {
      return entry.image;
    }
  }

  return null;
}
