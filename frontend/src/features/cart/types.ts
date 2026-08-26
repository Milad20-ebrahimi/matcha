export type CartProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image: string | null;
  isActive: boolean;
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  product: CartProduct;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
};