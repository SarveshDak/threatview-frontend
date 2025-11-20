import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* -----------------------------------------------------------
   CONTEXT + HOOK
----------------------------------------------------------- */
const CarouselContext = React.createContext(null);

export function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("useCarousel must be used inside <Carousel>");
  return ctx;
}

/* -----------------------------------------------------------
   ROOT CAROUSEL
----------------------------------------------------------- */
export const Carousel = React.forwardRef(function Carousel(
  {
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children,
    ...props
  },
  ref
) {
  const [carouselRef, api] = useEmblaCarousel(
    { ...opts, axis: orientation === "horizontal" ? "x" : "y" },
    plugins
  );

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

  React.useEffect(() => {
    if (setApi && api) setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  /* Keyboard arrows */
  const handleKeyDown = React.useCallback(
    (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        ref={ref}
        className={cn("relative", className)}
        onKeyDownCapture={handleKeyDown}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
});

/* -----------------------------------------------------------
   CONTENT WRAPPER
----------------------------------------------------------- */
export const CarouselContent = React.forwardRef(function CarouselContent(
  { className, ...props },
  ref
) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "flex-col -mt-4",
          className
        )}
        {...props}
      />
    </div>
  );
});

/* -----------------------------------------------------------
   INDIVIDUAL ITEM
----------------------------------------------------------- */
export const CarouselItem = React.forwardRef(function CarouselItem(
  { className, ...props },
  ref
) {
  const { orientation } = useCarousel();
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});

/* -----------------------------------------------------------
   PREVIOUS BUTTON
----------------------------------------------------------- */
export const CarouselPrevious = React.forwardRef(function CarouselPrevious(
  { className, variant = "outline", size = "icon", ...props },
  ref
) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});

/* -----------------------------------------------------------
   NEXT BUTTON
----------------------------------------------------------- */
export const CarouselNext = React.forwardRef(function CarouselNext(
  { className, variant = "outline", size = "icon", ...props },
  ref
) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
