import Link from "next/link";

import Container from "@/components/shared/Container";
import Button from "@/components/ui/button";


export default function HeroSection() {
  return (
    <section className="overflow-hidden bg-white py-20">

      <Container>

        <div className="grid items-center gap-12 md:grid-cols-2">

          {/* Content */}
          <div className="text-right">

            <p className="mb-4 text-sm font-medium text-green-700">
              MATCHA CAFE
            </p>

            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
              تجربه اصیل ماچا
              <br />
              در خانه شما
            </h1>


            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
              بهترین ماچا، قهوه و محصولات پریمیوم را با کیفیت کافه‌ای
              در خانه خود تجربه کنید.
            </p>


            <div className="mt-8 flex gap-4">

              <Link href="/shop">
                <Button>
                  مشاهده محصولات
                </Button>
              </Link>


              <Link
                href="/cafe"
                className="
                  rounded-md
                  border
                  border-slate-300
                  px-6
                  py-3
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                مشاهده کافه
              </Link>

            </div>

          </div>


          {/* Image Placeholder */}
          <div
            className="
              flex
              h-[420px]
              items-center
              justify-center
              rounded-3xl
              bg-green-900
            "
          >

            <span className="text-xl font-semibold text-white">
              Matcha Product Image
            </span>

          </div>


        </div>

      </Container>

    </section>
  );
}
