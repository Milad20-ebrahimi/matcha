"use client";

import Link from "next/link";
import {
usePathname,
useRouter,
} from "next/navigation";

import {
useAuthContext,
} from "@/features/auth/auth.context";

const menuItems = [
{
href: "/account",
label: "پروفایل",
},
{
href: "/account/addresses",
label: "آدرس‌های من",
},
{
href: "/account/orders",
label: "سفارش‌های من",
},
{
href: "/account/messages",
label: "پیام‌ها",
},
{
href: "/account/wishlist",
label: "علاقه‌مندی‌ها",
},
{
href: "/account/reviews",
label: "نظرات من",
},
{
href: "/account/photos",
label: "تصاویر من",
},
];

export default function AccountLayout({
children,
}: {
children: React.ReactNode;
}) {
const pathname =
usePathname();

const router =
useRouter();

const {
user,
logout,
} = useAuthContext();

async function handleLogout() {
await logout();

router.replace("/login");

}

return (
<main
dir="rtl"
style={{
minHeight: "100vh",
background: "#f7f7f5",
padding: "40px 20px",
}}
>
<div
style={{
width: "100%",
maxWidth: "1200px",
margin: "0 auto",
}}
>
<header
style={{
marginBottom: "24px",
}}
>
<h1
style={{
margin: 0,
fontSize: "32px",
}}
>
حساب کاربری </h1>

      <p
        style={{
          marginTop: "8px",
          color: "#666",
        }}
      >
        {user?.firstName
          ? `سلام ${user.firstName}، خوش آمدید`
          : "مدیریت حساب کاربری شما"}
      </p>
    </header>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "260px minmax(0, 1fr)",
        gap: "24px",
        alignItems: "start",
      }}
    >
      <aside
        style={{
          background: "#fff",
          border:
            "1px solid #e5e5e5",
          borderRadius: "20px",
          padding: "12px",
          position: "sticky",
          top: "24px",
        }}
      >
        <nav>
          {menuItems.map(
            (item) => {
              const isActive =
                item.href ===
                  "/account"
                  ? pathname ===
                    "/account"
                  : pathname.startsWith(
                      item.href
                    );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display:
                      "block",
                    padding:
                      "14px 16px",
                    marginBottom:
                      "4px",
                    borderRadius:
                      "12px",
                    textDecoration:
                      "none",
                    color:
                      isActive
                        ? "#111"
                        : "#555",
                    background:
                      isActive
                        ? "#f0f0ec"
                        : "transparent",
                    fontWeight:
                      isActive
                        ? 700
                        : 400,
                  }}
                >
                  {item.label}
                </Link>
              );
            }
          )}
        </nav>

        <div
          style={{
            height: "1px",
            background:
              "#eeeeee",
            margin:
              "12px 4px",
          }}
        />

        <button
          type="button"
          onClick={
            handleLogout
          }
          style={{
            width: "100%",
            border: "none",
            background:
              "transparent",
            padding:
              "14px 16px",
            borderRadius:
              "12px",
            textAlign:
              "right",
            cursor:
              "pointer",
            color:
              "#b42318",
            fontSize:
              "15px",
          }}
        >
          خروج از حساب
        </button>
      </aside>

      <section
        style={{
          minWidth: 0,
          background: "#fff",
          border:
            "1px solid #e5e5e5",
          borderRadius: "20px",
          padding: "28px",
        }}
      >
        {children}
      </section>
    </div>
  </div>
</main>

);
}
