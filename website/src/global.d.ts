declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      parameters?: Record<string, unknown>
    ) => void
  }

  namespace Vike {
    interface PageContext {
      locale: string
      Page: () => React.JSX.Element
    }
  }
}

// eslint-disable-next-line unicorn/require-module-specifiers
export { };
