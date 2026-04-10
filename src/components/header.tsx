"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, Search, Home, Map,
  ImageIcon, Compass, MapPin,
  Camera, Phone, CloudSun, Bookmark,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Logo from './logo';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/#provinces', label: 'Provinces', icon: Map },
  { href: '/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/saved-trips', label: 'Saved Trips', icon: Bookmark },
  { href: '/planner', label: 'Smart Planner', icon: Compass },
  { href: '/map', label: 'Map', icon: MapPin },
  { href: '/virtual-tour', label: 'Virtual Tour', icon: Camera },
  { href: '/contact', label: 'Contacts', icon: Phone },
  { href: '/weather', label: 'Weather', icon: CloudSun },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[2000] transition-all duration-500 ease-in-out px-4 py-4',
      )}
    >
      <div className={cn(
        "container mx-auto rounded-3xl transition-all duration-500 border overflow-hidden shadow-2xl ",
        isScrolled
          ? "bg-[#003D5B]/85 backdrop-blur-xl border-white/20 h-16"
          : isHomePage
            ? "bg-white/10 backdrop-blur-md border-white/20 h-20"
            : "bg-white/90 backdrop-blur-md border-[#30638E]/25 h-20"
      )}>
        <div className="flex h-full items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
            <div className={cn(
              "p-2 rounded-xl border transition-all duration-500",
              isScrolled ? "bg-primary border-primary/20" : "bg-white border-white/20"
            )}>
              <Logo className={cn('h-5 w-5', isScrolled ? 'text-white' : 'text-slate-900')} />
            </div>
            <span className={cn(
              'text-xl font-bold tracking-tighter transition-colors',
              isScrolled ? 'text-white' : isHomePage ? 'text-white' : 'text-slate-900'
            )}>
              PakVista
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300',
                  isScrolled
                    ? 'text-[#74AFDB] hover:text-white hover:bg-white/10'
                    : isHomePage
                      ? 'text-white/80 hover:text-white hover:bg-white/20'
                      : 'text-[#003D5B] hover:text-[#00798C] hover:bg-[#74AFDB]/15'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-2 pl-4 border-l border-white/10">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full",
                  isScrolled
                    ? "text-white hover:bg-white/10"
                    : isHomePage
                      ? "text-white hover:bg-white/10"
                      : "text-[#003D5B] hover:bg-[#74AFDB]/15"
                )}
              >
                <Link href="/map" aria-label="Open map page">
                  <Search className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full h-11 w-11",
                isScrolled
                  ? "text-white hover:bg-white/10"
                  : isHomePage
                    ? "text-white hover:bg-white/10"
                    : "text-[#003D5B] hover:bg-[#74AFDB]/15"
              )}
            >
              <Link href="/map" aria-label="Open map page">
                <Search className="h-4 w-4" />
              </Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-full h-11 w-11 border",
                    isScrolled
                      ? "bg-white/10 border-white/20 text-white"
                      : isHomePage
                        ? "bg-white/10 border-white/20 text-white"
                        : "bg-[#74AFDB]/15 border-[#30638E]/25 text-[#003D5B]"
                  )}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:max-w-xs bg-slate-950/95 backdrop-blur-2xl border-l border-white/10 p-0 text-white">
                <div className="flex flex-col h-full">
                  <div className="p-8 border-b border-white/10">
                    <Link href="/" className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary">
                        <Logo className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold tracking-tighter">PakVista</span>
                    </Link>
                  </div>

                  <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white active:scale-95 group"
                        >
                          <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-primary/20 transition-colors">
                            <link.icon className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
                          </div>
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="p-8 mt-auto border-t border-white/10 bg-black/40 text-center">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em] mb-6">
                      Truly Pakistan
                    </p>
                    <Button className="w-full py-7 rounded-2xl bg-primary hover:bg-primary/90 text-white font-extrabold text-lg shadow-2xl shadow-primary/30 active:scale-[0.98] transition-transform">
                      Get Started
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

