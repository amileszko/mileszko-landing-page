import { cn } from "@utils/classNameUtils";
import { type SubmitEventHandler } from "react";
import { type FieldValues, type FormProviderProps } from "react-hook-form";
import { FormProvider } from "react-hook-form";

interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends FormProviderProps<TFieldValues> {
  className?: string
  onSubmit: SubmitEventHandler<HTMLFormElement>
}

const Form = <TFieldValues extends FieldValues = FieldValues>({
  children,
  className,
  onSubmit,
  ...props
}: FormProps<TFieldValues>) => {
  return (
    <FormProvider {...props}>
      <form
        className={
          cn(
            "flex w-full flex-col gap-6",
            className,
          )
        }
        noValidate
        onSubmit={onSubmit}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export { Form };
