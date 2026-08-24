import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import ProductCard from "@/components/product/Productcard";

import { mockProducts } from "@/features/products/mock-products";


export default function FeaturedProducts() {
  return (
    <section className="py-20">

      <Container>

        <SectionTitle
          title="محصولات منتخب"
          description="بهترین انتخاب‌ها از فروشگاه MATCH--CAFE"
        />


        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {mockProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      </Container>

    </section>
  );
}
