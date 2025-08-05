import { initI18next } from "../i18n/config";

const onCreateGlobalContext = async () => {
  await initI18next();
};

export default onCreateGlobalContext;
