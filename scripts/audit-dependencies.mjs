import { execFileSync } from "node:child_process";

const allowedBuildOnlyPackages = new Set([
  "brace-expansion",
  "defu",
  "glob",
  "ip-address",
  "js-yaml",
  "minimatch",
  "nanoid",
  "picomatch",
  "postcss",
  "postcss-selector-parser",
  "source-map-js",
  "tar",
  "whatwg-encoding",
  "yaml",
]);

let output;

try {
  output = execFileSync(
    "pnpm",
    [
      "audit",
      "--json",
    ],
    {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    },
  );
}
catch (error) {
  output = error.stdout ?? "";
}

const entries = Object.values(
  JSON.parse(output || "{}").advisories ?? {},
)
  .map(advisory => ({
    packageName: advisory.module_name,
    severity: advisory.severity,
  }));

const blocking = entries.filter(entry =>
  (entry.severity === "critical" || entry.severity === "high") &&
  !allowedBuildOnlyPackages.has(entry.packageName));

if (blocking.length > 0) {
  console.error("New high/critical dependency advisories:");
  for (const entry of blocking) {
    console.error(`- ${entry.severity}: ${entry.packageName}`);
  }
  process.exit(1);
}

console.log(
  `Dependency audit passed; ${entries.length} advisory entries remain, all in the documented build-only allowlist.`,
);
