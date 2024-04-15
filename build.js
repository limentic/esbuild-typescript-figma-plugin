const { build } = require("esbuild");
const fs = require("fs").promises;
const path = require("path");
const tmp = require("tmp");

const srcDir = "ui-src";
const entryPoint = `${srcDir}/index.ts`;

async function bundle(srcDir, entryPoint) {
  const { name: tempDir } = tmp.dirSync();

  const files = await fs.readdir(srcDir);
  const tsFiles = files
    .filter((file) => file.endsWith(".ts"))
    .map((file) => path.join(srcDir, file));

  await build({
    entryPoints: [entryPoint],
    bundle: true,
    outfile: path.join(tempDir, "index.js"),
    tsconfig: "ui-src/tsconfig.json",
    minify: true, // Minify the output
  });

  let res = await fs.readFile(path.join(tempDir, "index.js"), "utf8");

  // Cleanup
  await fs.unlink(path.join(tempDir, "index.js"));
  await fs.rm(tempDir, { recursive: true });

  return res;
}

async function main() {
  try {
    const res = await bundle(srcDir, entryPoint);

    try {
      await fs.access(`${srcDir}/index.html`);
    } catch (err) {
      throw new Error("index.html file not found");
    }

    const htmlFile = await fs.readFile(`${srcDir}/index.html`, "utf8");
    const newHtmlFile = htmlFile.replace("{{placeholder}}", res);

    // Ensure 'dist' directory exists
    await fs.mkdir("./dist", { recursive: true });

    await fs.writeFile("./dist/index.html", newHtmlFile, "utf8");

    console.log("Build completed successfully!");
  } catch (err) {
    console.error("Build failed:", err);
    process.exit(1);
  }
}

main();
