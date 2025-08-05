import { createContext, useMemo } from "react";
import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Controller } from "react-hook-form";

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
  successState?: boolean
}

const FormFieldContext =
  createContext<FormFieldContextValue | undefined>(undefined);

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName> {
  successState?: boolean
}

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  successState = false,
  ...props
}: FormFieldProps<TFieldValues, TName>) => {
  const value = useMemo(
    () => ({
      name: props.name,
      successState,
    }),
    [
      props.name,
      successState,
    ],
  );

  return (
    <FormFieldContext value={value}>
      <Controller {...props} />
    </FormFieldContext>
  );
};

export { FormField, FormFieldContext };
