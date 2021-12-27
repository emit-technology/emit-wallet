import * as React from "react";

import { Orientation, Point } from "./models";
export interface LayoutData {
  orientation: Orientation;
  hexSize: number;
  spacing: number;
  origin: Point;
  points: string;
}

interface LayoutContextData {
  layoutData: LayoutData;
  setLayoutData: (next: LayoutData) => void;
}

const LayoutContext = React.createContext<LayoutContextData>({} as LayoutContextData);

export const LayoutProvider: React.FC = ({ children }) => {
  const [layoutData, setLayoutData] = React.useState<LayoutData>();

  return (
      <LayoutContext.Provider
          value={{
            // @ts-ignore
            layoutData,
        setLayoutData,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = (): LayoutContextData => {
  const context = React.useContext(LayoutContext);

  return context;
};
