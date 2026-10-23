import { Lotus } from "./Icons";

const ITEMS = [
  "Traditional Thai",
  "Deep Tissue",
  "Swedish",
  "Aromatherapy",
  "Hot Stone",
  "Reflexology",
  "Head Massage",
  "Back · Neck · Shoulders",
  "Couples",
];

function Run() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-xl italic tracking-wide text-cream/90 sm:px-8 sm:text-2xl">
            {item}
          </span>
          <Lotus className="h-4 w-5 shrink-0 text-gold-soft/80" />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee-viewport overflow-hidden border-y border-gold/20 bg-forest py-4">
      <div className="marquee-track slower">
        <Run />
        <Run />
      </div>
    </div>
  );
}
