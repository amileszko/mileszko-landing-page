import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([
  ".git",
  ".turbo",
  ".yarn",
  "cdk.out",
  "dist",
  "node_modules",
  "test-results",
]);

const secretPatterns = [
  /AKIA[0-9A-Z]{16}/,
  /ASIA[0-9A-Z]{16}/,
  /-----BEGIN (?:RSA |OPENSSH |EC |PRIVATE )?PRIVATE KEY-----/,
  /ghp_[A-Za-z0-9]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /sk-[A-Za-z0-9]{20,}/,
];

const findings = [];

const walk = (directory) => {
  for (const entry of fs.readdirSync(
    directory,
    { withFileTypes: true },
  )) {
    const fullPath = path.join(
      directory,
      entry.name,
    );

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        walk(fullPath);
      }
      continue;
    }

    if (entry.name === "yarn.lock" || entry.name === "package-lock.json") {
      continue;
    }

    const stat = fs.statSync(fullPath);
    if (stat.size > 1024 * 1024) {
      continue;
    }

    const content = fs.readFileSync(
      fullPath,
      "utf8",
    );
    if (content.includes("\0")) {
      continue;
    }

    const hasSecret = secretPatterns.some(pattern => pattern.test(content));
    if (hasSecret) {
      findings.push(path.relative(
        root,
        fullPath,
      ));
    }
  }
};

walk(root);

if (findings.length > 0) {
  console.error("Potential secrets found:");
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log("Secret scan passed.");
