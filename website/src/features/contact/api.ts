import { type paths } from "@mileszko-landing-page/api/types";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

const fetchClient = createFetchClient<paths>({
  baseUrl:
  import.meta.env.VITE_API_URL,
});

const $api = createClient(fetchClient);

const useSendContactMessageMutation = () => {
  return $api.useMutation(
    "post",
    "/contact/messages",
  );
};

export { useSendContactMessageMutation };
