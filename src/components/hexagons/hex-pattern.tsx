import * as React from "react";
import { useLayoutContext } from "./layout-context";

interface HexPatternProps {
  id: string;
  url: string;
}

export const HexPattern: React.FC<HexPatternProps> = ({ id, url }) => {
  const {
    layoutData: { hexSize },
  } = useLayoutContext();

  return (
    <defs>
      <pattern
        id={id}
        patternUnits="objectBoundingBox"
        x={0}
        y={0}
        width={1}
        height={1}
      >
        <image
          xlinkHref={url}
          x={0}
          y={0}
          width={hexSize * 2}
          height={hexSize * 2}
        />
      </pattern>
    </defs>
  );
};
