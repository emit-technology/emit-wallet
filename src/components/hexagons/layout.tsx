import * as React from "react";
import { LayoutProvider, useLayoutContext } from "./layout-context";
import { Point, Orientation } from "./models";
import { ORIENTATIONS_CONSTS, OrientationsEnum } from "./utils";

const getPointOffset = (
  corner: number,
  orientation: Orientation,
  size: number
): Point => {
  const angle = (2.0 * Math.PI * (corner + orientation.startAngle)) / 6;
  return { x: size * Math.cos(angle), y: size * Math.sin(angle) };
};

export const calculateCoordinates = (
  orientation: Orientation,
  size: number
): Point[] => {
  const center = { x: 0, y: 0 };

  const corners: Point[] = Array.from({ length: 6 }, (_, i) => {
    const offset = getPointOffset(i, orientation, size);
    const point = { x: center.x + offset.x, y: center.y + offset.y };
    return point;
  });

  return corners;
};

export interface LayoutProps {
  className?: string;
  orientation?: OrientationsEnum;
  origin?: Point;
  hexSize?: number;
  spacing?: number;
}

const Layout: React.FC<LayoutProps> = ({
  className,
  orientation = OrientationsEnum.flat,
  origin = { x: 0, y: 0 },
  hexSize = 1,
  spacing = 1,
  children,
}) => {
  const { layoutData: layoutProps, setLayoutData: setLayoutProps } = useLayoutContext();

  React.useEffect(() => {
    const orientationValues = ORIENTATIONS_CONSTS[orientation];

    const cornerCoords = calculateCoordinates(orientationValues, hexSize);
    const points = cornerCoords
      .map((point) => `${point.x},${point.y}`)
      .join(" ");

    setLayoutProps({
      orientation: orientationValues,
      hexSize,
      spacing,
      origin,
      points,
    });
  }, [orientation, hexSize, spacing, origin]);

  return <g className={className}>{layoutProps && children}</g>;
};

const LayourProvided: React.FC<LayoutProps> = (props) => (
  <LayoutProvider>
    <Layout {...props} />
  </LayoutProvider>
);

export { LayourProvided as Layout };
