declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (
      command: string,
      action: string,
      parameters?: Record<string, unknown>,
    ) => void
  }

  namespace Vike {
    interface PageContext {
      locale: string
      Page: () => React.JSX.Element
    }
  }
}

export { };
