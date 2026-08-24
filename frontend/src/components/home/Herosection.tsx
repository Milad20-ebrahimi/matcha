import Image from "next/image";
import Link from "next/link";

import Container from "@/components/shared/Container";


export default function HeroSection() {
  return (
    <section
      className="
      relative
      overflow-hidden
      bg-cream
      pt-32
      pb-20
      "
    >

      <Container>

        <div
          className="
          grid
          items-center
          gap-12
          md:grid-cols-2
          "
        >


          {/* Content */}

          <div
            className="
            text-right
            "
          >

            <span
              className="
              mb-5
              inline-block
              rounded-full
              bg-sage/30
              px-5
              py-2
              text-sm
              font-medium
              text-forest
              "
            >
              MATCH--CAFE
            </span>


            <h1
              className="
              font-serif
              text-4xl
              font-bold
              leading-[1.5]
              text-forest
              md:text-6xl
              "
            >
              تجربه اصیل ماچا
              <br />
              در خانه شما
            </h1>


            <p
              className="
              mt-6
              max-w-xl
              text-base
              leading-8
              text-forest/70
              "
            >
              بهترین ماچا، قهوه، چای و محصولات پریمیوم
              را با کیفیت کافه‌ای در خانه خود تجربه کنید.
            </p>


            <div
              className="
              mt-8
              flex
              flex-wrap
              gap-4
              "
            >

              <Link
                href="/shop"
                className="
                rounded-full
                bg-amber
                px-7
                py-3.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-amber-dark
                "
              >
                مشاهده محصولات
              </Link>


              <Link
                href="/cafe"
                className="
                rounded-full
                border
                border-forest/20
                px-7
                py-3.5
                text-sm
                font-medium
                text-forest
                transition
                hover:bg-white
                "
              >
                منوی کافه
              </Link>


            </div>


          </div>



          {/* Image */}

          <div
            className="
            relative
            h-[420px]
            overflow-hidden
            rounded-[3rem]
            bg-sage/20
            "
          >

            <Image
              src="/images/matcha-hero.jpg"
              alt="Matcha Cafe"
              fill
              priority
              className="
              object-cover
              "
            />


          </div>


        </div>

      </Container>


    </section>
  );
}
