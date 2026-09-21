import { useEffect, useRef, useState } from "react";
import type { SculptureController } from "./sculpture-engine";

export type Finish = "silver" | "warm" | "cobalt";

export default function Sculpture({
  motion,
  finish,
}: {
  motion: boolean;
  finish: Finish;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<SculptureController | null>(null);
  const current = useRef({ motion, finish });
  const [ready, setReady] = useState(false);
  current.current = { motion, finish };

  useEffect(() => {
    const element = host.current;
    const surface = canvas.current;
    if (!element || !surface) return;
    let alive = true;
    let frame = 0;
    const context = surface.getContext("webgl2", {
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });

    if (context) {
      import("./sculpture-engine")
        .then(({ createSculpture }) => {
          if (!alive) return;
          engine.current = createSculpture(surface, context, element);
          engine.current.setMotion(current.current.motion);
          engine.current.setFinish(current.current.finish);
          setReady(true);
        })
        .catch(() => {
          if (alive) setReady(false);
        });
    }

    const pointer = (event: PointerEvent) => {
      if (!current.current.motion || event.pointerType === "touch") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
        element.style.setProperty("--pointer-x", `${x * 12}px`);
        element.style.setProperty("--pointer-y", `${y * 10}px`);
        element.style.setProperty("--tilt", `${x * 3}deg`);
        engine.current?.setPointer(x, y);
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      element.style.setProperty("--pointer-x", "0px");
      element.style.setProperty("--pointer-y", "0px");
      element.style.setProperty("--tilt", "0deg");
      engine.current?.setPointer(0, 0);
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      setReady(false);
      engine.current?.setMotion(false);
    };
    window.addEventListener("pointermove", pointer);
    document.documentElement.addEventListener("pointerleave", reset);
    surface.addEventListener("webglcontextlost", contextLost);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", pointer);
      document.documentElement.removeEventListener("pointerleave", reset);
      surface.removeEventListener("webglcontextlost", contextLost);
      engine.current?.dispose();
      engine.current = null;
    };
  }, []);

  useEffect(() => {
    engine.current?.setMotion(motion);
  }, [motion]);
  useEffect(() => {
    engine.current?.setFinish(finish);
  }, [finish]);

  return (
    <div
      ref={host}
      className={`sculpture finish-${finish} ${ready ? "is-rendered" : "is-poster"}`}
      aria-hidden="true"
    >
      <div className="sculpture-halo" />
      <div className="sculpture-parallax">
        <img
          className="sculpture-poster"
          src="/images/chrome-knot.webp"
          width="1254"
          height="1254"
          alt=""
          fetchPriority="high"
        />
      </div>
      <canvas ref={canvas} className="sculpture-canvas" />
    </div>
  );
}
