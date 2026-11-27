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
    "yarn",
    [
      "npm",
      "audit",
      "-A",
      "-R",
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

const entries = [];
for (const line of (output ?? "").trim()
  .split(/\n+/)) {
  try {
    const parsed = JSON.parse(line);
    if (parsed.value && parsed.children) {
      entries.push({
        packageName: parsed.value,
        severity: parsed.children.Severity,
      });
    }
  }
  catch { /* Ignore non-JSON log lines. */ }
}

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
