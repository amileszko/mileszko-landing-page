const replaceTemplateVariables = (
  template: string,
  variables: Record<string, string>,
): string => {
  let result = template;
  for (const [
    key,
    value,
  ] of Object.entries(variables)) {
    result = result.replaceAll(
      new RegExp(
        `{{ ${key} }}`,
        "g",
      ),
      value,
    );
  }
  return result;
};

const getSubjectFromTemplate = (template: string): string => {
  const match = /<title>(.*?)<\/title>/i.exec(template);

  return match ? match[1] : "";
};

export const emailTemplatesService = {
  getSubjectFromTemplate,
  replaceTemplateVariables,
};
