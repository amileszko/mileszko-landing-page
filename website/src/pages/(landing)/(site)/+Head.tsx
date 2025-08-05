import { useStructuredData } from "@components/hooks";
import { type Graph } from "schema-dts";

const Head = () => {
  const {
    owner,
    webPage,
    website,
  } = useStructuredData();

  const graph: Graph = {
    "@context": "https://schema.org",
    "@graph": [
      owner,
      website,
      webPage,
    ],
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(graph)}
    </script>
  );
};

export default Head;
