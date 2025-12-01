import { cn } from "@/lib/utils";

interface LineBreakProps {
  color?: string;
  style?: "solid" | "dashed" | "dotted" | "double";
  className?: string;
}

export default function LineBreak({ 
  color = "border", 
  style = "solid",
  className 
}: LineBreakProps) {
  const borderStyles = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
    double: "border-double",
  };

  return (
    <hr 
      className={cn(
        "w-full border-t",
        borderStyles[style],
        `border-${color}`,
        className
      )} 
    />
  );
}
