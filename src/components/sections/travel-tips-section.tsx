import { CalendarDays, ShieldCheck, PlaneTakeoff } from 'lucide-react';

const tips = [
  {
    title: 'Best Time to Visit',
    description: 'Spring (March-May) and Autumn (September-November) offer the most pleasant weather across the country. Summer is perfect for the northern mountains.',
    icon: CalendarDays,
  },
  {
    title: 'Visa & Entry',
    description: 'Pakistan offers e-Visas for 191 countries and Visa-On-Arrival for 50 countries. The application process is completely online and streamlined.',
    icon: PlaneTakeoff,
  },
  {
    title: 'Safety Guidelines',
    description: 'Major tourist destinations are very safe. Always respect local customs, dress modestly in rural areas, and carry identification when traveling between cities.',
    icon: ShieldCheck,
  },
];

export default function TravelTipsSection() {
  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative background shape */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 font-headline md:text-5xl">
              Essential <span className="text-primary">Travel Tips</span>
            </h2>
            <p className="mt-4 text-xl text-slate-600 font-medium">
              Everything you need to know before you pack your bags for the ultimate Pakistani adventure.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div
                key={idx}
                className="bg-stone-50 rounded-[2rem] p-8 border border-stone-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-stone-100 flex items-center justify-center mb-6 text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-headline text-slate-900 mb-4">
                  {tip.title}
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {tip.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
