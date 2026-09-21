import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import postcss from "postcss";

// Token-level contrast checks, not a substitute for a rendered accessibility audit.
const files = ["styles.css", "project-flow.css", "art-direction.css"];
const sheets = await Promise.all(
  files.map(async (file) =>
    postcss.parse(
      await readFile(new URL(`../src/${file}`, import.meta.url), "utf8"),
    ),
  ),
);
function property(selector, name) {
  let result;
  sheets.forEach((sheet) =>
    sheet.walkRules((rule) => {
      if (!rule.selectors.includes(selector)) return;
      rule.walkDecls(name, (declaration) => {
        result = declaration.value;
      });
    }),
  );
  assert.ok(result, `Missing ${selector} ${name}`);
  return result.replace(/var\((--[\w-]+)\)/g, (_, token) =>
    property(":root", token),
  );
}
function luminance(hex) {
  assert.match(
    hex,
    /^#[\da-f]{6}$/i,
    "Check opaque six-digit colors explicitly.",
  );
  const rgb = hex
    .slice(1)
    .match(/../g)
    .map((value) => {
      const channel = parseInt(value, 16) / 255;
      return channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
const pairs = [
  ["Project body", ".project-scene .project-description > p", ".light-section"],
  [
    "Project bullets",
    ".project-scene .project-description li",
    ".light-section",
  ],
  ["Tags", ".tags > span", ".tags > span"],
  ["Leadership", ".leadership-card p", ".leadership-card"],
  ["Council", ".council p", ".council"],
  ["Credential labels", ".credential .eyebrow", ".light-section"],
  ["Practice footnote", ".practice-right > small", ".light-section"],
  ["AI body", ".ai-editorial p", ".stack-section"],
  ["Toolkit tags", ".skill-content > span", ".skill-content > span"],
  ["Footer copy", ".contact-bottom > p", ".contact-section"],
];
for (const [name, foreground, background] of pairs) {
  const values = [
    luminance(property(foreground, "color")),
    luminance(property(background, "background")),
  ].sort((a, b) => b - a);
  const contrast = (values[0] + 0.05) / (values[1] + 0.05);
  assert.ok(contrast >= 4.5, `${name}: ${contrast.toFixed(2)}:1 is too faint`);
  console.log(`${name}: ${contrast.toFixed(2)}:1`);
}
for (const selector of [
  ".project-scene .project-description > p",
  ".experience-row p",
  ".leadership-card p",
  ".ai-editorial p",
  ".contact-bottom > p",
])
  assert.ok(
    parseFloat(property(selector, "font-size")) >= 16,
    `${selector}: body text is too small`,
  );
console.log(
  "PASS — Ten specified text/surface pairs exceed 4.5:1; core body styles remain at least 16px at the smallest breakpoint. Not a full-page WCAG audit.",
);
