"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { provinces } from "@/lib/data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const featuredSlugs = [
  'lahore', // Punjab
  'larkana', // Sindh (for Mohenjo-Daro)
  'swat', // Khyber Pakhtunkhwa
  'ziarat', // Balochistan
  'hunza', // Gilgit-Baltistan
  'muzaffarabad', // Azad Kashmir (for Neelum Valley)
  'islamabad', // Islamabad Capital Territory
];

function getLoopDistance(index: number, active: number, total: number) {
  const direct = Math.abs(index - active);
  return Math.min(direct, total - direct);
}

export default function FeaturedDestinationsSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  const featuredDistricts = featuredSlugs
    .map((slug) => provinces.flatMap((p) => p.districts).find((d) => d.slug === slug))
    .filter((d) => d !== undefined);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-100 via-white to-lime-50">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary font-headline md:text-4xl">
            Featured Destinations
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            Discover the most captivating places Pakistan has to offer, with a highlight from each province.
          </p>
        </div>

        <div className="relative">
          <div className="mb-4 flex justify-end">
            <Button asChild variant="secondary" className="rounded-lg bg-white hover:bg-white/90">
              <Link href="/#provinces">View All</Link>
            </Button>
          </div>

          <Carousel opts={{ align: "center", loop: true }} setApi={setApi} className="w-full px-6 md:px-12">
            <CarouselContent className="-ml-3 md:-ml-4">
              {featuredDistricts.map((district, idx) => {
                if (!district) return null;
                const image = getPlaceholderImage(district.image);
                const distance = getLoopDistance(idx, activeIndex, featuredDistricts.length);
                const isActive = distance === 0;
                const isAdjacent = distance === 1;
                const isOuter = distance === 2;

                const scaleClass = isActive
                  ? "scale-[1.1]"
                  : isAdjacent
                    ? "scale-95"
                    : isOuter
                      ? "scale-90"
                      : "scale-[0.86]";
                const opacityClass = isActive
                  ? "opacity-100"
                  : isAdjacent
                    ? "opacity-85"
                    : isOuter
                      ? "opacity-70"
                      : "opacity-55";
                const zClass = isActive ? "z-30" : isAdjacent ? "z-20" : "z-10";
                return (
                  <CarouselItem
                    key={district.slug}
                    className="pl-3 basis-[82%] sm:basis-[48%] lg:basis-1/5"
                  >
                    <Link
                      href={`/districts/${district.slug}`}
                      className={`group relative -mx-2 block transition-all duration-500 ${scaleClass} ${opacityClass} ${zClass}`}
                    >
                      <article className="relative h-[280px] md:h-[330px] overflow-hidden rounded-2xl border border-white/20 shadow-none">
                        <Image
                          src={image.imageUrl}
                          alt={image.description}
                          data-ai-hint={image.imageHint}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="relative flex h-full flex-col justify-end p-5">
                          <h4 className="text-xl font-bold text-white tracking-tight leading-tight">
                            {district.name}
                          </h4>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 w-fit rounded-md border-white/80 bg-transparent text-white hover:bg-white/20"
                          >
                            EXPLORE
                          </Button>
                        </div>
                      </article>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-0 h-11 w-11 md:h-10 md:w-10 border-0 bg-lime-300 text-slate-800 hover:bg-lime-400" />
            <CarouselNext className="right-0 h-11 w-11 md:h-10 md:w-10 border-0 bg-lime-300 text-slate-800 hover:bg-lime-400" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
