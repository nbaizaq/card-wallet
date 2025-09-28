const fs = require("fs");
const path = require("path");
const recast = require("recast");
const packageJson = require(path.join(__dirname, "package.json"));

const defaultFilePath = "public/sw.js";

function getFilePathFromArgs() {
  const filePath = process.argv.slice(2)[0];
  return filePath;
}

function getFilePath() {
  const filePath = getFilePathFromArgs() ?? defaultFilePath;
  return path.join(__dirname, filePath);
}

function getFile(fullPath) {
  return fs.readFileSync(fullPath, "utf8");
}

function main() {
  const filePath = getFilePath();
  const file = getFile(filePath);
  const ast = recast.parse(file);

  let success = false;
  for (let i = 0; i < ast.program.body.length; i++) {
    const node = ast.program.body[i];
    if (node.type === "VariableDeclaration") {
      const { declarations } = node;
      const declaration = declarations[0];
      const { name } = declaration.id;
      if (name === "version") {
        declaration.init = recast.types.builders.literal(packageJson.version);
        success = true;
        break;
      }
    }
  }

  if (success) {
    const output = recast.print(ast).code;
    fs.writeFileSync(filePath, output, "utf-8");
    console.log("Service worker file updated!");
  }
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
