import { useEffect } from "react";

/** Decorative motion only: text, navigation and document flow remain native. */
export function useArtDirection(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const finePointer = matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const animations = new Set<Animation>();
    const visible = new Set<HTMLElement>();
    const observed = new Set<HTMLElement>();
    let pointerTarget: HTMLElement | null = null;
    let pointerX = 0,
      pointerY = 0,
      frame = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const node = entry.target as HTMLElement;
          node.classList.toggle("motion-in-view", entry.isIntersecting);
          if (entry.isIntersecting) visible.add(node);
          else visible.delete(node);
          if (!entry.isIntersecting || node.dataset.motionEntered) return;
          node.dataset.motionEntered = "true";
          // A quick masked entrance, never scroll-fading body copy or delaying links.
          if (
            node.matches("h2, .experience-row, .credential") &&
            node.animate
          ) {
            const heading = node.matches("h2");
            const animation = node.animate(
              [
                {
                  clipPath: heading ? "inset(0 0 96% 0)" : "inset(0)",
                  translate: `0 ${heading ? 32 : 15}px`,
                },
                { clipPath: "inset(0)", translate: "0 0" },
              ],
              {
                duration: heading ? 850 : 500,
                easing: "cubic-bezier(.16,1,.3,1)",
              },
            );
            animations.add(animation);
            animation.onfinish = () => animations.delete(animation);
            const accent = node.querySelector<HTMLElement>(":scope > .serif");
            if (heading && accent?.animate) {
              const secondLine = accent.animate(
                [{ translate: "0 20px" }, { translate: "0 0" }],
                {
                  duration: 900,
                  delay: 100,
                  easing: "cubic-bezier(.16,1,.3,1)",
                },
              );
              animations.add(secondLine);
              secondLine.onfinish = () => animations.delete(secondLine);
            }
          }
        });
        schedule();
      },
      { threshold: 0.08 },
    );

    const refresh = () => {
      for (const node of observed) {
        if (!node.isConnected) {
          observer.unobserve(node);
          observed.delete(node);
          visible.delete(node);
        }
      }
      document
        .querySelectorAll<HTMLElement>(
          "h2, .project-scene-visual, .experience-row, .credential, .ambient-scene, .leadership-card",
        )
        .forEach((node) => {
          if (!observed.has(node)) {
            observed.add(node);
            observer.observe(node);
          }
        });
      schedule();
    };
    const resetPointer = () => {
      pointerTarget?.style.removeProperty("--hover-x");
      pointerTarget?.style.removeProperty("--hover-y");
      pointerTarget?.style.removeProperty("--shine-x");
      pointerTarget?.style.removeProperty("--shine-y");
      pointerTarget = null;
    };
    function paint() {
      frame = 0;
      if (document.hidden) return;
      visible.forEach((node) => {
        if (!node.matches(".project-scene-visual")) return;
        const rect = node.getBoundingClientRect();
        const progress = Math.max(
          0,
          Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)),
        );
        node.style.setProperty("--scene-y", `${(progress - 0.5) * 26}px`);
      });
      if (pointerTarget) {
        const rect = pointerTarget.getBoundingClientRect();
        const x = Math.max(
          0,
          Math.min(1, (pointerX - rect.left) / Math.max(1, rect.width)),
        );
        const y = Math.max(
          0,
          Math.min(1, (pointerY - rect.top) / Math.max(1, rect.height)),
        );
        pointerTarget.style.setProperty("--hover-x", `${(x - 0.5) * 2}`);
        pointerTarget.style.setProperty("--hover-y", `${(y - 0.5) * 2}`);
        pointerTarget.style.setProperty("--shine-x", `${x * 100}%`);
        pointerTarget.style.setProperty("--shine-y", `${y * 100}%`);
      }
    }
    function schedule() {
      if (!frame && !document.hidden) frame = requestAnimationFrame(paint);
    }
    const move = (event: PointerEvent) => {
      if (!finePointer || event.pointerType === "touch") return;
      const target = (event.target as Element)?.closest<HTMLElement>(
        ".project-scene-visual, .button, .contact-arrow, .leadership-card",
      );
      if (target !== pointerTarget) {
        resetPointer();
        pointerTarget = target ?? null;
      }
      pointerX = event.clientX;
      pointerY = event.clientY;
      schedule();
    };
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        document.documentElement.dataset.tabHidden = "true";
      } else {
        delete document.documentElement.dataset.tabHidden;
        schedule();
      }
    };
    refresh();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("portfolio:layout", refresh);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", resetPointer);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      resetPointer();
      observed.forEach((node) => {
        node.classList.remove("motion-in-view");
        node.style.removeProperty("--scene-y");
        delete node.dataset.motionEntered;
      });
      delete document.documentElement.dataset.tabHidden;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("portfolio:layout", refresh);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener(
        "pointerleave",
        resetPointer,
      );
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [enabled]);
}
