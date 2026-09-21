import assert from "node:assert/strict";
import { build } from "esbuild";
import { JSDOM, VirtualConsole } from "jsdom";
import { fileURLToPath } from "node:url";

// Exercise the new controller independently from WebGL/GSAP; no fake GPU claims.
const bundle = await build({
  stdin: {
    contents: `import React, {useState} from 'react'; import {createRoot} from 'react-dom/client';
      import {useArtDirection} from './src/useArtDirection';
      function Harness() { const [enabled, set] = useState(false); useArtDirection(enabled); return <>
        <button id="toggle" onClick={()=>set(!enabled)}>Toggle motion</button><h2>Readable heading</h2>
        <a className="project-scene-visual"><div className="project-art">Art</div></a>
        <div className="project-description">Always readable.</div><div className="ambient-scene" />
      </>; } createRoot(document.getElementById('root')).render(<Harness/>);`,
    loader: "tsx",
    resolveDir: fileURLToPath(new URL("../", import.meta.url)),
  },
  bundle: true,
  format: "iife",
  write: false,
  define: { "process.env.NODE_ENV": '"production"' },
});
const errors = [],
  animations = [],
  observers = [];
const log = new VirtualConsole();
log.on("jsdomError", (error) => errors.push(error.message));
const dom = new JSDOM(
  `<div id="root"></div><script>${bundle.outputFiles[0].text}</script>`,
  {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole: log,
    beforeParse(window) {
      window.matchMedia = () => ({ matches: true });
      window.HTMLElement.prototype.animate = function () {
        const record = {
          cancelled: false,
          cancel() {
            this.cancelled = true;
          },
        };
        animations.push(record);
        return record;
      };
      window.HTMLElement.prototype.getBoundingClientRect = () => ({
        left: 0,
        top: 100,
        width: 500,
        height: 350,
      });
      window.IntersectionObserver = class {
        constructor(callback) {
          this.callback = callback;
          this.disconnected = false;
          observers.push(this);
        }
        observe(target) {
          this.callback([{ target, isIntersecting: true }]);
        }
        unobserve() {}
        disconnect() {
          this.disconnected = true;
        }
      };
    },
  },
);
const { document, MouseEvent, Event } = dom.window;
const settle = () => new Promise((resolve) => setTimeout(resolve, 100));
await settle();
assert.equal(
  observers.length,
  0,
  "Disabled motion installs no observers or animation loop.",
);
document.querySelector("#toggle").click();
await settle();
assert.ok(animations.length > 0, "Visible headings receive entrance motion.");
const art = document.querySelector(".project-scene-visual");
art.dispatchEvent(
  new MouseEvent("pointermove", { bubbles: true, clientX: 100, clientY: 200 }),
);
await settle();
assert.ok(
  Number(art.style.getPropertyValue("--hover-x")) < 0,
  "Pointer influences only the artwork.",
);
assert.match(
  art.style.getPropertyValue("--scene-y"),
  /px$/,
  "Scroll progress supplies a bounded art offset.",
);
assert.equal(
  document.querySelector(".project-description").getAttribute("style"),
  null,
  "Body text never receives transforms or opacity.",
);
dom.window.dispatchEvent(new Event("portfolio:layout"));
await settle();
document.querySelector("#toggle").click();
await settle();
assert.ok(
  observers.every((observer) => observer.disconnected),
  "Pause disconnects decorative observers.",
);
assert.ok(
  animations.every((animation) => animation.cancelled),
  "Pause cancels active entrances.",
);
assert.equal(art.style.getPropertyValue("--hover-x"), "");
assert.equal(art.style.getPropertyValue("--scene-y"), "");
assert.equal(document.querySelectorAll(".motion-in-view").length, 0);
assert.equal(errors.length, 0, errors.join("\n"));
dom.window.close();
console.log(
  "PASS — Motion activation, pointer response, scroll offsets, static body text, layout refresh and pause cleanup. GPU output not tested.",
);
