import Image from "next/image";
import Link from "next/link";
import { Clock3 } from "lucide-react";

import Container from "@/components/shared/Container";

export default function AboutSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">

          {/* Image */}
          <div className="relative h-[380px] overflow-hidden rounded-[2.5rem] shadow-2xl sm:h-[430px] lg:h-[500px]">
            <Image
              src="/images/matcha-hero.jpg"
              alt="کافه ماچا"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="text-right">

            <span className="text-sm font-semibold tracking-[4px] text-amber">
              درباره ما
            </span>

            <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.5] text-forest sm:text-5xl">
              داستان کافه ماچا
              <br />
              از عشق به چای شروع شد
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-forest/70">
              ما در کافه ماچا تلاش میکنیم تجربهای متفاوت از ماچا
              نوشیدنیهای اصیل قهوه تخصصی و فضای آرام کافهای را برای
              شما فراهم کنیم.
            </p>

            <p className="mt-4 max-w-xl leading-8 text-forest/70">
              محصولات ما با دقت انتخاب میشوند تا کیفیت واقعی را در هر
              فنجان تجربه کنید.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3 text-forest/70">
              <span>هر روز ۸ صبح تا ۱۰ شب</span>
              <Clock3 className="h-5 w-5 text-amber" />
            </div>

            <Link
              href="/about"
              className="mt-7 inline-block rounded-full bg-forest px-8 py-3.5 font-semibold text-white transition hover:bg-forest/90"
            >
              داستان ما را بخوانید
            </Link>

          </div>
        </div>
      </Container>
    </section>
  );
}
