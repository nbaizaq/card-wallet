const fs = require("fs");
const path = require("path");

const packageJson = require(path.join(__dirname, "package.json"));

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--patch")) {
    patchVersion();
  }
}

function patchVersion() {
  const version = packageJson.version.split(".");
  version[2] = parseInt(version[2]) + 1;
  packageJson.version = version.join(".");

  fs.writeFileSync(
    path.join(__dirname, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
