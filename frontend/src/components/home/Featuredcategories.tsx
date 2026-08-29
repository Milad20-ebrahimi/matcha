"use client";

import Image from "next/image";
import Link from "next/link";

import Container from "@/components/shared/Container";
import Reveal from "@/components/shared/Reveal";


const categories = [

  {
    title: "Coffee Beans",
    subtitle: "دانه قهوه",
    image: "/images/coffee-beans.png",
    href: "/shop/coffee-beans",
  },

  {
    title: "Matcha & Tea",
    subtitle: "ماچا و چای",
    image: "/images/matcha-tea.png",
    href: "/shop/matcha-tea",
  },

  {
    title: "Cold Brew",
    subtitle: "کلد برو",
    image: "/images/cold-brew.png",
    href: "/shop/cold-brew",
  },

  {
    title: "Accessories",
    subtitle: "اکسسوری",
    image: "/images/accessories.png",
    href: "/shop/accessories",
  },

];



export default function SomethingForEveryone() {


  return (

<section
  className="
  mx-4
  overflow-hidden
  rounded-[2rem]
  bg-[#203c27]
  py-10
  md:py-14
  "
>

      <Container>


        {/* Heading */}

        <div
          className="
          mx-auto
          mb-8
          text-center
          "
        >

          <h2
            className="
            font-serif
            text-2xl
            font-bold
            text-white
            md:text-4xl
            "
          >

            Something for everyone

          </h2>




        </div>





        {/* Items */}

        <div
          className="
          grid
          grid-cols-2
          gap-x-4
          gap-y-6
          md:grid-cols-4
          md:gap-5
          "
        >


          {
            categories.map((category,index)=>(


              <Reveal
                key={category.title}
                delay={index * 0.08}
              >


                <Link
                  href={category.href}
                  className="
                  group
                  block
                  text-center
                  "
                >


                  {/* Image */}

                  <div
                    className="
                    relative
                    mx-auto
                    aspect-square
                    w-full
                    max-w-[150px]
                    "
                  >

                    <Image

                      src={category.image}

                      alt={category.title}

                      fill

                      className="
                      object-contain
                      drop-shadow-xl
                      transition-transform
                      duration-500
                      group-hover:scale-110
                      "

                    />

                  </div>





                  {/* Text */}

                  <div
                    className="
                    mt-2
                    "
                  >

                    <h3
                      className="
                      font-serif
                      text-sm
                      font-bold
                      text-white
                      transition-colors
                      group-hover:text-[#f5d08a]
                      md:text-base
                      "
                    >

                      {category.title}

                    </h3>


                    <p
                      className="
                      mt-1
                      text-[11px]
                      text-white/60
                      "
                    >

                      {category.subtitle}

                    </p>


                  </div>


                </Link>


              </Reveal>


            ))
          }


        </div>


      </Container>


    </section>

  );

}
