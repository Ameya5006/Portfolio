import { build } from "esbuild";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const image = await readFile(path.join(root, "public/images/chrome-knot.webp"));
const pdf = await readFile(path.join(root, "public/Ameya_Agarwal_resume.pdf"));
const pdfExpression = `URL.createObjectURL(new Blob([Uint8Array.from(atob('${pdf.toString("base64")}'), c => c.charCodeAt(0))], {type:'application/pdf'}))`;
const output = await build({
  absWorkingDir: root,
  entryPoints: ["src/main.tsx"],
  bundle: true,
  format: "iife",
  platform: "browser",
  minify: true,
  write: false,
  outfile: "review/app.js",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [
    {
      name: "offline-review-assets",
      setup(builder) {
        builder.onLoad(
          { filter: /(?:Sculpture\.tsx|content\.ts)$/ },
          async (args) => {
            let source = await readFile(args.path, "utf8");
            if (args.path.endsWith("Sculpture.tsx"))
              source = source.replace(
                "/images/chrome-knot.webp",
                `data:image/webp;base64,${image.toString("base64")}`,
              );
            if (args.path.endsWith("content.ts"))
              source = source.replace(
                /["']\/Ameya_Agarwal_resume\.pdf["']/,
                pdfExpression,
              );
            return {
              contents: source,
              loader: args.path.endsWith(".tsx") ? "tsx" : "ts",
            };
          },
        );
      },
    },
  ],
});
const js = output.outputFiles
  .find((file) => file.path.endsWith(".js"))
  .text.replace(/<\/script/gi, "<\\/script");
const css = output.outputFiles.find((file) => file.path.endsWith(".css")).text;
const html = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Ameya Agarwal — Undeployed Design Preview</title><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"><style>${css}</style></head><body><div id="root"></div><script>${js}</script></body></html>`;
await mkdir(path.join(root, "review"), { recursive: true });
await writeFile(path.join(root, "review/Ameya-Portfolio-Preview.html"), html);
console.log(
  `Built self-contained review: ${(Buffer.byteLength(html) / 1024).toFixed(0)} KiB; includes sculpture, scripts, styles and résumé.`,
);
