import type { ReactNode } from "react";
import Link from "next/link";

import {
  Camera,
  Play,
  Send,
  MapPin,
  Phone,
  Clock,
  Leaf,
} from "lucide-react";

import Container from "./Container";


/* ------------------------------- عناصر کمکی ------------------------------ */


function SocialButton({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="
      group
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-full
      border
      border-[#f2e9d8]/15
      bg-white/[0.03]
      text-[#f2e9d8]/70
      backdrop-blur-md
      transition-all
      duration-500
      hover:-translate-y-1
      hover:border-[#d97706]/60
      hover:text-[#d97706]
      hover:shadow-[0_8px_24px_-8px_rgba(217,119,6,0.35)]
      "
    >
      {children}
    </a>
  );
}



function FooterLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="
        group
        inline-flex
        items-center
        gap-2
        text-sm
        font-light
        text-[#f2e9d8]/60
        transition-colors
        duration-300
        hover:text-[#d8e8bf]
        "
      >
        <span
          className="
          h-px
          w-0
          bg-[#d97706]
          transition-all
          duration-300
          group-hover:w-3
          "
        />

        <span
          className="
          transition-transform
          duration-300
          group-hover:-translate-x-1
          "
        >
          {children}
        </span>

      </Link>
    </li>
  );
}




function ColumnTitle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <h4
      className="
      mb-5
      text-sm
      font-medium
      tracking-[0.15em]
      text-[#cfe3b4]
      "
    >
      {children}
    </h4>
  );
}




function MapButton({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <a
      href="#"
      className="
      flex
      flex-1
      items-center
      justify-center
      rounded-full
      border
      border-[#f2e9d8]/15
      bg-white/[0.02]
      px-3
      py-2
      text-xs
      font-light
      text-[#f2e9d8]/70
      backdrop-blur-md
      transition-all
      duration-300
      hover:border-[#d97706]/60
      hover:bg-[#d97706]/10
      hover:text-[#f2e9d8]
      "
    >
      {children}
    </a>
  );
}
const cafeLinks = [
  {
    label: "داستان ما",
    href: "/about",
  },
  {
    label: "منوی کافه",
    href: "/menu",
  },
  {
    label: "رزرو میز",
    href: "/reservation",
  },
];


const shopLinks = [
  {
    label: "محصولات ماچا",
    href: "/shop",
  },
  {
    label: "قهوه و چای",
    href: "/shop",
  },
  {
    label: "ابزار دم‌آوری",
    href: "/shop",
  },
];



/* -------------------------------- Footer -------------------------------- */


export default function Footer() {

  return (

    <footer
      dir="rtl"
      className="
      relative
      overflow-hidden
      bg-[#142719]
      text-[#f2e9d8]
      "
    >


      {/* Background Pattern */}

      <div
        className="
        pointer-events-none
        absolute
        inset-0
        opacity-[0.05]
        "
      >

        <svg
          className="
          absolute
          -right-24
          -top-24
          h-[420px]
          w-[420px]
          "
          viewBox="0 0 200 200"
          fill="none"
        >

          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="#cfe3b4"
            strokeWidth="0.6"
          />

          <circle
            cx="100"
            cy="100"
            r="60"
            stroke="#cfe3b4"
            strokeWidth="0.6"
          />

        </svg>



        <svg
          className="
          absolute
          -bottom-32
          -left-24
          h-[450px]
          w-[450px]
          "
          viewBox="0 0 200 200"
          fill="none"
        >

          <path
            d="
            M100 20
            C55 50 30 120 80 180
            C150 140 160 70 100 20Z
            "
            stroke="#cfe3b4"
            strokeWidth="0.6"
          />

        </svg>


      </div>



      {/* Top Line */}

      <div
        className="
        absolute
        inset-x-0
        top-0
        h-px
        bg-gradient-to-r
        from-transparent
        via-[#d97706]/50
        to-transparent
        "
      />




      <Container>


        <div
          className="
          relative
          z-10
          grid
          gap-14
          py-20
          md:grid-cols-2
          lg:grid-cols-12
          "
        >


          {/* Brand */}

          <div
            className="
            lg:col-span-4
            "
          >


            <div
              className="
              flex
              items-center
              gap-3
              text-[#cfe3b4]
              "
            >

              <Leaf
                className="
                h-6
                w-6
                "
              />


              <span
                className="
                font-serif
                text-4xl
                font-light
                tracking-[0.25em]
                "
              >

                MATCH

              </span>


            </div>



            <p
              className="
              mt-3
              text-xs
              tracking-[0.2em]
              text-[#f2e9d8]/40
              "
            >
              Cafe & Matcha Experience
            </p>



            <p
              className="
              mt-7
              max-w-xs
              text-sm
              leading-8
              text-[#f2e9d8]/60
              "
            >
              تجربه‌ای اصیل از ماچا، قهوه تخصصی و لحظه‌هایی آرام
              در فضایی الهام‌گرفته از کافه‌های ژاپنی.
            </p>



            <div
              className="
              mt-8
              flex
              gap-3
              "
            >

              <SocialButton label="Instagram">

                <Camera />

              </SocialButton>



              <SocialButton label="Youtube">

                <Play />

              </SocialButton>



              <SocialButton label="Telegram">

                <Send size={18}/>

              </SocialButton>


            </div>


          </div>
                    {/* Cafe Links */}

          <div
            className="
            lg:col-span-2
            "
          >

            <ColumnTitle>
              کافه
            </ColumnTitle>


            <ul className="space-y-3.5">

              {
                cafeLinks.map((item)=>(
                  <FooterLink
                    key={item.href}
                    href={item.href}
                  >
                    {item.label}
                  </FooterLink>
                ))
              }

            </ul>


          </div>





          {/* Shop Links */}

          <div
            className="
            lg:col-span-2
            "
          >

            <ColumnTitle>
              فروشگاه
            </ColumnTitle>


            <ul className="space-y-3.5">


              {
                shopLinks.map((item)=>(
                  <FooterLink
                    key={item.label}
                    href={item.href}
                  >
                    {item.label}
                  </FooterLink>
                ))
              }


            </ul>


          </div>





          {/* Contact */}

          <div
            className="
            lg:col-span-2
            "
          >

            <ColumnTitle>
              ارتباط با ما
            </ColumnTitle>


            <ul
              className="
              space-y-4
              text-sm
              font-light
              text-[#f2e9d8]/60
              "
            >


              <li
                className="
                flex
                items-start
                gap-3
                "
              >

                <MapPin
                  className="
                  mt-1
                  h-4
                  w-4
                  text-[#d97706]
                  "
                />


                <span>
                  تهران، آدرس کافه MATCH--CAFE
                </span>


              </li>



              <li
                className="
                flex
                items-center
                gap-3
                "
              >

                <Phone
                  className="
                  h-4
                  w-4
                  text-[#d97706]
                  "
                />


                <span dir="ltr">
                  021-12345678
                </span>


              </li>



              <li
                className="
                flex
                items-center
                gap-3
                "
              >

                <Clock
                  className="
                  h-4
                  w-4
                  text-[#d97706]
                  "
                />


                <span>
                  هر روز ۸ صبح تا ۱۱ شب
                </span>


              </li>


            </ul>


          </div>





          {/* Location Card */}


          <div
            className="
            lg:col-span-2
            "
          >


            <div
              className="
              rounded-[28px]
              border
              border-[#f2e9d8]/10
              bg-white/[0.03]
              p-6
              backdrop-blur-lg
              transition-all
              duration-500
              hover:border-[#d97706]/40
              "
            >


              <div
                className="
                flex
                items-center
                gap-2
                text-[#cfe3b4]
                "
              >

                <MapPin
                  className="
                  h-4
                  w-4
                  "
                />


                <h4
                  className="
                  text-sm
                  "
                >
                  موقعیت کافه
                </h4>


              </div>




              <p
                className="
                mt-4
                text-xs
                leading-7
                text-[#f2e9d8]/55
                "
              >

                تهران، خیابان نمونه،
                کافه MATCH--CAFE

              </p>




              <div
                className="
                mt-5
                flex
                gap-2
                "
              >

                <MapButton>
                  Google Maps
                </MapButton>


              </div>



            </div>


          </div>


        </div>





        {/* Bottom */}


        <div
          className="
          relative
          z-10
          mt-10
          flex
          flex-col
          items-center
          gap-4
          border-t
          border-[#f2e9d8]/10
          py-8
          text-center
          sm:flex-row
          sm:justify-between
          "
        >


          <p
            className="
            text-xs
            text-[#f2e9d8]/40
            "
          >

            © تمامی حقوق برای MATCH--CAFE محفوظ است.

          </p>



          <p
            className="
            text-xs
            tracking-[0.15em]
            text-[#f2e9d8]/30
            "
          >

            MATCH--CAFE — Kyoto Inspired

          </p>


        </div>



      </Container>


    </footer>

  );

}
