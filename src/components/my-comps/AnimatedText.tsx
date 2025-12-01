import { motion } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  fontSize?: number;
  strokeWidth?: number;
  duration?: number;
  delay?: number;
  loop?: boolean;
}

export default function AnimatedText({
  text,
  className = '',
  fontSize = 80,
  strokeWidth = 2,
  duration = 3,
  delay = 0,
  loop = true
}: AnimatedTextProps) {
  // Estimate stroke length based on text length and font size
  const estimatedLength = text.length * fontSize * 0.8;

  // Calculate dynamic viewBox based on font size
  const viewBoxHeight = fontSize * 2;
  const viewBoxWidth = text.length * fontSize * 1.2;

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      style={{ width: '100%', height: 'auto' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <motion.text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="bold"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: estimatedLength,
        }}
        initial={{
          strokeDashoffset: estimatedLength,
        }}
        animate={{
          strokeDashoffset: 0,
        }}
        transition={{
          duration: duration,
          delay: delay,
          ease: "easeInOut",
          repeat: loop ? Infinity : 0,
          repeatType: "reverse",
          repeatDelay: 0.5
        }}
      >
        {text}
      </motion.text>
    </svg>
  );
}
