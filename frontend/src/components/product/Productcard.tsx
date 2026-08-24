import type { Product } from "@/types/product";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";


interface ProductCardProps {
  product: Product;
}


export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <Card>

      <div className="flex h-48 items-center justify-center rounded-xl bg-green-900">
        <span className="text-white">
          Product Image
        </span>
      </div>


      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        {product.name}
      </h3>


      <div className="mt-3 flex items-center justify-between">

        <span className="font-bold text-slate-900">
          {product.price.toLocaleString()} تومان
        </span>


        <span className="text-sm text-yellow-500">
          ★ {product.rating}
        </span>

      </div>


      <Button className="mt-5 w-full">
        افزودن به سبد
      </Button>

    </Card>
  );
}
