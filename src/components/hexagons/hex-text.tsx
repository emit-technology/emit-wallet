import * as React from "react";

interface HexText {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const HexText: React.FC<HexText> = ({
  x = 0,
  y = "0.3em",
  className,
  children,
}) => (
  <text
    x={x}
    y={y}
    className={className}
    textAnchor="middle"
    textRendering="optimizeSpeed"
  >
    {children}
  </text>
);
