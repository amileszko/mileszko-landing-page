import { use } from "react";
import { useFormContext } from "react-hook-form";

import { FormFieldContext } from "../FormField";
import { FormItemContext } from "../FormItem";

const useFormField = () => {
  const fieldContext = use(FormFieldContext);
  const itemContext = use(FormItemContext);
  const { formState, getFieldState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const fieldState = getFieldState(
    fieldContext.name,
    formState,
  );

  const { id } = itemContext;

  return {
    formDescriptionId: `${id}-form-item-description`,
    formItemId: `${id}-form-item`,
    formMessageId: `${id}-form-item-message`,
    id,
    name: fieldContext.name,
    successState: fieldContext.successState,
    ...fieldState,
  };
};

export { useFormField };
