import {
  useProducts as useProductsContext,
} from "@/features/products/context/ProductsContext";


export default function useProducts(){

  return useProductsContext();

}
