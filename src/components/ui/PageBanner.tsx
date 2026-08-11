import Image from "next/image";

type PageBannerProps = {
  title: string;
  subtitle?: string;
  image?: string;
  breadcrumb?: string;
};

export function PageBanner({
  title,
  subtitle,
  image = "/images/front-offices.jpg",
  breadcrumb,
}: PageBannerProps) {
  return (
    <section className="relative overflow-hidden bg-primary-dark pt-24 text-white">
      <div className="absolute inset-0 opacity-35">
        <Image src={image} alt="" fill className="object-cover" priority sizes="100vw" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/85 to-primary/40" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {breadcrumb ? (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-gold">
            {breadcrumb}
          </p>
        ) : null}
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold sm:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-3 max-w-2xl text-white/80">{subtitle}</p> : null}
      </div>
      <div className="mak-gold-rule relative" />
    </section>
  );
}
