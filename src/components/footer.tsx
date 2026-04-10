import Link from 'next/link';
import { Twitter, Facebook, Instagram } from 'lucide-react';
import Logo from './logo';
import { Separator } from './ui/separator';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/#provinces', label: 'Provinces' },
  { href: '/saved-trips', label: 'Saved Trips' },
  { href: '/planner', label: 'Smart Planner' },
  { href: '/map', label: 'Map' },
  { href: '/virtual-tour', label: 'Virtual Tour' },
  { href: '/weather', label: 'Weather' },
];

export default function Footer() {
  const provinceLinks = [
    { label: "Punjab", href: "https://punjab.gov.pk" },
    { label: "Sindh", href: "https://sindh.gov.pk" },
    { label: "Balochistan", href: "https://balochistan.gov.pk" },
    { label: "KPK", href: "https://kp.gov.pk" },
    { label: "Gilgit-Baltistan", href: "https://gilgitbaltistan.gov.pk" },
  ];

  return (
    <footer className="bg-[#003D5B] text-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Logo className="h-7 w-7" />
              <span>PakVista</span>
            </Link>
            <p className="text-sm text-[#74AFDB]">
              Pakistan Travel Guide
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-[#74AFDB]">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Provinces</h3>
              <ul className="space-y-2 text-sm text-[#74AFDB]">
                {provinceLinks.map((province) => (
                  <li key={province.label}>
                    <Link
                      href="/#provinces"
                      className="hover:text-white"
                    >
                      {province.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-[#30638E]" />
        <div className="text-center text-sm text-[#74AFDB]">
          <p>© {new Date().getFullYear()} PakVista. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
