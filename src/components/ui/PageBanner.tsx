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
    <section className="pt-[10rem] sm:pt-[10.5rem] lg:pt-[11rem]">
      <div className="header-navy-row border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-2.5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-sky">
            {breadcrumb ?? "Mbale School of Nursing and Midwifery"}
          </p>
        </div>
      </div>

      <div className="hero-sky hero-sky--overlay relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src={image} alt="" fill className="object-cover" priority sizes="100vw" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-display text-primary sm:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 max-w-2xl text-base leading-body text-muted sm:text-lg">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      <div className="brand-tricolor-rule relative" />
    </section>
  );
}
