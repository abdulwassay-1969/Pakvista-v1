"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getPlaceholderImage } from '@/lib/placeholder-images';

export default function HeroSection() {
  const heroImage = getPlaceholderImage('hero-mountains');

  return (
    <section id="home" className="relative h-screen w-full">
      <Image
        src={heroImage.imageUrl}
        alt={heroImage.description}
        data-ai-hint={heroImage.imageHint}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl font-headline animate-fade-in-up">
          Explore Pakistan
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-neutral-200 animate-fade-in-up animation-delay-300">
          Explore the breathtaking mountains, serene lakes, and vibrant cultures of Pakistan. Your next adventure awaits.
        </p>
        <div className="mt-8 flex gap-4 animate-fade-in-up animation-delay-600">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <a href="#provinces">Explore Pakistan</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
            <a href="#about">Learn More</a>
          </Button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </section>
  );
}
