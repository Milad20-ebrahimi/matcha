import Container from "@/components/shared/Container";

export default function CafeHero() {
  return (
    <section className="relative overflow-hidden bg-forest py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center" dir="rtl">
          <span className="text-sm font-semibold tracking-[5px] text-amber">
            CAFE MENU
          </span>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.4] text-white sm:text-5xl lg:text-6xl">
            منوی کافه ماچا
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            مجموعه‌ای از نوشیدنی‌های ماچا، قهوه، چای و خوراکی‌های
            منتخب برای یک تجربه آرام و متفاوت.
          </p>
        </div>
      </Container>
    </section>
  );
}
