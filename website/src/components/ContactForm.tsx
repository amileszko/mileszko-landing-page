import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { type SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { z } from "zod";

import { useSendContactMessageMutation } from "../features/contact/api";
import { AlertDescription } from "./Alert/AlertDescription";
import { AnimatedAlert } from "./Alert/AnimatedAlert";
import {
  Button,
  ButtonLoadingIndicator,
  CtaButtonLabelWithDescription,
} from "./Button/Button";
import { FileUpload } from "./FileUpload";
import { Form } from "./Form/Form";
import { FormControl } from "./Form/FormControl";
import { FormField } from "./Form/FormField";
import { FormItem } from "./Form/FormItem";
import { FormLabel } from "./Form/FormLabel";
import { FormMessage } from "./Form/FormMessage";
import { Input } from "./Input";
import { Select } from "./Select/Select";
import { SelectContent } from "./Select/SelectContent";
import { SelectItem } from "./Select/SelectItem";
import { SelectTrigger } from "./Select/SelectTrigger";
import { SelectValue } from "./Select/SelectValue";
import { TextArea } from "./TextArea";

enum CooperationType {
  AUDIT = "AUDIT",
  MENTORING = "MENTORING",
  MVP = "MVP",
  OTHER = "OTHER",
  REFACTORING = "REFACTORING",
}

const ContactForm = () => {
  const { locale } = usePageContext();
  const { t } = useTranslation(
    undefined,
    { lng: locale },
  );

  const cooperationOptions = useMemo(
    () => [
      {
        label: t("contact:sections.brief.fields.cooperation.options.0"),
        value: CooperationType.AUDIT,
      },
      {
        label: t("contact:sections.brief.fields.cooperation.options.1"),
        value: CooperationType.MVP,
      },
      {
        label: t("contact:sections.brief.fields.cooperation.options.2"),
        value: CooperationType.REFACTORING,
      },
      {
        label: t("contact:sections.brief.fields.cooperation.options.3"),
        value: CooperationType.MENTORING,
      },
      {
        label: t("contact:sections.brief.fields.cooperation.options.4"),
        value: CooperationType.OTHER,
      },
    ],
    [t],
  );

  const formSchema = useMemo(
    () =>
      z.object({
        attachments: z.array(z.instanceof(File)),
        cooperation: z.enum(
          CooperationType,
          t("contact:sections.brief.fields.cooperation.validation.required"),
        ),
        description: z
          .string()
          .nonempty(t("contact:sections.brief.fields.description.validation.required"))
          .max(
            1000,
            t("contact:sections.brief.fields.description.validation.maxLength"),
          ),
        email: z
          .email(t("contact:sections.brief.fields.email.validation.email"))
          .nonempty(t("contact:sections.brief.fields.email.validation.required"))
          .max(
            50,
            t("contact:sections.brief.fields.email.validation.maxLength"),
          ),
        nda: z.string()
          .max(
            1000,
            t("contact:sections.brief.fields.nda.validation.maxLength"),
          )
          .optional(),
        topic: z
          .string()
          .nonempty(t("contact:sections.brief.fields.topic.validation.required"))
          .max(
            100,
            t("contact:sections.brief.fields.topic.validation.maxLength"),
          ),
      }),
    [t],
  );

  type FormType = z.infer<typeof formSchema>;

  const form = useForm<FormType>({
    criteriaMode: "all",
    defaultValues: {
      attachments: [],
      description: "",
      email: "",
      nda: "",
      topic: "",
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const {
    clearErrors,
    control,
    formState: {
      errors,
      isSubmitting,
      isValidating,
    },
    handleSubmit,
    setError,
  } = form;

  const [
    success,
    setSuccess,
  ] = useState<string | undefined>();

  const { mutateAsync: sendContactMessage } = useSendContactMessageMutation();

  const onSubmit: SubmitHandler<FormType> = useCallback(
    async (data) => {
      setSuccess(undefined);
      clearErrors("root");

      try {
        await sendContactMessage(
          {
            body: {
              attachments: data.attachments,
              cooperation: data.cooperation,
              description: data.description,
              email: data.email,
              nda: data.nda,
              topic: data.topic,
            },
            bodySerializer(body) {
              const formData = new FormData();

              if (!body) {
                return formData;
              }

              for (const name of Object.keys(body)) {
                if (name === "attachments") {
                  for (const attachment of body.attachments) {
                    formData.append(
                      name,
                      attachment,
                    );
                  }
                }
                else {
                  formData.append(
                    name,
                    body[name as keyof typeof body] as string,
                  );
                }
              }

              return formData;
            },
          },
          {
            onSuccess: (data) => {
              if (data.messageDelivered) {
                setSuccess(t("contact:sections.brief.status.success"));
              }
              else {
                setError(
                  "root",
                  { message: t("contact:sections.brief.status.error") },
                );
              }
            },
          },
        );
      }
      catch {
        setError(
          "root",
          { message: t("contact:sections.brief.status.error") },
        );
      }
    },
    [
      clearErrors,
      setError,
      sendContactMessage,
      t,
    ],
  );

  return (
    <Form {...form} onSubmit={handleSubmit(onSubmit)}>

      <FormField
        control={control}
        name="email"
        render={
          ({ field }) => (
            <FormItem>
              <FormLabel>{t("contact:sections.brief.fields.email.label")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("contact:sections.brief.fields.email.placeholder")} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }
      />
      <FormField
        control={control}
        name="topic"
        render={
          ({ field }) => (
            <FormItem>
              <FormLabel>{t("contact:sections.brief.fields.topic.label")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("contact:sections.brief.fields.topic.placeholder")} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }
      />
      <FormField
        control={control}
        name="description"
        render={
          ({ field }) => (
            <FormItem>
              <FormLabel>{t("contact:sections.brief.fields.description.label")}</FormLabel>
              <FormControl>
                <TextArea {...field} placeholder={t("contact:sections.brief.fields.description.placeholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }
      />
      <FormField
        control={control}
        name="cooperation"
        render={
          ({ field }) => (
            <FormItem>
              <FormLabel>{t("contact:sections.brief.fields.cooperation.label")}</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger aria-label={t("contact:sections.brief.fields.cooperation.placeholder")}>
                    <SelectValue placeholder={t("contact:sections.brief.fields.cooperation.placeholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    cooperationOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )
        }
      />
      <FormField
        control={control}
        name="attachments"
        render={
          ({ field }) => (
            <FormItem>
              <FormLabel>{t("contact:sections.brief.fields.attachments.label")}</FormLabel>
              <FormControl>
                <FileUpload
                  description={t("contact:sections.brief.fields.attachments.description")}
                  onFilesChange={field.onChange}
                  placeholder={t("contact:sections.brief.fields.attachments.placeholder")}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }
      />
      <FormField
        control={control}
        name="nda"
        render={
          ({ field }) => (
            <FormItem>
              <FormLabel>{t("contact:sections.brief.fields.nda.label")}</FormLabel>
              <FormControl>
                <TextArea {...field} placeholder={t("contact:sections.brief.fields.nda.placeholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }
      />
      <AnimatedAlert
        isVisible={!!errors.root}
        onClose={
          () => {
            clearErrors("root");
          }
        }
        variant="error"
      >
        <AlertDescription>{errors.root?.message}</AlertDescription>
      </AnimatedAlert>

      <AnimatedAlert
        isVisible={!!success}
        onClose={
          () => {
            setSuccess(undefined);
          }
        }
        variant="success"
      >
        <AlertDescription>{success}</AlertDescription>
      </AnimatedAlert>

      <Button
        disabled={isValidating}
        isLoading={isSubmitting}
        type="submit"
        variant="cta-primary-with-description"
      >
        <CtaButtonLabelWithDescription
          description={t("contact:sections.brief.submit.description")}
          label={t("contact:sections.brief.submit.title")}
        />
        <ButtonLoadingIndicator />
      </Button>
    </Form>
  );
};

export { ContactForm };
