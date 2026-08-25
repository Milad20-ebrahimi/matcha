export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export type ProductBrand = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  isActive: boolean;

  category: ProductCategory | null;

  brand: ProductBrand | null;
};

export type GetProductsParams = {
  categoryId?: string;
  brandId?: string;
  search?: string;
  activeOnly?: boolean;
};

export type ProductsResponse = {
  success: boolean;
  data: Product[];
};

export type ProductResponse = {
  success: boolean;
  data: Product;
};  