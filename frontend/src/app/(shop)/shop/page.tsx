import Container from "@/components/shared/Container";
import ProductCard from "@/components/product/Productcard";
import { getProducts } from "@/features/products/api";

export default async function ShopPage() {
  const response = await getProducts({
    activeOnly: true,
  });

  const products = response.data;

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 py-16">
      <Container>
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900">
            فروشگاه ماچا
          </h1>

          <p className="mt-4 max-w-2xl text-slate-600">
            محصولات و لوازم مورد نیاز برای تجربه بهتر ماچا، چای و قهوه
          </p>
        </header>

        {products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">
              محصولی برای نمایش وجود ندارد.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
