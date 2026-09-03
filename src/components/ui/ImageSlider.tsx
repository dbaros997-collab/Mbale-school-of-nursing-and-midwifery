"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_HERO_MQ = "(max-width: 767px)";

function subscribeMobileHeroPeek(onStoreChange: () => void) {
  const mq = window.matchMedia(MOBILE_HERO_MQ);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getMobileHeroPeekSnapshot() {
  return window.matchMedia(MOBILE_HERO_MQ).matches;
}

function getMobileHeroPeekServerSnapshot() {
  return false;
}

type ImageSliderProps = {
  images: string[];
  /** Auto-advance interval in ms. Default 5000. */
  intervalMs?: number;
  className?: string;
  /** `hero` fills a positioned parent; `section` is a mid-page gallery block. */
  layout?: "hero" | "section";
  /** Called whenever the active slide index changes. */
  onIndexChange?: (index: number) => void;
  /** Optional per-image object-fit override (e.g. contain for tall photos). */
  objectFitFor?: ReadonlySet<string>;
  altPrefix?: string;
  /** Overlay content (captions, scrims) rendered above slides but below controls. */
  children?: ReactNode;
  /** Rendered per slide index — use for captions tied to the active slide. */
  renderOverlay?: (index: number) => ReactNode;
};

export function ImageSlider({
  images,
  intervalMs = 5000,
  className,
  layout = "section",
  onIndexChange,
  objectFitFor,
  altPrefix = "Slide",
  children,
  renderOverlay,
}: ImageSliderProps) {
  const [index, setIndex] = useState(0);
  const [resumeKey, setResumeKey] = useState(0);
  const [animating, setAnimating] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const isMobileViewport = useSyncExternalStore(
    subscribeMobileHeroPeek,
    getMobileHeroPeekSnapshot,
    getMobileHeroPeekServerSnapshot,
  );
  const mobileHeroPeek = layout === "hero" && isMobileViewport;
  const count = images.length;

  const trackStyle: CSSProperties =
    layout === "hero"
      ? mobileHeroPeek
        ? { transform: `translateX(calc(12px - ${index} * (76vw + 12px)))` }
        : { transform: `translate3d(-${index * 100}%, 0, 0)` }
      : { transform: `translate3d(-${index * 100}%, 0, 0)` };

  const goTo = useCallback(
    (next: number, withAnim = true) => {
      if (count === 0) return;
      const wrapped = ((next % count) + count) % count;
      const wrapping =
        (index === count - 1 && wrapped === 0) ||
        (index === 0 && wrapped === count - 1);
      setAnimating(withAnim && !wrapping);
      setIndex(wrapped);
      setResumeKey((k) => k + 1);
      onIndexChange?.(wrapped);
      if (wrapping && withAnim) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setAnimating(true));
        });
      }
    },
    [count, index, onIndexChange],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    if (count <= 1) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setIndex((i) => {
        const wrapped = (i + 1) % count;
        const wrapping = i === count - 1 && wrapped === 0;
        setAnimating(!wrapping);
        onIndexChange?.(wrapped);
        if (wrapping) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setAnimating(true));
          });
        }
        return wrapped;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [count, intervalMs, onIndexChange, resumeKey]);

  if (count === 0) return null;

  return (
    <div
      className={cn(
        "gallery-slider",
        layout === "hero" && "gallery-slider--hero",
        layout === "hero" && mobileHeroPeek && "gallery-slider--hero-peek",
        layout === "section" && "gallery-slider--section",
        className,
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image slideshow"
    >
      <div className="gallery-slider__viewport">
        <div
          ref={trackRef}
          className={cn("gallery-slider__track", animating && "is-animating")}
          style={trackStyle}
        >
          {images.map((src, i) => {
            const fit = objectFitFor?.has(src) ? "contain" : "cover";
            return (
              <div
                key={src}
                className={cn(
                  "gallery-slider__slide",
                  layout === "hero" && i === index && "is-active",
                )}
                style={{
                  backgroundImage: `url("${src}")`,
                  backgroundSize: fit,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                aria-hidden={i !== index}
                aria-label={`${altPrefix} ${i + 1} of ${count}`}
              />
            );
          })}
        </div>
      </div>

      {(children || renderOverlay) && (
        <div className="gallery-slider__overlay">
          {children}
          {renderOverlay?.(index)}
        </div>
      )}

      {count > 1 && (
        <>
          <button
            type="button"
            className="gallery-slider__arrow gallery-slider__arrow--prev focus-ring"
            onClick={prev}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
          <button
            type="button"
            className="gallery-slider__arrow gallery-slider__arrow--next focus-ring"
            onClick={next}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>

          <div className="gallery-slider__dots" role="tablist" aria-label="Slide indicators">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}`}
                className={cn("gallery-slider__dot focus-ring", i === index && "is-active")}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
