import { cn } from "@utils/classNameUtils";

import { useFormField } from "./hooks/useFormField";

const FormDescription = ({
  className,
  ...props
}: React.ComponentProps<"p">) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      className={
        cn(
          "text-sm text-neutral-600",
          className,
        )
      }
      id={formDescriptionId}
      {...props}
    />
  );
};

export { FormDescription };
