import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import ProductCard from "@/components/product/Productcard";

import {
  getProducts,
} from "@/features/products/api";

export default async function FeaturedProducts() {
  const response =
    await getProducts({
      activeOnly: true,
    });

  const products =
    response.data.slice(0, 4);

  return (
    <section className="py-20">
      <Container>
        <SectionTitle
          title="محصولات منتخب"
          description="بهترین انتخاب‌ها از فروشگاه MATCHA CAFE"
        />

        {products.length === 0 ? (
          <p className="text-center text-slate-500">
            محصولی برای نمایش وجود ندارد.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}