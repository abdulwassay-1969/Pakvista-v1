import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import type { District } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/placeholder-images';

type DistrictCardProps = {
  district: District;
};

export default function DistrictCard({ district }: DistrictCardProps) {
  const image = getPlaceholderImage(district.image);

  return (
    <Link href={`/districts/${district.slug}`} className="group block">
      <Card className="relative h-80 w-full overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-2xl">
        <Image
          src={image.imageUrl}
          alt={image.description}
          data-ai-hint={image.imageHint}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-6">
          <h3 className="text-2xl font-bold uppercase tracking-wider text-white">
            {district.name}
          </h3>
        </div>
      </Card>
    </Link>
  );
}
