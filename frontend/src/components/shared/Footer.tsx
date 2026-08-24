import Link from "next/link";

import Container from "./Container";


const footerLinks = [
  {
    label: "خانه",
    href: "/",
  },
  {
    label: "فروشگاه",
    href: "/shop",
  },
  {
    label: "منو کافه",
    href: "/cafe",
  },
  {
    label: "تماس با ما",
    href: "/contact",
  },
];


export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-100 bg-slate-950 text-white">
      <Container>

        <div className="grid gap-10 py-12 md:grid-cols-3">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold">
              MATCH--CAFE
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              تجربه اصیل ماچا، قهوه و محصولات پریمیوم
              در کنار فضای آرام کافه.
            </p>
          </div>


          {/* Links */}
          <div>
            <h4 className="mb-4 font-semibold">
              دسترسی سریع
            </h4>

            <ul className="space-y-3">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-300 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold">
              ارتباط با ما
            </h4>

            <p className="text-sm text-slate-300">
              تهران، خیابان نمونه
            </p>

            <p className="mt-2 text-sm text-slate-300">
              info@matcha-cafe.com
            </p>
          </div>

        </div>


        <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-400">
          © 2026 MATCH--CAFE. تمامی حقوق محفوظ است.
        </div>

      </Container>
    </footer>
  );
}
