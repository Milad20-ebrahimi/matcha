"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ShoppingBag,
  Menu,
  X,
  Leaf,
  User,
} from "lucide-react";


const navLinks = [
  {
    label: "خانه",
    href: "/",
  },
  {
    label: "منوی کافه",
    href: "/cafe",
  },
  {
    label: "فروشگاه",
    href: "/shop",
  },
  {
    label: "درباره ما",
    href: "/about",
  },
  {
    label: "تماس با ما",
    href: "/contact",
  },
];


export default function Navbar() {

  const [open, setOpen] = useState(false);


  return (

    <header
      className="
      fixed
      top-4
      left-4
      right-4
      z-50
      rounded-[3rem]
      border
      border-white/20
      bg-white/20
      backdrop-blur-xl
      shadow-xl
      "
    >

      <div
        className="
        mx-auto
        flex
        max-w-7xl
        items-center
        justify-between
        px-6
        py-3
        "
      >


        {/* Logo */}

        <Link
          href="/"
          className="
          flex
          items-center
          gap-3
          "
        >

          <div
            className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-forest
            text-white
            shadow-lg
            "
          >
            <Leaf size={22}/>
          </div>


          <div className="leading-tight">

            <h1
              className="
              font-serif
              text-xl
              font-bold
              text-forest
              "
            >
              MATCH--CAFE
            </h1>


            <p
              className="
              text-xs
              text-forest/60
              "
            >
              Cafe & Matcha Store
            </p>

          </div>


        </Link>



        {/* Desktop Menu */}

        <nav
          className="
          hidden
          items-center
          gap-8
          md:flex
          "
        >

          {
            navLinks.map((item)=>(
              <Link
                key={item.href}
                href={item.href}
                className="
                text-sm
                font-medium
                text-forest/80
                transition
                hover:text-amber
                "
              >
                {item.label}
              </Link>
            ))
          }


        </nav>



        {/* Actions */}

        <div
          className="
          flex
          items-center
          gap-3
          "
        >


          <Link
            href="/login"
            className="
            hidden
            h-11
            items-center
            justify-center
            rounded-full
            bg-amber
            px-4
            text-white
            md:flex
            "
          >

            <User size={18}/>

          </Link>



          <Link
            href="/cart"
            className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-forest
            text-white
            shadow-md
            transition
            hover:bg-amber
            "
          >

            <ShoppingBag size={20}/>

          </Link>



          <button
            onClick={()=>setOpen(!open)}
            className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-white
            text-forest
            md:hidden
            "
          >

            {
              open
              ?
              <X/>
              :
              <Menu/>
            }

          </button>


        </div>


      </div>



      {/* Mobile */}

      {
        open && (

          <nav
            className="
            flex
            flex-col
            gap-2
            rounded-b-[3rem]
            bg-cream
            px-5
            py-4
            md:hidden
            "
          >

            {
