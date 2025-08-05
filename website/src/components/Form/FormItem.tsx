import { cn } from "@utils/classNameUtils";
import { createContext, useId, useMemo } from "react";

interface FormItemContextValue {
  id: string
}

const FormItemContext =
  createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const id = useId();
  const value = useMemo(
    () => ({ id }),
    [id],
  );

  return (
    <FormItemContext value={value}>
      <div
        className={
          cn(
            "flex flex-col gap-2",
            className,
          )
        }
        {...props}
      />
    </FormItemContext>
  );
};

export { FormItem, FormItemContext };
