import Link from "next/link";

import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import Button from "@/components/ui/button";


export default function CafeSection() {
  return (
    <section className="bg-slate-50 py-20">

      <Container>

        <div className="grid items-center gap-12 md:grid-cols-2">

          <div className="order-2 md:order-1">

            <SectionTitle
              title="کافه MATCH--CAFE"
              description="فضایی آرام برای تجربه ماچا، قهوه و طعم‌های خاص"
            />


            <p className="mt-6 leading-8 text-slate-600">
              در کافه ما می‌توانید انواع نوشیدنی‌های دست‌ساز،
              محصولات پریمیوم و یک تجربه متفاوت را در محیطی
              مدرن و آرام تجربه کنید.
            </p>


            <div className="mt-8">
              <Link href="/reservation">
                <Button>
                  رزرو میز
                </Button>
              </Link>
            </div>

          </div>


          <div
            className="
              order-1
              flex
              h-[350px]
              items-center
              justify-center
              rounded-3xl
              bg-green-900
              md:order-2
            "
          >

            <span className="text-xl font-semibold text-white">
              Cafe Image
            </span>

          </div>

        </div>

      </Container>

    </section>
  );
}
