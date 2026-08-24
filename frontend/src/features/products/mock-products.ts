import type { Product } from "@/types/product";


export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Japanese Matcha",
    slug: "premium-japanese-matcha",
    price: 850000,
    rating: 5,
    image: "/images/matcha.jpg",
    category: "Matcha",
  },

  {
    id: "2",
    name: "Specialty Coffee Beans",
    slug: "specialty-coffee-beans",
    price: 650000,
    rating: 4.8,
    image: "/images/coffee.jpg",
    category: "Coffee",
  },

  {
    id: "3",
    name: "Organic Green Tea",
    slug: "organic-green-tea",
    price: 420000,
    rating: 4.7,
    image: "/images/tea.jpg",
    category: "Tea",
  },

  {
    id: "4",
    name: "Matcha Whisk Set",
    slug: "matcha-whisk-set",
    price: 380000,
    rating: 4.9,
    image: "/images/tools.jpg",
    category: "Accessories",
  },
];
