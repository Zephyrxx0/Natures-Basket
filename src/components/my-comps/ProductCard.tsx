import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  title: string;
  description: string;
  price: string | number;
  image: string;
  onAddToCart?: () => void;
  className?: string;
}

export default function ProductCard({
  title,
  description,
  price,
  image,
  onAddToCart,
  className,
}: ProductCardProps) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className={cn(
        "rounded-lg bg-secondary overflow-hidden w-80 flex flex-col transition-all duration-300 hover:shadow-lg border border-border",
        className
      )}
    >
      {/* Image section */}
      <div className="relative w-full aspect-square flex items-center justify-center bg-background/50">
        {/* Radial blur background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-border blur-3xl opacity-20"></div>
        </div>

        {!imageError && image ? (
          <img
            src={image}
            alt={title}
            onError={() => setImageError(true)}
            className="object-contain w-full h-full p-6 relative z-10"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-foreground/40 relative z-10">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="text-sm mt-2">No Image</p>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="flex flex-col flex-grow p-4 bg-background/30 backdrop-blur-[2px]">
        {/* Title */}
        <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-foreground/70 mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* Price and Add to Cart section */}
        <div className="flex items-center justify-between gap-4 mt-auto">
          {/* Price */}
          <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
            <span className="text-lg font-bold text-border">
              ₹{typeof price === 'number' ? price.toFixed(0) : price}
            </span>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={onAddToCart}
            className="flex-1 bg-border text-background hover:bg-border/90 transition-colors cursor-pointer"
          >
            ADD TO CART
          </Button>
        </div>
      </div>
    </div>
  );
}
