import { initI18next } from "../i18n/config";

const onBeforeRenderClient = async () => {
  await initI18next();
};

export default onBeforeRenderClient;
