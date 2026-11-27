const getWindow = () => {
  if ((globalThis.window as (typeof globalThis & Window) | undefined) ===
    undefined) {
    return;
  }

  return globalThis.window;
};

export { getWindow };
