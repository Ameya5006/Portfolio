import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const revision = "715756e9f90e98bc6dcf429d9aa612b953b44986";
const original = execFileSync("git", ["show", `${revision}:src/App.tsx`], {
  encoding: "utf8",
});
const current = await readFile(
  new URL("../src/content.ts", import.meta.url),
  "utf8",
);
const protectedNames = [
  "github",
  "linkedin",
  "navigation",
  "projects",
  "toolkit",
  "experience",
  "supportingExperience",
  "certifications",
];
const valueOf = (node) => {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isIdentifier(node)) return { identifier: node.text };
  if (ts.isPrefixUnaryExpression(node))
    return { operator: node.operator, value: valueOf(node.operand) };
  if (ts.isArrayLiteralExpression(node))
    return node.elements.map((element) => valueOf(element));
  if (ts.isObjectLiteralExpression(node))
    return Object.fromEntries(
      node.properties.map((property) => {
        assert.ok(
          ts.isPropertyAssignment(property),
          "Protected content uses plain properties.",
        );
        const name =
          ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)
            ? property.name.text
            : property.name.getText();
        return [name, valueOf(property.initializer)];
      }),
    );
  throw new Error(
    `Unsupported protected content expression: ${node.getText()}`,
  );
};
const extract = (source, filename) => {
  const file = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const values = {};
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        !ts.isIdentifier(declaration.name) ||
        !protectedNames.includes(declaration.name.text)
      )
        continue;
      assert.ok(
        declaration.initializer,
        `Missing initializer for ${declaration.name.text}`,
      );
      values[declaration.name.text] = valueOf(declaration.initializer);
    }
  }
  return values;
};
assert.deepEqual(
  extract(current, "content.ts"),
  extract(original, "baseline.tsx"),
  "The redesign must preserve the original projects, toolkit, experience and certification data exactly.",
);
const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
for (const copy of [
  "Selected to support placement coordination while continuing to build technical projects.",
  "Trusted with teams, resources and event logistics—including the smooth execution of Uphoria, the university’s three-day annual fest.",
  "Working through the ML pipeline—from data preparation and feature engineering to training, evaluation, deployment and monitoring.",
  "Repository snapshot · 5 Sep 2026",
  "Streak: 2–4 Sep · Synced submissions only",
])
  assert.ok(
    app.replace(/\s+/g, " ").includes(copy),
    `Missing original copy: ${copy}`,
  );
console.log(
  "PASS — Original content values match structurally; key inline facts and dated practice-stat caveats are preserved.",
);
