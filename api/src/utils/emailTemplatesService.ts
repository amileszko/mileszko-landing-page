const htmlEscapeMap = new Map([
  [
    "&",
    "&amp;",
  ],
  [
    "'",
    "&#39;",
  ],
  [
    "<",
    "&lt;",
  ],
  [
    ">",
    "&gt;",
  ],
  [
    '"',
    "&quot;",
  ],
]);

const escapeHtml = (value: string): string => value.replaceAll(
  /[&<>"']/g,
  character => htmlEscapeMap.get(character) ?? character,
);

const normalizeText = (value: string): string => value
  .replaceAll(
    "\r\n",
    "\n",
  )
  .replaceAll(
    "\r",
    "\n",
  )
  .replaceAll(
    /\p{Cc}/gu,
    character => (character === "\n" || character === "\t" ? character : ""),
  );

type TemplateMode = "html" | "text";

const replaceTemplateVariables = (
  template: string,
  variables: Record<string, string>,
  mode: TemplateMode = "text",
): string => template.replaceAll(
  /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g,
  (match, key: string) => {
    if (!(key in variables)) {
      return match;
    }

    const value = variables[key] ?? "";

    return mode === "html" ? escapeHtml(value) : normalizeText(value);
  },
);

const getSubjectFromTemplate = (template: string): string => {
  const match = /<title>(.*?)<\/title>/i.exec(template);

  return match ? match[1] : "";
};

export const emailTemplatesService = {
  escapeHtml,
  getSubjectFromTemplate,
  replaceTemplateVariables,
};
