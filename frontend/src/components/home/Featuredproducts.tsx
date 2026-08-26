
"use client";

import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import ProductCard from "@/components/product/Productcard";
import Reveal from "@/components/shared/Reveal";
import useProducts from "@/features/products/hooks/useProducts";
import type { Product } from "@/features/products/types";

export default function FeaturedProducts() {

  const {
    products,
  } = useProducts();


  return (

    <section
      className="
      bg-[#f8f5ed]
      py-16
      md:py-20
      "
    >

      <Container>


        <SectionTitle
          title="محصولات منتخب"
        />



        <div
          className="
          mt-8
          grid
          gap-5
          sm:grid-cols-2
          lg:grid-cols-4
          "
        >


          {
            products.slice(0,4).map((product,index)=>(

              <Reveal
                key={product.id}
                delay={index * 0.08}
              >

                <ProductCard
                  product={product}
                />

              </Reveal>

            ))
          }


        </div>


      </Container>


    </section>

  );

}
