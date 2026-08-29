"use client";

import Link from "next/link";
import { Music2 } from "lucide-react";

import Container from "@/components/shared/Container";
import Reveal from "@/components/shared/Reveal";

export default function PlaylistSection() {
  return (
    <section className="bg-white py-24">

      <Container>

        <Reveal>

          <div className="mx-auto max-w-6xl">

            <div
              className="
              rounded-[2rem]
              bg-[#f8f5ed]
              p-6
              shadow-sm
              md:p-8
              "
            >

              <div className="text-center">

                <div
                  className="
                  mx-auto
                  mb-5
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-[#203c27]
                  text-white
                  "
                >
                  <Music2 size={28} />
                </div>

                <span
                  className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-[#b58a47]
                  "
                >
                  Cafe Playlist
                </span>

                <h2
                  className="
                  mt-4
                  font-serif
                  text-4xl
                  font-bold
                  text-[#203c27]
                  md:text-5xl
                  "
                >
                  Take a piece of our café home
                </h2>

              </div>


              <div className="mt-6">

                <iframe
                  style={{ borderRadius: "20px" }}
                  src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6?utm_source=generator"
                  width="100%"
                  height="180"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />

              </div>


              <div className="mt-5 text-center">

                <Link
                  href="https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6"
                  target="_blank"
                  className="
                  inline-flex
                  rounded-full
                  bg-[#203c27]
                  px-8
                  py-4
                  text-white
                  transition
                  hover:bg-[#355e3b]
                  "
                >
                  Open on Spotify
                </Link>

              </div>

            </div>

          </div>

        </Reveal>

      </Container>

    </section>
  );
}
