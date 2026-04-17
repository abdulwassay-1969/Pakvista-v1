import { Mountain, SunMedium, Compass, Landmark } from 'lucide-react';

const reasons = [
  {
    title: 'Highest Peaks',
    description: 'Home to K2 and 5 of the 14 highest independent peaks in the world.',
    icon: Mountain,
  },
  {
    title: 'Four Seasons',
    description: 'Experience diverse climates from snowy mountains to sunny beaches in one country.',
    icon: SunMedium,
  },
  {
    title: 'Ancient Civilizations',
    description: 'Explore the 5000-year-old Indus Valley Civilization and ancient Gandhara.',
    icon: Landmark,
  },
  {
    title: 'Unmatched Warmth',
    description: 'Renowned worldwide for incredible hospitality and welcoming locals.',
    icon: Compass,
  },
];

export default function WhyPakistanSection() {
  return (
    <section className="py-20 md:py-32 bg-stone-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 font-headline md:text-5xl">
            Why Visit <span className="text-primary">Pakistan?</span>
          </h2>
          <p className="mt-4 text-xl text-slate-600 font-medium">
            From the roof of the world to the shores of the Arabian Sea, Pakistan offers an adventure like no other.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-headline text-slate-900 mb-3 group-hover:text-primary transition-colors">
                  {reason.title}
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
