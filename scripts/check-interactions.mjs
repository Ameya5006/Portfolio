import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { JSDOM, VirtualConsole } from "jsdom";

// Functional DOM tests only. These deliberately do not claim GPU or visual validation.
const html = await readFile(
  new URL("../review/Ameya-Portfolio-Preview.html", import.meta.url),
  "utf8",
);
const errors = [];
const log = new VirtualConsole();
log.on("jsdomError", (error) => errors.push(error.message));
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  virtualConsole: log,
  url: "https://portfolio.test",
  beforeParse(window) {
    window.matchMedia = (query) => ({
      matches: query.includes("prefers-reduced-motion"),
      addEventListener() {},
      removeEventListener() {},
    });
    window.HTMLCanvasElement.prototype.getContext = () => null;
    window.URL.createObjectURL = () => "blob:local-resume-preview";
    window.IntersectionObserver = class {
      constructor(callback) {
        this.callback = callback;
      }
      observe(target) {
        this.callback([{ isIntersecting: true, target }]);
      }
      unobserve() {}
      disconnect() {}
    };
    window.HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
    window.HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
    };
  },
});
const { document, MouseEvent, Node } = dom.window;
const settle = () => new Promise((resolve) => setTimeout(resolve, 100));
const click = async (selector) => {
  const element = document.querySelector(selector);
  assert.ok(element, `Missing control: ${selector}`);
  element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await settle();
};
await settle();
assert.match(document.querySelector("h1").textContent, /AMEYAAGARWAL/);
assert.equal(
  document.querySelector(".arrival"),
  null,
  "Reduced motion skips the intro.",
);
assert.ok(
  document.querySelector(".sculpture.is-poster"),
  "No-WebGL fallback remains visible.",
);
const hero = document.querySelector(".hero");
assert.equal(
  hero.querySelector("h1").nextElementSibling.className,
  "hero-roleline",
);
assert.equal(
  hero.querySelector(".hero-roleline").textContent,
  "FULL-STACK · FLUTTER · AI / ML",
);
assert.equal(hero.querySelectorAll(".hero-actions > a").length, 2);
assert.match(
  hero.querySelector(".hero-actions > a:first-child").textContent,
  /Enter the playground/,
);
assert.match(
  hero.querySelector(".hero-actions > a:last-child").textContent,
  /View Résumé/,
);
assert.equal(
  hero.querySelector(".hero-resume").href,
  "blob:local-resume-preview",
  "The standalone preview embeds the PDF, independent of source quote style.",
);
assert.equal(hero.querySelectorAll(".signal-current").length, 7);
assert.equal(
  hero.querySelector(".signal-field").getAttribute("aria-hidden"),
  "true",
);
assert.equal(document.querySelectorAll(".project-light").length, 4);
assert.equal(
  hero.textContent.replace(/\s+/g, " ").trim(),
  "AMEYAAGARWALFULL-STACK · FLUTTER · AI / MLEnter the playground View Résumé (opens in a new tab)",
  "The hero contains only the requested name, role line and action text.",
);
const projectTitles = () =>
  [...document.querySelectorAll(".project-title h3")].map(
    (node) => node.textContent,
  );
assert.deepEqual(projectTitles(), [
  "GymFlow",
  "PalmChef",
  "Amedic",
  "FloatChat / ARGO Mobile",
]);
for (const scene of document.querySelectorAll(".project-scene")) {
  const description = scene.querySelector(".project-summary");
  const visual = scene.querySelector(".project-scene-visual");
  assert.ok(
    description.textContent.trim().length > 30,
    "Every artwork has its description in the same article.",
  );
  assert.ok(
    description.compareDocumentPosition(visual) &
      Node.DOCUMENT_POSITION_FOLLOWING,
    "Descriptions precede artwork in the mobile reading order.",
  );
  assert.equal(
    scene.querySelector("[inert], [aria-hidden='true'] .project-summary"),
    null,
  );
  assert.equal(scene.hasAttribute("hidden"), false);
  assert.ok(scene.classList.contains("is-visible"));
}
assert.equal(document.querySelector('[aria-label="Next project"]'), null);
await click('[aria-label="Filter projects"] button:nth-child(3)');
assert.deepEqual(projectTitles(), ["Amedic", "FloatChat / ARGO Mobile"]);
assert.match(
  document.querySelector("#project-ocean .technical-details p").textContent,
  /latlong2/,
);
await click('[aria-label="Filter projects"] button:nth-child(2)');
assert.deepEqual(projectTitles(), ["GymFlow", "PalmChef"]);
await click('[aria-label="Filter projects"] button:nth-child(1)');
assert.equal(
  document.querySelectorAll(".project-scene.is-visible").length,
  4,
  "Projects reveal again after filtering changes the mounted list.",
);
assert.match(
  document.querySelector(".milestone p").textContent,
  /6th out of 590 teams/,
);
assert.match(
  document.querySelector(".milestone-progress").textContent,
  /Top 100 → 6th \/ 590 teams/,
);
assert.match(
  document.querySelector(".milestone-previous").textContent,
  /university-level round/,
);
await click('[aria-controls="skills-0"]');
assert.equal(document.querySelector("#skills-0").hidden, false);
assert.match(document.querySelector("#skills-0").textContent, /Python/);
assert.equal(document.querySelector("#skills-3").hidden, true);
await click(".site-header .menu-button");
assert.ok(document.querySelector(".menu-dialog[open]"));
await click('.menu-dialog a[href="#journey"]');
assert.equal(
  document.querySelector(".menu-dialog").hasAttribute("open"),
  false,
);
await click('[aria-label="cobalt sculpture finish"]');
assert.ok(document.querySelector(".sculpture.finish-cobalt"));
assert.equal(errors.length, 0, errors.join("\n"));
dom.window.close();
console.log(
  "PASS — Simplified hero, adjacent résumé link, four scrollable projects with descriptions, filters, SIH result, skill disclosure, menu navigation, finish controls and reduced-motion/WebGL fallback.",
);
