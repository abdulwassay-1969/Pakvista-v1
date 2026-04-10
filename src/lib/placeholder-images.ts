import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

export function getPlaceholderImage(id: string): ImagePlaceholder {
  const image = placeholderImages.find((img) => img.id === id);
  if (!image) {
    console.warn(`Image with id "${id}" not found.`);
    return {
      id: 'not-found',
      description: 'Image not found',
      imageUrl: 'https://picsum.photos/seed/notfound/1200/800',
      imageHint: 'placeholder',
    };
  }
  return image;
}

export const allPlaceholderImages = placeholderImages;
