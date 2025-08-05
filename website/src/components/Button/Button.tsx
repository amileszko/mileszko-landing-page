import { cn } from "@utils/classNameUtils";
import { cva, type VariantProps } from "class-variance-authority";
import { createContext, use, useMemo } from "react";

import { Slot } from "../Slot";

interface ButtonContextType {
  isLoading?: boolean
  variant?: "cta-link" |
    "cta-primary" |
    "cta-primary-with-description" |
    "cta-secondary" |
    "cta-secondary-with-description" |
    "footer-link" |
    "footer-link-secondary" |
    "navigation-link"
}

const ButtonContext = createContext<ButtonContextType | undefined>(undefined);

const buttonVariants = cva(
  `
    relative flex cursor-pointer items-center justify-center
    gap-4 text-sm transition-all duration-200 ease-in-out
    outline-none
    disabled:cursor-not-allowed disabled:opacity-50
  `,
  {
    variants: {
      variant: {
        "cta-link": `
          text-brand-500
          after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
          after:bg-transparent after:transition-colors after:duration-200 after:ease-in-out
          hover:text-brand-600 hover:after:bg-brand-600
          disabled:hover:text-brand-500 disabled:hover:after:bg-transparent
        `,
        "cta-primary": `
          rounded-md border-1 border-brand-500 bg-brand-500 px-6
          py-3 font-semibold text-neutral-50
          hover:border-brand-600 hover:bg-brand-600
          disabled:hover:border-brand-500 disabled:hover:bg-brand-500
          md:max-w-[356px]
        `,
        "cta-primary-with-description": `
          flex-row justify-start gap-1 rounded-md border-1
          border-brand-500 bg-brand-500 px-4 py-2 text-left
          font-semibold text-neutral-50
          hover:border-brand-600 hover:bg-brand-600
          disabled:hover:border-brand-500 disabled:hover:bg-brand-500
          md:max-w-[356px]
        `,
        "cta-secondary": `
          rounded-md border-1 border-brand-500 bg-neutral-50 px-6
          py-3 font-semibold text-brand-500
          hover:border-brand-600 hover:text-brand-600
          disabled:hover:border-brand-500 disabled:hover:text-brand-500
          md:max-w-[356px]
        `,
        "cta-secondary-with-description": `
          flex-row justify-start gap-1 rounded-md border-1
          border-brand-500 bg-neutral-50 px-4 py-2 text-left
          font-semibold text-brand-500
          hover:border-brand-600 hover:text-brand-600
          disabled:hover:border-brand-500 disabled:hover:text-brand-500
          md:max-w-[356px]
        `,
        "footer-link": `
          py-2 text-neutral-50
          after:absolute after:bottom-2 after:left-0 after:h-px after:w-full
          after:bg-transparent after:transition-colors after:duration-200 after:ease-in-out
          hover:after:bg-neutral-50
          disabled:hover:after:bg-transparent
        `,
        "footer-link-secondary": `
          text-xs text-neutral-400
          after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
          after:bg-transparent after:transition-colors after:duration-200 after:ease-in-out
          hover:after:bg-neutral-400
          disabled:hover:after:bg-transparent
        `,
        "navigation-link": `
          py-2 font-medium
          after:absolute after:right-0 after:bottom-2 after:left-0 after:h-px
          after:bg-transparent after:transition-colors after:duration-200 after:ease-in-out
          hover:after:bg-current
          disabled:hover:after:bg-transparent
        `,
      },
    },
  },
);

interface ButtonProps
  extends React.ComponentProps<"button">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  disabled?: boolean
  isLoading?: boolean
}

const Button = ({
  asChild = false,
  children,
  className,
  disabled = false,
  isLoading = false,
  type = "button",
  variant,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;
  const Component = asChild ? Slot : "button";

  const contextValue = useMemo(
    () => ({
      isLoading,
      variant: variant ?? undefined,
    }),
    [
      isLoading,
      variant,
    ],
  );

  return (
    <ButtonContext value={contextValue}>
      <Component
        className={
          cn(
            buttonVariants({ variant }),
            className,
          )
        }
        disabled={isDisabled}
        type={type}
        {...props}
      >
        {children}
      </Component>
    </ButtonContext>
  );
};

const useButton = () => {
  const context = use(ButtonContext);

  if (!context) {
    throw new Error("useButton must be used within ButtonContext");
  }

  return context;
};

const ButtonLoadingIndicator = () => {
  const { isLoading } = useButton();

  return (
    isLoading && (
      <div
        className={
          `
            mx-auto h-4 w-4 shrink-0 animate-spin
            rounded-full border-2 border-current border-t-transparent
          `
        }
      />
    )
  );
};

interface CtaButtonLabelWithDescriptionProps extends React.ComponentProps<"div"> {
  description?: string
  label: string
}

const CtaButtonLabelWithDescription = ({
  className,
  description,
  label,
  ...props
}: CtaButtonLabelWithDescriptionProps) => {
  return (
    <div
      className={
        cn(
          `
            flex w-full flex-col items-start gap-1
            text-left
          `,
          className,
        )
      }
      {...props}
    >
      <span>{label}</span>
      {
        description && (
          <span
            className="text-xs leading-tight font-normal opacity-80"
          >
            {description}
          </span>
        )
      }
    </div>
  );
};

export { Button,
  ButtonLoadingIndicator,
  type ButtonProps,
  buttonVariants,
  CtaButtonLabelWithDescription,
  useButton };
