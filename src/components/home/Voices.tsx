import { Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

export function Voices() {
  return (
    <section id="voices" className="scroll-mt-24 pb-14 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/15 bg-primary-dark/55 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            What people are saying about us
          </h2>
          <p className="mt-2 max-w-2xl text-white/75">
            We have been able to produce competitive nurses, ready for the current job market.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {testimonials.map((item) => (
              <blockquote
                key={item.id}
                className="rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
              >
                <Quote className="h-5 w-5 text-accent-gold" aria-hidden />
                <p className="mt-3 text-sm leading-relaxed text-white/85">“{item.quote}”</p>
                <footer className="mt-4">
                  <p className="text-sm font-bold text-white">{item.name}</p>
                  <p className="text-xs text-white/65">{item.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
