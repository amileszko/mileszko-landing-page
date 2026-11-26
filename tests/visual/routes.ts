import fs from "node:fs";
import path from "node:path";

const defaultRoot = path.resolve("website/dist/client");

const publicRoutes = (root = defaultRoot) => {
  const routes: string[] = [];

  const walk = (directory: string) => {
    for (const entry of fs.readdirSync(
      directory,
      { withFileTypes: true },
    )) {
      const fullPath = path.join(
        directory,
        entry.name,
      );

      if (entry.isDirectory()) {
        walk(fullPath);
      }
      else if (entry.name === "index.html") {
        const relative = path.relative(
          root,
          directory,
        );
        routes.push(relative === "" ? "/" : `/${relative}`);
      }
    }
  };

  walk(root);
  routes.sort((a, b) => a.localeCompare(b));
  routes.push("/404.html");

  return routes;
};

const routeSlug = (route: string) => {
  if (route === "/") {
    return "home";
  }

  if (route === "/404.html") {
    return "404";
  }

  return route.replace(
    /^\//,
    "",
  )
    .replaceAll(
      /[^a-zA-Z0-9-]+/g,
      "_",
    );
};

export { publicRoutes, routeSlug };
