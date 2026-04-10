import { cn } from "@/lib/utils";

export default function Wave({ className }: { className?: string }) {
  return (
    <div className={cn("absolute bottom-0 left-0 w-full", className)}>
      <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0 100H1440V0C1181.33 66.6667 711.5 100 444 100C261.5 100 90.3333 76.6667 0 30V100Z" className="fill-background" />
      </svg>
    </div>
  );
}
