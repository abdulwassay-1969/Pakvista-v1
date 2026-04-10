"use client";

import dynamic from "next/dynamic";

const PakistanMap = dynamic(() => import("@/components/maps/pakistan-map"), {
  ssr: false,
});

export default function PakistanMapClient() {
  return <PakistanMap />;
}
