import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BauhausCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  color?: "red" | "blue" | "yellow" | "green" | "purple" | "orange";
  variant?: "solid" | "outline";
}

const palette: Record<NonNullable<BauhausCardProps["color"]>, { solid: string; outline: string }> = {
  red: {
    solid: "bg-gradient-to-br from-red-500 to-red-700 text-white border-red-600/40",
    outline: "bg-transparent text-red-700 border-red-500/60",
  },
  blue: {
    solid: "bg-gradient-to-br from-blue-500 to-blue-700 text-white border-blue-600/40",
    outline: "bg-transparent text-blue-700 border-blue-500/60",
  },
  yellow: {
    solid: "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black border-yellow-500/40",
    outline: "bg-transparent text-yellow-600 border-yellow-500/60",
  },
  green: {
    solid: "bg-gradient-to-br from-green-500 to-green-700 text-white border-green-600/40",
    outline: "bg-transparent text-green-700 border-green-500/60",
  },
  purple: {
    solid: "bg-gradient-to-br from-purple-500 to-purple-700 text-white border-purple-600/40",
    outline: "bg-transparent text-purple-700 border-purple-500/60",
  },
  orange: {
    solid: "bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-500/40",
    outline: "bg-transparent text-orange-600 border-orange-500/60",
  },
};

export const BauhausCard: React.FC<BauhausCardProps> = ({
  children,
  color = "blue",
  variant = "solid",
  className,
  ...rest
}) => {
  const colorClasses = palette[color][variant];

  return (
    <div
      className={cn(
        "rounded-2xl border shadow-sm p-6 grid gap-4",
        // subtle geometric feel
        "[clip-path:polygon(0_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%)]",
        colorClasses,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default BauhausCard;