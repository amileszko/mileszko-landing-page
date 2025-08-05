import { cn } from "@utils/classNameUtils";

import { Label } from "../Label";
import { useFormField } from "./hooks/useFormField";

const FormLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof Label>) => {
  const { formItemId } = useFormField();

  return <Label className={cn(className)} htmlFor={formItemId} {...props} />;
};

export { FormLabel };
