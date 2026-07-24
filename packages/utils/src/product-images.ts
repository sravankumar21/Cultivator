import type { ProductCategory } from "@cultivator/types";

const categoryDefaultImages: Record<ProductCategory, string> = {
  seeds: "https://images.pexels.com/photos/18446086/pexels-photo-18446086.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  fertilizers: "https://images.pexels.com/photos/1251026/pexels-photo-1251026.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  pesticides: "https://images.pexels.com/photos/1204996/pexels-photo-1204996.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  crop_protection: "https://images.pexels.com/photos/5503291/pexels-photo-5503291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  farming_equipment: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  tools: "https://images.pexels.com/photos/296230/pexels-photo-296230.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  irrigation: "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  organic: "https://images.pexels.com/photos/4397028/pexels-photo-4397028.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  animal_feed: "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
};

export function getDefaultProductImage(category: ProductCategory): string {
  return categoryDefaultImages[category] || categoryDefaultImages.seeds;
}

export function getProductImage(imageUrl: string | undefined, category: ProductCategory): string {
  return imageUrl || getDefaultProductImage(category);
}
