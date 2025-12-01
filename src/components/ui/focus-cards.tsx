"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-lg relative bg-secondary overflow-hidden w-full h-full transition-all duration-300 ease-out flex flex-col",
        hovered !== null && hovered !== index && "scale-[0.98]"
      )}
    >
      {/* Image section */}
      <div className="relative h-64 w-full flex items-center justify-center">
        {/* Radial blur background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-border blur-2xl opacity-30"></div>
        </div>
        
        <img
          src={typeof card.src === 'string' ? card.src : card.src}
          alt={card.title}
          className={cn(
            "object-contain max-w-[200px] max-h-[200px] md:max-w-[250px] md:max-h-[250px] p-4 relative z-10 transition-all duration-300",
            hovered !== null && hovered !== index && "blur-md opacity-60"
          )}
        />
      </div>

      {/* Title and description section - always visible */}
      <div className="bg-background/80 backdrop-blur-sm py-4 px-4 flex-shrink-0 h-28 mt-auto">
        <h3 className="text-lg md:text-xl font-medium text-foreground text-center mb-2 line-clamp-1">
          {card.title}
        </h3>
        <p className="text-sm text-foreground/70 text-left line-clamp-2 min-h-[2.5rem]">
          {card.description || '\u00A0'}
        </p>
      </div>
    </div>
  )
);

Card.displayName = "Card";

type Card = {
  title: string;
  src: string;
  description?: string;
};

export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
