import Link from "next/link";

import Container from "@/components/shared/Container";
import { getProductBySlug } from "@/features/products/api";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const response = await getProductBySlug(slug);
  const product = response.data;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 py-16"
    >
      <Container>
        <Link
          href="/shop"
          className="mb-8 inline-block text-sm text-slate-500 hover:text-slate-900"
        >
          ← بازگشت به فروشگاه
        </Link>

        <div className="grid gap-10 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
          <div className="flex min-h-[400px] items-center justify-center overflow-hidden rounded-2xl bg-green-900">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full max-h-[500px] w-full object-cover"
              />
            ) : (
              <span className="text-xl text-white">
                تصویر محصول
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {product.category && (
              <p className="mb-3 text-sm text-green-700">
                {product.category.name}
              </p>
            )}

            <h1 className="text-4xl font-bold text-slate-900">
              {product.name}
            </h1>

            {product.brand && (
              <p className="mt-3 text-slate-500">
                برند: {product.brand.name}
              </p>
            )}

            {product.description && (
              <p className="mt-6 leading-8 text-slate-600">
                {product.description}
              </p>
            )}

            <div className="mt-8">
              <span className="text-3xl font-bold text-slate-900">
                {product.price.toLocaleString("fa-IR")} تومان
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              موجودی:{" "}
              {product.stock.toLocaleString("fa-IR")}
            </p>

            <button
              type="button"
              disabled={product.stock <= 0}
              className="mt-8 w-full rounded-xl bg-green-900 px-6 py-4 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {product.stock > 0
                ? "افزودن به سبد"
                : "ناموجود"}
            </button>
          </div>
        </div>
      </Container>
    </main>
  );
}
