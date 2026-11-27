import fs from "node:fs";
import path from "node:path";

const root = path.resolve(
  import.meta.dirname,
  "..",
);
const clientRoot = path.join(
  root,
  "dist",
  "client",
);

const budgets = {
  dist: 14 * 1024 * 1024,
  font: 450 * 1024,
  javascript: 1_800_000,
  largestChunk: 800_000,
  video: 7 * 1024 * 1024,
};

const walk = (directory) => {
  const files = [];

  for (const entry of fs.readdirSync(
    directory,
    { withFileTypes: true },
  )) {
    const fullPath = path.join(
      directory,
      entry.name,
    );

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    }
    else {
      files.push(fullPath);
    }
  }

  return files;
};

const formatBytes = bytes => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

const failures = [];
const files = walk(clientRoot);
const videoPath = path.join(
  clientRoot,
  "intro.mp4",
);
const videoSize = fs.statSync(videoPath)
  .size;
let fontSize = 0;
let javascriptSize = 0;
let largestChunk = 0;
let distSize = 0;

for (const file of files) {
  const size = fs.statSync(file)
    .size;

  distSize += size;

  if (file.endsWith(".woff2")) {
    fontSize += size;
  }

  if (file.endsWith(".js")) {
    javascriptSize += size;
    largestChunk = Math.max(
      largestChunk,
      size,
    );
  }
}

const check = (
  label,
  actual,
  budget,
) => {
  if (actual > budget) {
    failures.push(`${label}: ${formatBytes(actual)} > ${formatBytes(budget)}`);
  }
};

check(
  "dist/client",
  distSize,
  budgets.dist,
);
check(
  "fonts",
  fontSize,
  budgets.font,
);
check(
  "JavaScript",
  javascriptSize,
  budgets.javascript,
);
check(
  "largest JS chunk",
  largestChunk,
  budgets.largestChunk,
);
check(
  "intro.mp4",
  videoSize,
  budgets.video,
);

console.log(`dist/client: ${formatBytes(distSize)}`);
console.log(`fonts: ${formatBytes(fontSize)}`);
console.log(`JavaScript: ${formatBytes(javascriptSize)}`);
console.log(`largest JS chunk: ${formatBytes(largestChunk)}`);
console.log(`intro.mp4: ${formatBytes(videoSize)}`);

if (failures.length > 0) {
  throw new Error(`Build size budget exceeded:\n${failures.join("\n")}`);
}
