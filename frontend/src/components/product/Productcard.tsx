import type {
  Product,
} from "@/features/products/types";

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
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          <span className="text-white">
            تصویر محصول
          </span>
        )}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        {product.name}
      </h3>

      {product.category && (
        <p className="mt-2 text-sm text-slate-500">
          {product.category.name}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="font-bold text-slate-900">
          {product.price.toLocaleString()} تومان
        </span>

        <span className="text-sm text-slate-500">
          موجودی: {product.stock}
        </span>
      </div>

      <Button className="mt-5 w-full">
        افزودن به سبد
      </Button>
    </Card>
  );
}