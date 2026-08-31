
import Image from "next/image";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Container from "@/components/shared/Container";

export default function AboutPage() {
  const team = [
    {
      name: "علی رضایی",
      role: "باریستا",
      image: "/images/about/team-1.jpg",
    },
    {
      name: "سارا احمدی",
      role: "مدیر کافه",
      image: "/images/about/team-2.jpg",
    },
    {
      name: "امیر کاظمی",
      role: "باریستا",
      image: "/images/about/team-3.jpg",
    },
    {
      name: "مینا محمدی",
      role: "شف و توسعه منو",
      image: "/images/about/team-4.jpg",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream text-forest">
        {/* ================================================================ */}
        {/* Hero                                                              */}
        {/* ================================================================ */}

        <section className="relative h-[65vh] min-h-[520px] w-full overflow-hidden">
          <Image
            src="/images/about/hero.jpg"
            alt="کافه ماچا"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-forest/35" />

          <div className="absolute inset-0 flex items-center justify-center px-6 pt-20">
            <div className="max-w-3xl text-center text-white">
              <p className="mb-5 text-xs font-medium tracking-[0.35em] md:text-sm">
                MATCHA & COFFEE EXPERIENCE
              </p>

              <h1 className="font-serif text-5xl font-bold leading-tight md:text-7xl">
                کافه ماچا
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-white/85 md:text-base">
                جایی برای آرام گرفتن، نوشیدن یک فنجان خوب و ساختن
                لحظه‌هایی که ارزش به خاطر سپردن دارند.
              </p>
            </div>
          </div>
        </section>

{/* ================================================================ */}
{/* Story                                                             */}
{/* ================================================================ */}

<section className="bg-cream px-6 py-12 md:min-h-[calc(100vh-96px)] md:py-16">
  <Container>
    <div className="grid items-center gap-10 md:min-h-[calc(100vh-160px)] md:grid-cols-2 md:gap-16">

      {/* Image */}

      <div className="relative h-[360px] overflow-hidden rounded-[2rem] bg-cream-dark md:h-[65vh] md:max-h-[560px]">
        <Image
          src="/images/about/story.jpg"
          alt="داستان کافه ماچا"
          fill
          className="object-cover transition duration-700 hover:scale-105"
        />
      </div>

      {/* Text */}

      <div className="flex flex-col justify-center text-right">
        <span className="text-sm font-medium tracking-[0.2em] text-amber">
          OUR STORY
        </span>

        <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-forest md:text-5xl">
          داستان ما
        </h2>

        <div className="mt-5 space-y-3 text-sm leading-8 text-forest/65 md:text-base md:leading-8">
          <p>
            کافه ماچا با یک ایده ساده شکل گرفت؛ ساختن فضایی آرام و
            دوست‌داشتنی برای آدم‌هایی که می‌خواهند چند لحظه از
            شلوغی روز فاصله بگیرند.
          </p>

          <p>
            ما به ماچا، قهوه و جزئیات کوچک اهمیت می‌دهیم؛ از انتخاب
            مواد اولیه تا نحوه آماده‌سازی و تجربه‌ای که برای شما
            می‌سازیم.
          </p>

          <p>
            هدف ما فقط سرو یک نوشیدنی نیست؛ می‌خواهیم هر سفارش،
            شروع یک لحظه خوب باشد.
          </p>
        </div>
      </div>
    </div>
  </Container>
</section>


{/* ================================================================ */}
{/* Vision                                                            */}
{/* ================================================================ */}

<section className="bg-cream-dark px-6 py-12 md:min-h-[calc(100vh-96px)] md:py-16">
  <Container>
    <div className="grid items-center gap-10 md:min-h-[calc(100vh-160px)] md:grid-cols-2 md:gap-16">

      {/* Text */}

      <div className="order-2 flex flex-col justify-center text-right md:order-1">
        <span className="text-sm font-medium tracking-[0.2em] text-amber">
          OUR VISION
        </span>

        <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-forest md:text-5xl">
          هر فنجان، یک لحظه
        </h2>

        <div className="mt-5 space-y-3 text-sm leading-8 text-forest/65 md:text-base md:leading-8">
          <p>
            برای ما تجربه از محصول شروع نمی‌شود. فضا، خلق‌وخوی تیم
            و توجه به جزئیات، همه بخشی از تجربه کافه ما هستند.
          </p>

          <p>
            می‌خواهیم مکانی باشیم که بتوانید در آن آرام باشید،
            گفت‌وگو کنید و از نوشیدنی مورد علاقه‌تان لذت ببرید.
          </p>
        </div>

        <a
          href="/shop"
          className="
            mt-6
            inline-flex
            w-fit
            items-center
            rounded-full
            bg-forest
            px-6
            py-2.5
            text-sm
            font-medium
            text-white
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-forest-light
            hover:shadow-lg
          "
        >
          مشاهده محصولات
        </a>
      </div>

      {/* Image */}

      <div className="relative order-1 h-[360px] overflow-hidden rounded-[2rem] bg-cream md:order-2 md:h-[65vh] md:max-h-[560px]">
        <Image
          src="/images/about/mission.jpg"
          alt="تجربه کافه ماچا"
          fill
          className="object-cover transition duration-700 hover:scale-105"
        />
      </div>
    </div>
  </Container>
</section>


        {/* ================================================================ */}
        {/* Team                                                              */}
        {/* ================================================================ */}

        <section className="bg-cream px-6 py-20 md:py-28">
          <Container>
            <div className="text-center">
              <span className="text-sm font-medium tracking-[0.2em] text-amber">
                OUR TEAM
              </span>

              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-forest md:text-5xl">
                آدم‌هایی که پشت این تجربه هستند
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-forest/60 md:text-lg">
                تیم ما با عشق و توجه به جزئیات تلاش می‌کند هر بار تجربه‌ای
                خوب و به‌یادماندنی برای شما بسازد.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-12">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="group text-center"
                >
                  <div
                    className="
                      relative
                      mx-auto
                      aspect-square
                      w-32
                      overflow-hidden
                      rounded-full
                      border-4
                      border-cream-dark
                      bg-cream-dark
                      shadow-sm
                      transition-all
                      duration-500
                      group-hover:-translate-y-2
                      group-hover:border-sage
                      group-hover:shadow-xl
                      sm:w-36
                      md:w-44
                    "
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="mt-6 font-serif text-lg font-bold text-forest md:text-xl">
                    {member.name}
                  </h3>

                  <p className="mt-2 text-sm text-forest/50">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
