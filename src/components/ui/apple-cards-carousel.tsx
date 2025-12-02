"use client";
import { useEffect, useRef, useState } from "react";
// import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
// import { cn } from "@/lib/utils";
import { Card as FocusCard } from "./focus-cards";

interface CarouselProps {
  cards: { title: string; src: string | any }[];
  initialScroll?: number;
}

export const Carousel = ({ cards, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Duplicate cards for infinite loop effect
  const infiniteCards = [...cards, ...cards, ...cards];

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
    }
  }, [initialScroll]);

  // Auto-scroll effect
  useEffect(() => {
    const startAutoScroll = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }

      scrollIntervalRef.current = setInterval(() => {
        if (!isPaused && carouselRef.current) {
          const { scrollLeft, scrollWidth } = carouselRef.current;
          
          // Check if we've scrolled past the first set of cards
          const cardSetWidth = scrollWidth / 3;
          
          if (scrollLeft >= cardSetWidth * 2) {
            // Reset to beginning of second set (seamless loop)
            carouselRef.current.scrollLeft = cardSetWidth;
          } else {
            // Smooth scroll
            carouselRef.current.scrollBy({ left: 1, behavior: "auto" });
          }
        }
      }, 20); // Scroll speed (lower = faster)
    };

    startAutoScroll();

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isPaused]);

  return (
    <div className="relative w-full">
      <div
        className="flex w-full overflow-x-scroll overscroll-x-auto py-10 [scrollbar-width:none]"
        ref={carouselRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex flex-row justify-start gap-4 pl-4">
          {infiniteCards.map((card, index) => (
            <div key={`${card.title}-${index}`} className="flex-shrink-0 w-80 h-96">
              <FocusCard
                card={card}
                index={index}
                hovered={hovered}
                setHovered={setHovered}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

