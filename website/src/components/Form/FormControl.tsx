import { useFormContext } from "react-hook-form";

import { Slot } from "../Slot";
import { useFormField } from "./hooks/useFormField";

const FormControl = ({ ...props }:
  React.ComponentProps<typeof Slot> & { disabled?: boolean }) => {
  const {
    error,
    formDescriptionId,
    formItemId,
    formMessageId,
    isDirty,
    successState,
  } = useFormField();
  const { formState: { isSubmitting } } = useFormContext();

  return (
    <Slot
      {...props}
      aria-describedby={
        error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
      }
      aria-invalid={!!error}
      data-invalid={!!error}
      id={formItemId}
      {...((isSubmitting || props.disabled) && { disabled: true })}
      {...(successState && { "data-success": isDirty && !error })}
    />
  );
};

export { FormControl };
