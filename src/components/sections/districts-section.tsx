'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import DistrictCard from '@/components/district-card';
import { provinces } from '@/lib/data';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function DistrictsSection() {
  return (
    <section id="provinces" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary font-headline md:text-4xl">
            Provinces of Pakistan
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore the cultural and geographical diversity of Pakistan’s provinces
          </p>
        </div>

        <Tabs defaultValue={provinces[0].slug} className="w-full">
          <div className="flex justify-center mb-8">
            <ScrollArea className="w-full max-w-4xl whitespace-nowrap rounded-md">
              <TabsList className="inline-flex">
                {provinces.map((province) => (
                  <TabsTrigger key={province.slug} value={province.slug} className="text-sm">
                    {province.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {provinces.map((province) => (
            <TabsContent key={province.slug} value={province.slug}>
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {province.districts.map((district) => (
                    <CarouselItem
                      key={district.slug}
                      className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 p-4"
                    >
                      <DistrictCard district={district} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2 hidden md:inline-flex" />
                <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2 hidden md:inline-flex" />
              </Carousel>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
