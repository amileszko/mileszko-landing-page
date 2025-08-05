import { cn } from "@utils/classNameUtils";

const Input = ({
  className,
  ...props
}: React.ComponentProps<"input">) => {
  return (
    <div className="relative w-full">
      <input
        className={
          cn(
            `
              w-full rounded-md border border-neutral-400 p-4
              text-sm text-neutral-800 transition-all duration-200 ease-in-out
              outline-none
              placeholder:text-neutral-500
              hover:border-neutral-500
              focus:!border-neutral-500
              disabled:!cursor-not-allowed disabled:!border-neutral-300 disabled:text-neutral-400
              data-[invalid=true]:border-error-600
              data-[success=true]:border-success-400 data-[success=true]:bg-success-50
              md:p-6
            `,
            className,
          )
        }
        {...props}
      />
    </div>
  );
};

export { Input };
