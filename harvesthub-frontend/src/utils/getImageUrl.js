import { API_ORIGIN } from './constants.js';

export const PLACEHOLDER_IMAGE =
  'https://placehold.co/800x600/e6f7ec/14753f?text=HarvestHub';

export const getImageUrl = (image) => {
  if (!image) {
    return PLACEHOLDER_IMAGE;
  }

  if (typeof image !== 'string') {
    return PLACEHOLDER_IMAGE;
  }

  if (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('data:')
  ) {
    return image;
  }

  if (image.startsWith('/')) {
    return `${API_ORIGIN}${image}`;
  }

  return `${API_ORIGIN}/${image}`;
};

export default getImageUrl;