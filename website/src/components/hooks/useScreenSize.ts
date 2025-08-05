import { getScreenSize, getWindow, type ScreenSize } from "@utils/windowUtils";
import { useEffect, useState } from "react";

const useScreenSize = () => {
  const [
    screenSize,
    setScreenSize,
  ] = useState<ScreenSize | undefined>(() => getScreenSize());

  useEffect(
    () => {
      const handleResize = () => {
        const newScreenSize = getScreenSize();

        requestAnimationFrame(() => {
          setScreenSize(newScreenSize);
        });
      };

      const window = getWindow();

      window?.addEventListener(
        "resize",
        handleResize,
      );

      return () => {
        window?.removeEventListener(
          "resize",
          handleResize,
        );
      };
    },
    [],
  );

  return screenSize;
};

const useIsMobile = () => {
  return useScreenSize() !== "lg";
};

export { useIsMobile, useScreenSize };
