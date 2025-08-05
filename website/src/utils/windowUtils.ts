type ScreenSize = "lg" | "md" | "sm";

const getWindow = () => {
  if ((globalThis.window as (typeof globalThis & Window) | undefined) ===
    undefined) {
    return;
  }

  return globalThis.window;
};

const getScreenSize = (): ScreenSize | undefined => {
  const window = getWindow();

  if (window === undefined) {
    return undefined;
  }

  const width = document.documentElement.clientWidth;

  if (width < 768) {
    return "sm";
  }
  if (width < 1024) {
    return "md";
  }
  return "lg";
};

export { getScreenSize, getWindow, type ScreenSize };
