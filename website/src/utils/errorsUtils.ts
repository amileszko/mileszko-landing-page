const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object" && "error" in error) {
    return String(error.error);
  }
  return JSON.stringify(error);
};

export { getErrorMessage };
