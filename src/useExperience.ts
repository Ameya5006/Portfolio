import { useEffect } from "react";

/** Lenis, ScrollTrigger and the enhanced scene share GSAP's frame clock. */
export function useExperience(motion: boolean, paused: boolean) {
  useEffect(() => {
    if (!motion) return;
    let alive = true;
    let cleanup = () => {};
    Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        if (!alive) return;
        gsap.registerPlugin(ScrollTrigger);
        const coarse = matchMedia("(pointer: coarse)").matches;
        const lenis = new Lenis({
          autoRaf: false,
          lerp: 0.11,
          smoothWheel: !coarse,
          syncTouch: false,
          anchors: true,
          prevent: (node) => node.closest("dialog") !== null,
        });
        if (paused) lenis.stop();
        const ticker = (time: number) => {
          lenis.raf(time * 1000);
          if (!document.hidden)
            window.dispatchEvent(new Event("portfolio:frame"));
        };
        gsap.ticker.add(ticker);
        const scroll = () => ScrollTrigger.update();
        lenis.on("scroll", scroll);
        const heroMotion = gsap.to(".hero-copy", {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom 15%",
            scrub: 0.5,
          },
        });
        const trigger = ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const velocity = Math.max(
              -1600,
              Math.min(1600, self.getVelocity()),
            );
            window.dispatchEvent(
              new CustomEvent("portfolio:scroll", {
                detail: { progress: self.progress, velocity },
              }),
            );
            document.documentElement.style.setProperty(
              "--scroll-lean",
              `${velocity / 900}deg`,
            );
          },
        });
        const velocityDecay = gsap.quickTo(
          document.documentElement,
          "--scroll-lean",
          { duration: 0.5, ease: "power2.out" },
        );
        const settle = () => {
          velocityDecay(0);
        };
        ScrollTrigger.addEventListener("scrollEnd", settle);
        const refreshLayout = () => {
          lenis.resize();
          ScrollTrigger.refresh();
        };
        window.addEventListener("portfolio:layout", refreshLayout);
        cleanup = () => {
          gsap.ticker.remove(ticker);
          window.dispatchEvent(new Event("portfolio:release-clock"));
          lenis.off("scroll", scroll);
          lenis.destroy();
          trigger.kill();
          heroMotion.scrollTrigger?.kill();
          heroMotion.revert();
          ScrollTrigger.removeEventListener("scrollEnd", settle);
          window.removeEventListener("portfolio:layout", refreshLayout);
          velocityDecay.tween.kill();
          document.documentElement.style.removeProperty("--scroll-lean");
        };
        ScrollTrigger.refresh();
      })
      .catch(() => {
        /* Native scrolling is the baseline if the motion chunk fails. */
      });
    return () => {
      alive = false;
      cleanup();
    };
  }, [motion, paused]);
}

export function useReactiveCursor(motion: boolean) {
  useEffect(() => {
    if (!motion || !matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const cursor = document.querySelector<HTMLElement>(".reactive-cursor");
    if (!cursor) return;
    let frame = 0;
    let targetX = -100,
      targetY = -100,
      x = -100,
      y = -100;
    const tick = () => {
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.15)
        frame = requestAnimationFrame(tick);
      else frame = 0;
    };
    const move = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.dataset.visible = "true";
      cursor.dataset.active = String(
        Boolean((event.target as Element)?.closest("a, button, summary")),
      );
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const leave = () => {
      cursor.dataset.visible = "false";
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      cursor.dataset.visible = "false";
    };
  }, [motion]);
}
