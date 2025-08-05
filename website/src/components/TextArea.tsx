import { cn } from "@utils/classNameUtils";

const TextArea = ({
  className,
  ...props
}: React.ComponentProps<"textarea">) => {
  return (
    <textarea
      className={
        cn(
          `
            min-h-36 w-full rounded-md border border-neutral-400
            p-4 text-sm text-neutral-800 transition-all duration-200
            ease-in-out outline-none
            placeholder:text-neutral-500
            hover:border-neutral-500
            focus:!border-neutral-500
            disabled:!cursor-not-allowed disabled:!border-neutral-300 disabled:text-neutral-400
            aria-[invalid=true]:border-error-600
            md:p-6
          `,
          className,
        )
      }
      {...props}
    />
  );
};

export { TextArea };
